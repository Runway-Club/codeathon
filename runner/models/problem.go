package models

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Problem is representing the Problem data struct
type Problem struct {
	ID         primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Title      string             `json:"title" bson:"title"`
	Content    string             `json:"content" bson:"content"`
	Difficulty string             `json:"difficulty" bson:"difficulty"`
	UID        string             `json:"uid" bson:"uid"`
}

type ProblemStatus struct {
	ID         primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Title      string             `json:"title" bson:"title"`
	Content    string             `json:"content" bson:"content"`
	Difficulty string             `json:"difficulty" bson:"difficulty"`
	UID        string             `json:"uid" bson:"uid"`
	Status     string             `json:"status" bson:"status"`
}

// ProblemService represent the problem's services
type ProblemService interface {
	Fetch(c context.Context, args map[string]interface{}) ([]ProblemStatus, error)
	GetByID(c context.Context, id string) (ProblemStatus, error)
	Store(c context.Context, problem *Problem) error
	Update(c context.Context, problem *Problem) error
	Delete(c context.Context, id string) error
}

// ProblemRepository represent the probleme's repository contract
type ProblemRepository interface {
	Aggregate(c context.Context, collection string, pipeline []primitive.M) ([]ProblemStatus, error)
	FindOne(c context.Context, collection string, filter primitive.D) (ProblemStatus, error)
	Find(c context.Context, collection string, filter primitive.D, option *options.FindOptions) ([]ProblemStatus, error)
	InsertOne(c context.Context, collection string, document *Problem) (primitive.ObjectID, error)
	UpdateOne(c context.Context, collection string, filter primitive.D, update primitive.D) error
	DeleteOne(c context.Context, collection string, filter primitive.D) error
}
