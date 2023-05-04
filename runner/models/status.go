package models

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Status struct {
	ID     primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Status string             `json:"status" bson:"status"`
	PID    primitive.ObjectID `json:"problem_id" bson:"problem_id"`
	UID    string             `json:"uid" bson:"uid"`
}

type StatusService interface {
	Store(c context.Context, status *Status) error
	Update(c context.Context, status *Status) error
}

type StatusRepository interface {
	InsertOne(c context.Context, collection string, status *Status) (primitive.ObjectID, error)
	UpdateOne(c context.Context, collection string, filter primitive.D, update primitive.D) error
}
