package service

import (
	"context"
	"errors"
	"time"

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

	//add status field if status is found else add status field with value "todo"
	pipeline = append(pipeline, bson.M{
		"$addFields": bson.M{
			"status": bson.M{
				"$cond": bson.M{
					"if": bson.M{
						"$eq": bson.A{"$fstatus", bson.A{}},
					},
					"then": "todo",
					"else": bson.M{
						"$arrayElemAt": bson.A{"$fstatus.status", 0},
					},
				},
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

func (ps *problemService) getPipelineDifficultySort(order string) []bson.M {
	pipeline := []bson.M{}

	tempOrder := 1

	if order == "desc" {
		tempOrder = -1
	}

	pipeline = append(pipeline, bson.M{
		"$addFields": bson.M{
			"difficulty_order": bson.M{
				"$switch": bson.M{
					"branches": []bson.M{
						{
							"case": bson.M{
								"$eq": bson.A{"$difficulty", "easy"},
							},
							"then": 1,
						},
						{
							"case": bson.M{
								"$eq": bson.A{"$difficulty", "medium"},
							},
							"then": 2,
						},
						{
							"case": bson.M{
								"$eq": bson.A{"$difficulty", "hard"},
							},
							"then": 3,
						},
					},
					"default": 0,
				},
			},
		},
	})

	pipeline = append(pipeline, bson.M{
		"$sort": bson.M{
			"difficulty_order": tempOrder,
		},
	})

	pipeline = append(pipeline, bson.M{
		"$unset": "difficulty_order",
	})

	return pipeline
}

func (ps *problemService) addSort(field string, order string) []bson.M {
	pipeline := []bson.M{}

	if order == "asc" {
		pipeline = append(pipeline, bson.M{
			"$sort": bson.M{
				field: 1,
			},
		})
	} else if order == "desc" {
		pipeline = append(pipeline, bson.M{
			"$sort": bson.M{
				field: -1,
			},
		})
	}

	return pipeline
}

func (ps *problemService) Fetch(c context.Context, args map[string]interface{}) ([]models.ProblemStatus, error) {
	page := args["page"].(int64)
	limit := args["limit"].(int64)

	status := args["status"].(string)
	difficulty := args["difficulty"].(string)

	sort := args["sort"].(string)
	order := args["order"].(string)

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

	if status != "" {
		pipeline = append(pipeline, bson.M{
			"$match": bson.M{
				"status": status,
			},
		})
	}

	if difficulty != "" {
		pipeline = append(pipeline, bson.M{
			"$match": bson.M{
				"difficulty": difficulty,
			},
		})
	}

	if sort == "difficulty" {
		pipeline = append(pipeline, ps.getPipelineDifficultySort(order)...)
	} else if sort != "" {
		pipeline = append(pipeline, ps.addSort(sort, order)...)
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
	problem.CreateAt = time.Now().UnixMilli()

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

func (ps *problemService) Count(c context.Context, args map[string]interface{}) (int64, error) {
	owner := args["owner"].(string)

	filter := bson.D{}

	if owner != "" {
		filter = bson.D{{Key: "uid", Value: owner}}
	}

	return ps.problemRepo.CountDocuments(c, "problem", filter)
}
