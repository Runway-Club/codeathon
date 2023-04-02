package logic

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
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

func (l *ProblemLogic) AutoEvaluate() error {
	it := l.db.Collection("submissions").Where("evaluated", "==", false).Snapshots(context.Background())
	for {
		snap, err := it.Next()
		// DeadlineExceeded will be returned when ctx is cancelled.
		if status.Code(err) == codes.DeadlineExceeded {
			return nil
		}
		if err != nil {
			return err
		}
		docs, err := snap.Documents.GetAll()
		if err != nil {
			return err
		}
		for _, doc := range docs {
			l.Evaluate(doc.Ref.ID)
		}
	}
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

		// println(res.StatusCode)
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

		// println(judgeSubmissionResponse.Token)
		tokens = append(tokens, judgeSubmissionResponse.Token)
	}
	currentTime := time.Now().UnixMilli()
	// save tokens to firestore
	l.db.Collection("submissions").Add(context.Background(), map[string]interface{}{
		"problem_id":  submission.ProblemId,
		"user_id":     submission.UserId,
		"tokens":      tokens,
		"time":        currentTime,
		"evaluated":   false,
		"source":      submission.Source,
		"language_id": submission.LanguageId,
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

	// get problem from firestore
	problem, err := l.Get(waitingSubmission.ProblemId)
	if err != nil {
		return err
	}

	//process
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
				fmt.Printf("bdfbfef %+v", err.Error())
				return err
			}
			return errors.New("HELLO===" + string(body))
		}

		if err != nil {
			return err
		}

		defer res.Body.Close()

		// parse response to judgeSubmissionResponse
		judgeSubmissionResponse := &models.JudgeSubmissionResponse{}

		// unmarshal response to judgeSubmissionResponse
		resData, _ := ioutil.ReadAll(res.Body)

		if err := json.Unmarshal(resData, judgeSubmissionResponse); err != nil {
			fmt.Printf("bdfbfef %+v", err.Error())
			return err
		}

		parsedTime, _ := strconv.ParseFloat(judgeSubmissionResponse.Time, 64)
		expectedOutput := strings.TrimSpace(testcase.ExpectedOutput)
		actualOutput := strings.TrimSpace(judgeSubmissionResponse.Stdout)
		errOutput := strings.TrimSpace(judgeSubmissionResponse.Stderr)

		totalTime += parsedTime
		totalMemory += float64(judgeSubmissionResponse.Memory)

		if errOutput == "" {
			testResult.Output = actualOutput
		}
		testResult.Stderr = errOutput

		if expectedOutput == actualOutput {
			actualScore += testcase.Score

			testResult.Message = "PASS"
			testResult.Input = testcase.Input
			testResult.ExpectedOutput = testcase.ExpectedOutput
		} else {
			if judgeSubmissionResponse.Stderr == "" {
				testResult.Message = "FAIL"
			}

			if testcase.ViewOnFailure {
				testResult.Input = testcase.Input
				testResult.ExpectedOutput = testcase.ExpectedOutput
			}
		}
		// fmt.Println(testResult)
		testResults = append(testResults, *testResult)
	}

	// save result to firestore
	_, err = l.db.Collection("submissions").Doc(submissionId).Set(context.Background(), map[string]interface{}{
		"problem_id":    waitingSubmission.ProblemId,
		"tokens":        waitingSubmission.Tokens,
		"score":         actualScore,
		"total_score":   totalScore,
		"total_time":    totalTime,
		"total_memory":  totalMemory,
		"testcases":     testResults,
		"evaluated":     true,
		"submission_id": submissionId,
		"user_id":       waitingSubmission.UserId,
		"language_id":   waitingSubmission.LanguageId,
		"source":        waitingSubmission.Source,
		"time":          waitingSubmission.Time,
	})

	if err != nil {
		return err
	}

	return nil
}
