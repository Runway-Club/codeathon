package models

import "context"

type ElasticProblemRepository interface {
	Search(c context.Context, index string, fields []string, text string) ([]string, error)
	InsertOne(c context.Context, index string, id string, doc interface{}) error
	UpdateOne(c context.Context, index string, id string, doc interface{}) error
	DeleteOne(c context.Context, index string, id string) error
}
