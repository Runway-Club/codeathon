package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Status struct {
	ID     primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Status string             `json:"status" bson:"status"`
	PID    primitive.ObjectID `json:"problem_id" bson:"problem_id"`
	UID    string             `json:"uid" bson:"uid"`
}
