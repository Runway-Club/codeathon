package service

import (
	"bytes"
	"context"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"

	"runwayclub.dev/codeathon/v2/models"
)

type judgeService struct {
	Judge0    string
	TCService models.TestCaseService
	SService  models.SubmissionService
}

func NewJudgeService(tcs models.TestCaseService, ss models.SubmissionService, judge0 string) models.JudgeCEService {
	return &judgeService{
		Judge0:    judge0,
		TCService: tcs,
		SService:  ss,
	}
}

func (js *judgeService) request(jReq *models.JudgeSubmissionRequest, tc *models.TestCase) (*models.JudgeSubmissionResponse, error) {
	req, err := json.Marshal(jReq)

	if err != nil {
		return nil, err
	}

	resp, err := http.Post(js.Judge0+"/submissions/?wait=true", "application/json", bytes.NewBuffer(req))

	if err != nil {
		return nil, err
	}

	resData, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		return nil, err
	}

	judgeSubmissionResponse := &models.JudgeSubmissionResponse{}

	if err := json.Unmarshal(resData, judgeSubmissionResponse); err != nil {
		return nil, err
	}

	return judgeSubmissionResponse, nil
}

func (js *judgeService) receive(jRes *models.JudgeSubmissionResponse, tc *models.TestCase) (*models.TestcaseResult, error) {
	tcr := &models.TestcaseResult{}

	time, _ := strconv.ParseFloat(jRes.Time, 64)
	memory := jRes.Memory

	output := &struct {
		Expected string
		Stdout   string
		Stderr   string
		Message  string
	}{
		Expected: strings.TrimSpace(tc.ExpectedOutput),
		Stdout:   strings.TrimSpace(jRes.Stdout),
		Stderr:   strings.TrimSpace(jRes.Stderr),
		Message:  strings.TrimSpace(jRes.Message),
	}

	if output.Stderr == "" {
		tcr.Output = output.Stdout
	}

	tcr.Stderr = output.Stderr

	if output.Expected == output.Stdout {
		tcr.Message = "PASS"
	} else {
		if memory >= tc.MemoryLimit {
			tcr.Message = "Memory Limit Exceeded"
		} else if output.Message != "" {
			tcr.Message = output.Message
		} else {
			tcr.Message = "FAIL"
		}

		if tc.ViewOnFailure {
			tcr.Input = tc.Input
			tcr.ExpectedOutput = tc.ExpectedOutput
		}
	}

	tcr.Time = time
	tcr.Memory = memory

	return tcr, nil

}

func (js *judgeService) RequestEvaluation(c context.Context, submission *models.SubmissionResult) error {
	tcs, err := js.TCService.Fetch(c, submission.ProblemID.Hex())

	if err != nil {
		return err
	}

	jReqChannel := make(chan *models.JudgeRequestChannel, len(tcs))
	jResChannel := make(chan *models.JudgeResponseChannel, len(tcs))

	go js.judgeWorker(jReqChannel, jResChannel)

	for k := range tcs {
		jur := &models.JudgeRequestChannel{
			Submission: submission,
			TestCase:   &tcs[k],
		}

		jReqChannel <- jur
	}

	close(jReqChannel)

	actualScore := int32(0)

	totalScore := int32(0)
	totalTime := float64(0)
	totalMemory := int32(0)

	for jRes := range jResChannel {
		tcr, err := js.receive(jRes.JudgeSubmissionResponse, jRes.TestCase)

		if err != nil {
			println(err.Error())
			continue
		}

		if tcr.Message == "PASS" {
			actualScore += jRes.TestCase.Score
		}

		totalScore += jRes.TestCase.Score
		totalTime += tcr.Time
		totalMemory += tcr.Memory

		if err := js.TCService.StoreResult(c, tcr); err != nil {
			println(err.Error())
			continue
		}
	}

	submission.Score = actualScore
	submission.Evaluated = true
	submission.TotalTime = totalTime
	submission.TotalMemory = totalMemory
	submission.TotalScore = totalScore

	if err := js.SService.UpdateSubmissionResult(c, submission); err != nil {
		return err
	}

	return nil
}

func (js *judgeService) judgeWorker(req <-chan *models.JudgeRequestChannel, res chan<- *models.JudgeResponseChannel) {
	for jur := range req {
		judgeSubmissionRequest := &models.JudgeSubmissionRequest{
			SourceCode:   jur.Submission.Code,
			LanguageId:   jur.Submission.LanguageID,
			Stdin:        jur.TestCase.Input,
			CpuTimeLimit: jur.TestCase.TimeLimit,
			MemoryLimit:  jur.TestCase.MemoryLimit,
		}

		jRes, err := js.request(judgeSubmissionRequest, jur.TestCase)

		if err != nil {
			println(err.Error())
			continue
		}

		judgeResponseChannel := &models.JudgeResponseChannel{
			JudgeSubmissionResponse: jRes,
			TestCase:                jur.TestCase,
		}

		res <- judgeResponseChannel
	}

	close(res)
}
