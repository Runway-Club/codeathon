package logic

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"runwayclub.dev/codeathon/v2/core"
	"runwayclub.dev/codeathon/v2/models"
)

type SubmissionHandler struct {
	sl *SubmissionLogic
}

type SubmissionLogic struct {
	sdb    *SubmissionDatabase
	config *core.Config
}

type SubmissionDatabase struct {
	m *mongo.Database
}

const MaxInt64 = int64(^uint64(0) >> 1)

func NewSubmissionHandler(s *core.Server, m *mongo.Client) *SubmissionHandler {
	return &SubmissionHandler{
		sl: &SubmissionLogic{
			sdb: &SubmissionDatabase{
				m: m.Database("codeathon"),
			},
			config: s.Config,
		},
	}
}

// judge0 api
func (l *SubmissionLogic) requestToken(s *models.Submission, tc *models.TestCase) (*string, error) {
	req, err := json.Marshal(&models.JudgeSubmissionRequest{
		SourceCode:   s.Code,
		LanguageId:   s.LanguageID,
		Stdin:        tc.Input,
		CpuTimeLimit: tc.TimeLimit,
		MemoryLimit:  tc.MemoryLimit,
	})

	if err != nil {
		return nil, err
	}

	res, err := http.Post(l.config.Judge0+"/submissions/", "application/json", bytes.NewBuffer(req))

	if err != nil {
		return nil, err
	}

	if res.StatusCode != http.StatusCreated {
		// print body
		body, err := ioutil.ReadAll(res.Body)
		if err != nil {
			return nil, err
		}

		return nil, errors.New("judge0 api error " + string(body))
	}

	defer res.Body.Close()

	judgeSubmissionResponse := &struct {
		Token string `json:"token"`
	}{}

	if err := json.NewDecoder(res.Body).Decode(judgeSubmissionResponse); err != nil {
		return nil, err
	}

	return &judgeSubmissionResponse.Token, nil
}

func (l *SubmissionLogic) RequestEvaluate(s *models.Submission) error {
	tokens := make([]string, 0)

	filter := bson.D{{Key: "problem_id", Value: s.ProblemID}}
	options := map[string]interface{}{"limit": MaxInt64, "skip": 0}

	tcs, err := l.sdb.find("testcase", filter, options)
	testcase := make([]models.TestCase, 0)

	for _, tc := range tcs.([]map[string]interface{}) {
		testcase = append(testcase, models.TestCase{
			Input:          tc["input"].(string),
			ExpectedOutput: tc["expected_output"].(string),
			TimeLimit:      tc["time_limit"].(int32),
			MemoryLimit:    tc["memory_limit"].(int32),
		})
	}

	if err != nil {
		return err
	}

	for _, tc := range testcase {
		token, err := l.requestToken(s, &tc)

		if err != nil {
			return err
		}

		tokens = append(tokens, *token)
	}

	go l.Evaluate(s, testcase, tokens)

	return nil
}

func getTestcaseResult(judgeResponse *models.JudgeSubmissionResponse, testcase models.TestCase) (*models.TestcaseResult, error) {
	tcr := &models.TestcaseResult{}

	time, _ := strconv.ParseFloat(judgeResponse.Time, 64)
	memory := judgeResponse.Memory

	output := &struct {
		Expected string
		Stdout   string
		Stderr   string
		Message  string
	}{
		Expected: strings.TrimSpace(testcase.ExpectedOutput),
		Stdout:   strings.TrimSpace(judgeResponse.Stdout),
		Stderr:   strings.TrimSpace(judgeResponse.Stderr),
		Message:  strings.TrimSpace(judgeResponse.Message),
	}

	if output.Stderr == "" {
		tcr.Output = output.Stdout
	}

	tcr.Stderr = output.Stderr

	if output.Expected == output.Stdout {
		tcr.Message = "PASS"
	} else {
		if memory >= testcase.MemoryLimit {
			tcr.Message = "Memory Limit Exceeded"
		} else if output.Message != "" {
			tcr.Message = output.Message
		} else {
			tcr.Message = "FAIL"
		}

		if testcase.ViewOnFailure {
			tcr.Input = testcase.Input
			tcr.ExpectedOutput = testcase.ExpectedOutput
		}
	}

	tcr.Time = time
	tcr.Memory = memory

	return tcr, nil
}

