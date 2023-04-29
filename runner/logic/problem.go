package logic

import (
	"context"

	"github.com/labstack/echo/v4"
	"runwayclub.dev/codeathon/v2/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const MaxProblem = 5

type ProblemHandler struct {
	pl *ProblemLogic
}

type ProblemLogic struct {
	pdb *ProblemDatabase
}

type ProblemDatabase struct {
	m *mongo.Database
}

func NewProblemHandler(m *mongo.Client) *ProblemHandler {
	return &ProblemHandler{
		pl: &ProblemLogic{
			pdb: &ProblemDatabase{m: m.Database("codeathon")},
		},
	}
}

// db access

func (db *ProblemDatabase) aggregate(col string, pipeline interface{}) (interface{}, error) {
	cursor, err := db.m.Collection(col).Aggregate(context.Background(), pipeline)

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

func (db *ProblemDatabase) findOne(col string, filter bson.D) (interface{}, error) {
	var result map[string]interface{}
	err := db.m.Collection(col).FindOne(context.Background(), filter).Decode(&result)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (db *ProblemDatabase) insertOne(col string, doc interface{}) (primitive.ObjectID, error) {
	result, err := db.m.Collection(col).InsertOne(context.Background(), doc)

	if err != nil {
		return primitive.NilObjectID, err
	}

	return result.InsertedID.(primitive.ObjectID), nil
}

func (db *ProblemDatabase) updateOne(col string, filter interface{}, update interface{}) (*mongo.UpdateResult, error) {
	result, err := db.m.Collection(col).UpdateOne(context.Background(), filter, update)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (db *ProblemDatabase) delete(col string, filter interface{}) (*mongo.DeleteResult, error) {
	result, err := db.m.Collection(col).DeleteMany(context.Background(), filter)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (db *ProblemDatabase) deleteOne(col string, filter interface{}) (*mongo.DeleteResult, error) {
	result, err := db.m.Collection(col).DeleteOne(context.Background(), filter)

	if err != nil {
		return nil, err
	}

	return result, nil
}

// process
const MaxProblemPerUser = 20

func (l *ProblemLogic) getAllProblemWithPaginate(page int64, limit int64) (interface{}, error) {
	pipeline := []bson.M{
		{
			"$lookup": bson.M{ // join testcase
				"from":         "testcase",
				"localField":   "_id",
				"foreignField": "problem_id",
				"as":           "testcase",
			},
		},
		{
			"$project": bson.M{
				"testcase.problem_id": 0, // remove problem_id from testcase
			},
		},
		{
			"$skip": (page - 1) * limit,
		},
		{
			"$limit": limit,
		},
	}

	result, err := l.pdb.aggregate("problem", pipeline)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (l *ProblemLogic) getAllProblemWithStatus(page int64, limit int64) (interface{}, error) {
	pipeline := []bson.M{
		{
			"$lookup": bson.M{ // join status
				"from":         "status",
				"localField":   "_id",
				"foreignField": "problem_id",
				"as":           "status",
			},
		},
		{
			"$addFields": bson.M{
				"status": bson.M{
					"$arrayElemAt": bson.A{"$status.status", 0},
				},
			},
		},
		{
			"$lookup": bson.M{ // join testcase
				"from":         "testcase",
				"localField":   "_id",
				"foreignField": "problem_id",
				"as":           "testcase",
			},
		},
		{
			"$project": bson.M{
				"testcase.problem_id": 0, // remove problem_id from testcase
			},
		},
		{
			"$skip": (page - 1) * limit,
		},
		{
			"$limit": limit,
		},
	}

	result, err := l.pdb.aggregate("problem", pipeline)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (l *ProblemLogic) getProblem(id string) (interface{}, error) {
	filter := bson.D{{Key: "_id", Value: id}}

	result, err := l.pdb.findOne("problem", filter)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (l *ProblemLogic) createProblem(p *models.Problem, tc *[]models.TestCase) (interface{}, error) {
	id, err := l.pdb.insertOne("problem", p)

	if err != nil {
		return nil, err
	}

	for _, t := range *tc {
		t.ProblemID = id

		_, err := l.pdb.insertOne("testcase", t)

		if err != nil {
			return nil, err
		}
	}

	result := &struct {
		Message string `json:"message"`
		ID      string `json:"id"`
	}{
		Message: "successfully created problem ",
		ID:      id.Hex(),
	}

	return result, nil
}

func (l *ProblemLogic) updateProblem(p *models.Problem, tc *[]models.TestCase) (interface{}, error) {
	filter := bson.D{{Key: "_id", Value: p.ID}}

	update := bson.D{
		{Key: "$set", Value: bson.D{
			{Key: "title", Value: p.Title},
			{Key: "content", Value: p.Content},
			{Key: "difficulty", Value: p.Difficulty},
		}},
	}

	_, err := l.pdb.updateOne("problem", filter, update)

	if err != nil {
		return nil, err
	}

	if tc != nil {
		for _, t := range *tc {
			filter := bson.D{{Key: "_id", Value: t.ID}}

			update := bson.D{
				{Key: "$set", Value: bson.D{
					{Key: "input", Value: t.Input},
					{Key: "expected_out", Value: t.ExpectedOutput},
					{Key: "memory_limit", Value: t.MemoryLimit},
					{Key: "time_limit", Value: t.TimeLimit},
					{Key: "score", Value: t.Score},
					{Key: "allow_view_on_faied", Value: t.ViewOnFailure},
					{Key: "problem_id", Value: p.ID},
				}},
			}

			_, err := l.pdb.updateOne("testcase", filter, update)

			if err != nil {
				return nil, err
			}
		}
	}

	result := &struct {
		Message string `json:"message"`
		ID      string `json:"id"`
	}{
		Message: "successfully updated problem ",
		ID:      p.ID.Hex(),
	}

	return result, nil
}

func (l *ProblemLogic) deleteProblem(pid string) (interface{}, error) {
	id, err := primitive.ObjectIDFromHex(pid)

	if err != nil {
		return nil, err
	}

	filter := bson.D{{Key: "_id", Value: id}}

	_, err = l.pdb.deleteOne("problem", filter)

	if err != nil {
		return nil, err
	}

	filter = bson.D{{Key: "problem_id", Value: id}}

	_, err = l.pdb.delete("testcase", filter)

	if err != nil {
		return nil, err
	}

	result := &struct {
		Message string `json:"message"`
		ID      string `json:"id"`
	}{
		Message: "successfully deleted problem",
		ID:      pid,
	}

	return result, nil
}

// high level
func (handler *ProblemHandler) GetAllProblem(c echo.Context) error {
	body := &struct {
		Page  int64  `json:"page"`
		Limit int64  `json:"limit"`
		UID   string `json:"uid"`
	}{}

	if err := c.Bind(body); err != nil {
		return echo.NewHTTPError(400, err.Error())
	}

	page := body.Page
	limit := body.Limit
	uid := body.UID

	var result interface{}
	var err error

	if page == 0 {
		page = 1
	}

	if limit == 0 {
		limit = MaxProblemPerUser
	}

	if uid == "" {
		result, err = handler.pl.getAllProblemWithPaginate(page, limit)
	} else {
		result, err = handler.pl.getAllProblemWithStatus(page, limit)
	}

	if err != nil {
		return echo.NewHTTPError(500, err.Error())
	}

	return c.JSON(200, result)
}

func (handler *ProblemHandler) GetProblem(c echo.Context) error {
	id := c.Param("id")

	result, err := handler.pl.getProblem(id)

	if err != nil {
		return err
	}

	return c.JSON(200, result)
}

func (handler *ProblemHandler) CreateProblem(c echo.Context) error {
	body := &struct {
		models.Problem
		TestCase *[]models.TestCase `json:"testcase"`
	}{}

	if err := c.Bind(body); err != nil {
		return echo.NewHTTPError(400, err.Error())
	}

	problem := body.Problem
	testCase := body.TestCase

	result, err := handler.pl.createProblem(&problem, testCase)

	if err != nil {
		return echo.NewHTTPError(500, err.Error())
	}

	return c.JSON(200, result)
}

func (handler *ProblemHandler) UpdateProblem(c echo.Context) error {
	body := &struct {
		models.Problem
		TestCase *[]models.TestCase `json:"testcase"`
	}{}

	if err := c.Bind(body); err != nil {
		return echo.NewHTTPError(400, err.Error())
	}

	problem := body.Problem
	testCase := body.TestCase

	result, err := handler.pl.updateProblem(&problem, testCase)

	if err != nil {
		return echo.NewHTTPError(500, err.Error())
	}

	return c.JSON(200, result)
}

func (handler *ProblemHandler) DeleteProblem(c echo.Context) error {
	id := c.Param("id")

	result, err := handler.pl.deleteProblem(id)

	if err != nil {
		return echo.NewHTTPError(500, err.Error())
	}

	return c.JSON(200, result)
}
