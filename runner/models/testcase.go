package models

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TestCase struct {
	ID             primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Input          string             `json:"input" bson:"input"`
	ExpectedOutput string             `json:"expected_output" bson:"expected_output"`
	TimeLimit      int32              `json:"time_limit" bson:"time_limit"`
	MemoryLimit    int32              `json:"memory_limit" bson:"memory_limit"`
	Score          int32              `json:"score" bson:"score"`
	ViewOnFailure  bool               `json:"allow_view_on_failed" bson:"allow_view_on_failed"`
	ProblemID      primitive.ObjectID `json:"problem_id,omitempty" bson:"problem_id,omitempty"`
}

type TestCaseService interface {
	Fetch(ctx context.Context, uid string) ([]TestCase, error)
	GetByID(ctx context.Context, id string) (TestCase, error)
	Store(ctx context.Context, tc *TestCase) error
	StoreResult(ctx context.Context, tc *TestcaseResult) error
	Update(ctx context.Context, tc *TestCase) error
}

type TestCaseRepository interface {
	Find(ctx context.Context, collection string, filter bson.D) ([]TestCase, error)
	FindOne(ctx context.Context, collection string, filter bson.D) (TestCase, error)
	InsertOne(ctx context.Context, collection string, document *TestCase) (primitive.ObjectID, error)
	InsertOneResult(ctx context.Context, collection string, document *TestcaseResult) (primitive.ObjectID, error)
	UpdateOne(ctx context.Context, collection string, filter primitive.D, update primitive.D) error
}
