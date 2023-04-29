package models

import (
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

type Problem struct {
	ID         primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Title      string             `json:"title" bson:"title"`
	Content    string             `json:"content" bson:"content"`
	Difficulty string             `json:"difficulty" bson:"difficulty"`
	UID        string             `json:"uid" bson:"uid"`
}
