package mongo

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"runwayclub.dev/codeathon/v2/models"
)

type mongoProblemRepository struct {
	db *mongo.Database
}

func NewMongoProblemRepository(conn *mongo.Database) models.ProblemRepository {
	return &mongoProblemRepository{
		db: conn,
	}
}

func (m *mongoProblemRepository) Aggregate(c context.Context, collection string, pipeline []primitive.M) ([]models.ProblemStatus, error) {
	cursor, err := m.db.Collection(collection).Aggregate(c, pipeline)

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.Background())

	var results []models.ProblemStatus

	if err = cursor.All(context.Background(), &results); err != nil {
		println(err.Error())
		return nil, err
	}

	return results, nil
}

func (m *mongoProblemRepository) FindOne(c context.Context, collection string, filter primitive.D) (models.ProblemStatus, error) {
	var result models.ProblemStatus

	err := m.db.Collection(collection).FindOne(context.Background(), filter).Decode(&result)

	if err != nil {
		return models.ProblemStatus{}, err
	}

	return result, nil
}

func (m *mongoProblemRepository) Find(c context.Context, collection string, filter primitive.D, option *options.FindOptions) ([]models.ProblemStatus, error) {
	cursor, err := m.db.Collection(collection).Find(context.Background(), filter, option)

	if err != nil {
		return nil, err
	}

	var results []models.ProblemStatus

	if err = cursor.All(context.Background(), &results); err != nil {
		println(err.Error())
		return nil, err
	}

	return results, nil
}

func (m *mongoProblemRepository) InsertOne(c context.Context, collection string, document *models.Problem) (primitive.ObjectID, error) {
	res, err := m.db.Collection(collection).InsertOne(context.Background(), document)

	if err != nil {
		return primitive.NilObjectID, err
	}

	return res.InsertedID.(primitive.ObjectID), nil
}

func (m *mongoProblemRepository) UpdateOne(c context.Context, collection string, filter primitive.D, update primitive.D) error {
	_, err := m.db.Collection(collection).UpdateOne(context.Background(), filter, update)

	if err != nil {
		return err
	}

	return nil
}

func (m *mongoProblemRepository) DeleteOne(c context.Context, collection string, filter primitive.D) error {
	_, err := m.db.Collection(collection).DeleteOne(context.Background(), filter)

	if err != nil {
		return err
	}

	return nil
}
