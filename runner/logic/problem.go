package logic

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"

	"cloud.google.com/go/firestore"
	"runwayclub.dev/codeathon/v2/core"
	"runwayclub.dev/codeathon/v2/models"
)

type ProblemLogic struct {
	db     *firestore.Client
	config *core.Config
}

func NewProblemLogic(server *core.Server) *ProblemLogic {
	client, err := server.App.Firestore(context.Background())
	if err != nil {
		panic(err)
	}
	return &ProblemLogic{
		db:     client,
		config: server.Config,
	}
}

func (l *ProblemLogic) Get(id string) (*models.Problem, error) {
	// load problem from firestore
	docRef := l.db.Collection("problems").Doc(id)
	doc, err := docRef.Get(context.Background())
	if err != nil {
		return nil, err
	}
	// parse data to problem
	problem := &models.Problem{}
	docData, err := json.Marshal(doc.Data())
	if err != nil {
		return nil, err
	}
	// marshal data to problem
	if err := json.Unmarshal(docData, problem); err != nil {
		return nil, err
	}
	return problem, nil
}

func (l *ProblemLogic) RequestEvaluate(submission *models.Submission) error {
	// load problem
	problem, err := l.Get(submission.ProblemId)
	if err != nil {
		return err
	}
	tokens := make([]string, 0)
	for _, testcase := range problem.TestCases {
		judgeSubmitionRequestByte, err := json.Marshal(&models.JudgeSubmissionRequest{
			SourceCode:   submission.Source,
			LanguageId:   submission.LanguageId,
			Stdin:        testcase.Input,
			CpuTimeLimit: testcase.TimeLimit,
			MemoryLimit:  testcase.MemoryLimit,
		})
		if err != nil {
			return err
		}
		res, err := http.Post(l.config.Judge0+"/submissions/", "application/json", bytes.NewBuffer(judgeSubmitionRequestByte))
		println(res.StatusCode)
		if err != nil {
			return err
		}
		if res.StatusCode != http.StatusCreated {
			// print body
			body, err := ioutil.ReadAll(res.Body)
			if err != nil {
				return err
			}

			return errors.New(string(body))
		}
		defer res.Body.Close()
		// parse response to judgeSubmissionResponse
		judgeSubmissionResponse := &models.JudgeSubmissionAsyncResponse{}
		if err := json.NewDecoder(res.Body).Decode(judgeSubmissionResponse); err != nil {
			return err
		}
		println(judgeSubmissionResponse.Token)
		tokens = append(tokens, judgeSubmissionResponse.Token)
	}
	currentTime := time.Now().UnixMilli()
	// save tokens to firestore
	l.db.Collection("submissions").Add(context.Background(), map[string]interface{}{
		"problem_id": submission.ProblemId,
		"user_id":    submission.UserId,
		"tokens":     tokens,
		"time":       currentTime,
		"evaluated":  false,
	})
	return nil
}

func (l *ProblemLogic) Evaluate(submissionId string) error {
	// get submission from firestore
	docRef := l.db.Collection("submissions").Doc(submissionId)
	doc, err := docRef.Get(context.Background())
	if err != nil {
		return err
	}
	// parse data to submission
	waitingSubmission := &models.WaitingSubmission{}
	waitingSubmissionData, _ := json.Marshal(doc.Data())
	// parse to waitingSubmission
	if err := json.Unmarshal(waitingSubmissionData, waitingSubmission); err != nil {
		return err
	}

	println(waitingSubmission.ProblemId)

	// get problem from firestore
	problem, err := l.Get(waitingSubmission.ProblemId)
	if err != nil {
		return err
	}
	totalScore := 0
	actualScore := 0
	totalTime := float64(0)
	totalMemory := float64(0)
	testResults := make([]models.TestcaseResult, 0)

	for i, testcase := range problem.TestCases {
		totalScore += testcase.Score
		testResult := &models.TestcaseResult{}
		// get judgeSubmissionResponse
		res, err := http.Get(l.config.Judge0 + "/submissions/" + waitingSubmission.Tokens[i])
		if res.StatusCode != http.StatusOK {
			// response body
			body, err := ioutil.ReadAll(res.Body)
			if err != nil {
				return err
			}
			return errors.New(string(body))
		}
		if err != nil {
			return err
		}
		defer res.Body.Close()
		// parse response to judgeSubmissionResponse
		judgeSubmissionResponse := &models.JudgeSubmissionResponse{}
		// unmarshal response to judgeSubmissionResponse
		resData, _ := ioutil.ReadAll(res.Body)
		println(string(resData))
		if err := json.Unmarshal(resData, judgeSubmissionResponse); err != nil {
			return err
		}
		parsedTime, _ := strconv.ParseFloat(judgeSubmissionResponse.Time, 64)
		println(judgeSubmissionResponse.Stdout)
		if testcase.ExpectedOutput == judgeSubmissionResponse.Stdout {
			actualScore += testcase.Score
			totalMemory += float64(judgeSubmissionResponse.Memory)
			totalTime += parsedTime
			testResult.Message = "PASS"
			testResult.Input = testcase.Input
			testResult.ExpectedOutput = testcase.ExpectedOutput
			testResult.Output = judgeSubmissionResponse.Stdout
		} else {
			testResult.Message = judgeSubmissionResponse.Stderr
			if testcase.ViewOnFailure {
				testResult.Input = testcase.Input
				testResult.ExpectedOutput = testcase.ExpectedOutput
				testResult.Output = judgeSubmissionResponse.Stdout
			}
		}
		testResults = append(testResults, *testResult)
	}
	// save result to firestore
	_, err = l.db.Collection("submissions").Doc(submissionId).Set(context.Background(), map[string]interface{}{
		"score":         actualScore,
		"total_score":   totalScore,
		"total_time":    totalTime,
		"total_memory":  totalMemory,
		"testcases":     testResults,
		"evaluated":     true,
		"submission_id": submissionId,
		"user_id":       waitingSubmission.UserId,
	})
	if err != nil {
		return err
	}
	return nil
}
