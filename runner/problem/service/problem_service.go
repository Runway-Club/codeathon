package service

import (
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"runwayclub.dev/codeathon/v2/models"
)

type problemService struct {
	problemRepo models.ProblemRepository
}

func NewProblemService(pr models.ProblemRepository) models.ProblemService {
	return &problemService{
		problemRepo: pr,
	}
}

func (ps *problemService) getPipelineUID(uid string) []bson.M {
	pipeline := []bson.M{}

	pipeline = append(pipeline, bson.M{
		"$lookup": bson.M{
			"from":         "status",
			"localField":   "_id",
			"foreignField": "problem_id",
			"as":           "statuses",
		},
	})

	pipeline = append(pipeline, bson.M{
		"$addFields": bson.M{
			"fstatus": bson.M{
				"$filter": bson.M{
					"input": "$statuses",
					"as":    "status",
					"cond": bson.M{
						"$eq": bson.A{"$$status.uid", uid},
					},
				},
			},
		},
	})

	pipeline = append(pipeline, bson.M{
		"$addFields": bson.M{
			"status": bson.M{
				"$arrayElemAt": bson.A{"$fstatus.status", 0},
			},
		},
	})

	pipeline = append(pipeline, bson.M{
		"$project": bson.M{
			"fstatus":  0,
			"statuses": 0,
		},
	})

	return pipeline
}

func (ps *problemService) getPipelineOwner(uid string) []bson.M {
	pipeline := []bson.M{}

	pipeline = append(pipeline, bson.M{
		"$match": bson.M{
			"uid": uid,
		},
	})

	return pipeline
}

func (ps *problemService) Fetch(c context.Context, args map[string]interface{}) ([]models.ProblemStatus, error) {
	page := args["page"].(int64)
	limit := args["limit"].(int64)

	uid := args["uid"].(string)
	owner := args["owner"].(string)

	if uid != "" && owner != "" {
		return nil, errors.New("uid and owner cannot be used together")
	}

	pipeline := []bson.M{}

	if uid != "" {
		pipeline = append(pipeline, ps.getPipelineUID(uid)...)
	} else if owner != "" {
		pipeline = append(pipeline, ps.getPipelineOwner(owner)...)
	}

	if page > 0 {
		pipeline = append(pipeline, bson.M{
			"$skip": (page - 1) * limit,
		})
	}

	if limit > 0 {
		pipeline = append(pipeline, bson.M{
			"$limit": limit,
		})
	}

	res, err := ps.problemRepo.Aggregate(c, "problem", pipeline)

	if err != nil {
		return nil, err
	}

	if res == nil {
		return nil, errors.New("no problem found")
	}

	return res, nil
}

func (ps *problemService) GetByID(c context.Context, id string) (models.ProblemStatus, error) {
	_id, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return models.ProblemStatus{}, err
	}

	filter := bson.D{{Key: "_id", Value: _id}}

	return ps.problemRepo.FindOne(c, "problem", filter)
}

func (ps *problemService) Store(c context.Context, problem *models.Problem) error {
	_, err := ps.problemRepo.InsertOne(c, "problem", problem)

	if err != nil {
		return err
	}

	return nil
}

func (ps *problemService) Update(c context.Context, problem *models.Problem) error {
	filter := bson.D{{Key: "_id", Value: problem.ID}}

	update := bson.D{
		{Key: "$set", Value: bson.D{
			{Key: "title", Value: problem.Title},
			{Key: "content", Value: problem.Content},
			{Key: "difficulty", Value: problem.Difficulty},
		}},
	}

	return ps.problemRepo.UpdateOne(c, "problem", filter, update)
}

func (ps *problemService) Delete(c context.Context, id string) error {
	_id, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return err
	}

	filter := bson.D{{Key: "_id", Value: _id}}

	return ps.problemRepo.DeleteOne(c, "problem", filter)
}
