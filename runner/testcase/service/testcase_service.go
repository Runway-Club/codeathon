package service

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"runwayclub.dev/codeathon/v2/models"
)

type testCaseService struct {
	testCaseRepo models.TestCaseRepository
}

func NewTestCaseService(tcr models.TestCaseRepository) models.TestCaseService {
	return &testCaseService{
		testCaseRepo: tcr,
	}
}

func (tcs *testCaseService) Fetch(c context.Context, pid string) ([]models.TestCase, error) {
	_pid, err := primitive.ObjectIDFromHex(pid)

	if err != nil {
		return nil, err
	}

	filter := bson.D{{Key: "problem_id", Value: _pid}}

	return tcs.testCaseRepo.Find(c, "testcase", filter)
}

func (tcs *testCaseService) FetchSample(c context.Context, pid string) ([]models.TestCase, error) {
	_pid, err := primitive.ObjectIDFromHex(pid)

	if err != nil {
		return nil, err
	}

	filter := bson.D{
		{Key: "problem_id", Value: _pid},
		{Key: "is_sample", Value: true},
	}

	return tcs.testCaseRepo.Find(c, "testcase", filter)
}

func (tcs *testCaseService) GetByID(c context.Context, id string) (models.TestCase, error) {
	_id, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return models.TestCase{}, err
	}

	filter := bson.D{{Key: "_id", Value: _id}}

	return tcs.testCaseRepo.FindOne(c, "testcase", filter)
}

func (tcs *testCaseService) Store(c context.Context, testCase *models.TestCase) error {
	_, err := tcs.testCaseRepo.InsertOne(c, "testcase", testCase)

	if err != nil {
		return err
	}

	return nil
}

func (tcs *testCaseService) StoreResult(c context.Context, tcr *models.TestcaseResult) error {
	_, err := tcs.testCaseRepo.InsertOneResult(c, "testcase_results", tcr)

	if err != nil {
		return err
	}

	return nil
}

func (tcs *testCaseService) Update(c context.Context, testCase *models.TestCase) error {
	filter := bson.D{{Key: "_id", Value: testCase.ID}}

	update := bson.D{
		{Key: "$set", Value: bson.D{
			{Key: "inpur", Value: testCase.Input},
			{Key: "expected_output", Value: testCase.ExpectedOutput},
			{Key: "time_limit", Value: testCase.TimeLimit},
			{Key: "memory_limit", Value: testCase.MemoryLimit},
			{Key: "score", Value: testCase.Score},
			{Key: "problem_id", Value: testCase.ProblemID},
		}},
	}

	return tcs.testCaseRepo.UpdateOne(c, "testcase", filter, update)
}