func (l *SubmissionLogic) Evaluate(s *models.Submission, tc []models.TestCase, tokens []string) error {

	actualScore := int32(0)

	totalScore := int32(0)
	totalTime := float64(0)
	totalMemory := int32(0)

	for key, token := range tokens {
		totalScore += tc[key].Score
		statusID := 1

		judgeSubmissionResponse := &models.JudgeSubmissionResponse{}

		for statusID == 1 || statusID == 2 {
			time.Sleep(time.Millisecond * 1000)
			res, err := http.Get(l.config.Judge0 + "/submissions/" + token)

			if res.StatusCode != http.StatusOK {
				body, err := ioutil.ReadAll(res.Body)
				if err != nil {
					return err
				}
				return errors.New("Error: " + string(body))
			}

			if err != nil {
				return err
			}

			defer res.Body.Close()

			resData, _ := ioutil.ReadAll(res.Body)

			if err := json.Unmarshal(resData, judgeSubmissionResponse); err != nil {
				println(err.Error())
				return err
			}

			statusID = judgeSubmissionResponse.Status.ID
		}

		testcaseResult := &models.TestcaseResult{}
		var err error

		testcaseResult, err = getTestcaseResult(judgeSubmissionResponse, tc[key])

		if err != nil {
			return err
		}

		if testcaseResult.Message == "PASS" {
			actualScore += tc[key].Score
		}

		totalTime += testcaseResult.Time
		totalMemory += testcaseResult.Memory

		testcaseResult.SID = s.ID

		l.sdb.insertOne("testcase_results", testcaseResult)
	}

	filter := bson.D{{Key: "_id", Value: s.ID}}

	update := bson.D{
		{Key: "$set", Value: bson.D{
			{Key: "score", Value: actualScore},
			{Key: "evaluated", Value: true},
			{Key: "time", Value: totalTime},
			{Key: "memory", Value: totalMemory},
			{Key: "total_score", Value: totalScore},
		}},
	}

	l.sdb.updateOne("submissions", filter, update)

	return nil
}

// access database
func (db *SubmissionDatabase) find(col string, filter bson.D, option map[string]interface{}) (interface{}, error) {

	limit, ok := option["limit"].(int64)

	if !ok {
		limit = 5
	}

	skip, ok := option["skip"].(int64)

	if !ok {
		skip = 0
	}

	opts := options.Find().SetLimit(limit).SetSkip(skip)
	cursor, err := db.m.Collection(col).Find(context.TODO(), filter, opts)

	if err != nil {
		return nil, err
	}

	var results []map[string]interface{}

	if err = cursor.All(context.Background(), &results); err != nil {
		println(err.Error())
		return nil, err
	}

	return results, nil
}

func (db *SubmissionDatabase) findOne(col string, filter interface{}) (interface{}, error) {
	var result map[string]interface{}
	err := db.m.Collection(col).FindOne(context.Background(), filter).Decode(&result)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (db *SubmissionDatabase) insertOne(col string, doc interface{}) (interface{}, error) {
	result, err := db.m.Collection(col).InsertOne(context.Background(), doc)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (db *SubmissionDatabase) updateOne(col string, filter interface{}, update interface{}) (interface{}, error) {
	result, err := db.m.Collection(col).UpdateOne(context.Background(), filter, update)

	if err != nil {
		println(err.Error())
		return nil, err
	}

	return result, nil
}

// medium level
func (l *SubmissionLogic) getSubmissionByUID(uid string) (interface{}, error) {
	filter := bson.D{{Key: "uid", Value: uid}}

	option := map[string]interface{}{
		"limit": int64(5),
		"skip":  int64(0),
	}

	result, err := l.sdb.find("submissions", filter, option)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (l *SubmissionLogic) getSubmissionByUIDWithLimit(uid string, limit int64) (interface{}, error) {
	filter := bson.D{{Key: "uid", Value: uid}}

	option := map[string]interface{}{
		"limit": limit,
		"skip":  int64(0),
	}

	result, err := l.sdb.find("submissions", filter, option)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (l *SubmissionLogic) getSubmissionByID(id string) (interface{}, error) {
	_id, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return nil, err
	}

	filter := bson.D{{Key: "_id", Value: _id}}

	result, err := l.sdb.findOne("submissions", filter)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (l *SubmissionLogic) createSubmission(s *models.Submission) (interface{}, error) {
	s.CreateAt = time.Now().UnixMilli()

	result, err := l.sdb.insertOne("submissions", s)

	if err != nil {
		return nil, err
	}

	s.ID = result.(*mongo.InsertOneResult).InsertedID.(primitive.ObjectID)

	go l.RequestEvaluate(s)

	return result, nil
}

// high level
func (handler *SubmissionHandler) GetSubmissionByUID(c echo.Context) error {
	body := &struct {
		UID   string `json:"uid"`
		Limit int64  `json:"limit"`
	}{}

	if err := c.Bind(body); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if body.UID == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "uid must not be empty")
	}

	var result interface{}
	var err error

	if body.Limit == 0 {
		result, err = handler.sl.getSubmissionByUID(body.UID)
	} else {
		result, err = handler.sl.getSubmissionByUIDWithLimit(body.UID, body.Limit)
	}

	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, result)
}

func (handler *SubmissionHandler) GetSubmissionByID(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "id is not exist")
	}

	result, err := handler.sl.getSubmissionByID(id)

	if err != nil {
		echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, result)
}

func (handler *SubmissionHandler) CreateSubmission(c echo.Context) error {
	submission := &models.Submission{}

	if err := c.Bind(submission); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	result, err := handler.sl.createSubmission(submission)

	if err != nil {
		echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, result)
}
