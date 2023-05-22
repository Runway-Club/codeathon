package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"time"

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

func (js *judgeService) request(jReq *models.JudgeSubmissionRequest, tc *models.TestCase) (*string, error) {
	req, err := json.Marshal(jReq)

	if err != nil {
		return nil, err
	}

	resp, err := http.Post(js.Judge0+"/submissions/", "application/json", bytes.NewBuffer(req))

	if err != nil {
		return nil, err
	}

	resData, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		return nil, err
	}

	token := &struct {
		Token string `json:"token"`
	}{}

	if err := json.Unmarshal(resData, token); err != nil {
		return nil, err
	}

	return &token.Token, nil
}

func (js *judgeService) getJudgeSubmissionResponse(token *string) (*models.JudgeSubmissionResponse, error) {
	judgeSubmissionResponse := &models.JudgeSubmissionResponse{}

	statusID := 0

	for statusID <= 2 {
		resp, err := http.Get(js.Judge0 + "/submissions/" + *token)

		if err != nil {
			return nil, err
		}

		resData, err := ioutil.ReadAll(resp.Body)

		if err != nil {
			return nil, err
		}

		if err := json.Unmarshal(resData, judgeSubmissionResponse); err != nil {
			return nil, err
		}

		statusID = judgeSubmissionResponse.Status.ID
		time.Sleep(2 * time.Second)
	}

	return judgeSubmissionResponse, nil
}

func (js *judgeService) generateTestCaseResult(jRes *models.JudgeSubmissionResponse, tc *models.TestCase) (*models.TestcaseResult, error) {
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

	ntc := len(tcs)

	jReqChannel := make(chan *models.JudgeRequestChannel, ntc)
	jResChannel := make(chan *models.JudgeResponseChannel, ntc)

	for i := 0; i < ntc; i++ {
		go js.judgeWorker(jReqChannel, jResChannel)
	}

	for k := range tcs {
		jur := &models.JudgeRequestChannel{
			Submission: submission,
			TestCase:   &tcs[k],
		}

		jReqChannel <- jur
	}

	close(jReqChannel)

	actualScore := int32(0)
	result := "ACCEPTED"

	totalScore := int32(0)
	totalTime := float64(0)
	totalMemory := int32(0)

	for i := 0; i < ntc; i++ {
		jRes := <-jResChannel

		tcr := jRes.TestCaseResult
		tc := jRes.TestCase

		if err != nil {
			println(err.Error())
			continue
		}

		if tcr.Message == "PASS" {
			actualScore += jRes.TestCase.Score
		}

		if tcr.Message != "PASS" {
			if tcr.Memory >= tc.MemoryLimit {
				result = "Memory Limit Exceeded"
			} else if tcr.Time >= float64(tc.TimeLimit) {
				result = "Time Limit Exceeded"
			} else if tcr.Stderr != "" {
				result = "Runtime Error " + tcr.Stderr
			} else if tcr.Message != "PASS" {
				result = "FAIL"
			}
		}

		totalScore += jRes.TestCase.Score
		totalTime += tcr.Time
		totalMemory += tcr.Memory

		if err := js.TCService.StoreResult(c, tcr); err != nil {
			println(err.Error())
			continue
		}
	}

	fmt.Println("Finished evaluating submission", submission.ID.Hex())

	submission.Score = actualScore
	submission.Evaluated = true
	submission.TotalTime = totalTime
	submission.TotalMemory = totalMemory
	submission.TotalScore = totalScore
	submission.Result = result

	if err := js.SService.UpdateSubmissionResult(c, submission); err != nil {
		return err
	}

	return nil
}

func (js *judgeService) Evaluation(token *string, tc *models.TestCase, res chan<- *models.JudgeResponseChannel) {
	judgeResponseChannel := &models.JudgeResponseChannel{
		TestCaseResult: &models.TestcaseResult{},
		TestCase:       tc,
	}

	jRes, _ := js.getJudgeSubmissionResponse(token)

	tcr, _ := js.generateTestCaseResult(jRes, tc)

	judgeResponseChannel.TestCaseResult = tcr

	fmt.Println("Worker finished evaluating testcase", tc.ID)
	res <- judgeResponseChannel
}

func (js *judgeService) judgeWorker(req <-chan *models.JudgeRequestChannel, res chan<- *models.JudgeResponseChannel) {
	for jur := range req {
		fmt.Println("Worker is evaluating testcase", jur.TestCase.ID)

		judgeSubmissionRequest := &models.JudgeSubmissionRequest{
			SourceCode:   jur.Submission.Code,
			LanguageId:   jur.Submission.LanguageID,
			Stdin:        jur.TestCase.Input,
			CpuTimeLimit: jur.TestCase.TimeLimit,
			MemoryLimit:  jur.TestCase.MemoryLimit,
		}

		token, err := js.request(judgeSubmissionRequest, jur.TestCase)

		if err != nil {
			println(err.Error())
			continue
		}

		go js.Evaluation(token, jur.TestCase, res)
	}
}
