package mongo

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"runwayclub.dev/codeathon/v2/models"
)

type mongoTestCaseRepository struct {
	db *mongo.Database
}

func NewMongoTestCaseRepository(conn *mongo.Database) models.TestCaseRepository {
	return &mongoTestCaseRepository{
		db: conn,
	}
}

func (m *mongoTestCaseRepository) Find(c context.Context, collection string, filter bson.D) ([]models.TestCase, error) {
	cursor, err := m.db.Collection(collection).Find(context.Background(), filter)

	if err != nil {
		return nil, err
	}

	results := make([]models.TestCase, 0)

	if err = cursor.All(context.Background(), &results); err != nil {
		return nil, err
	}

	return results, nil
}

func (m *mongoTestCaseRepository) FindOne(c context.Context, collection string, filter bson.D) (models.TestCase, error) {
	var result models.TestCase

	err := m.db.Collection(collection).FindOne(context.Background(), filter).Decode(&result)

	if err != nil {
		return models.TestCase{}, err
	}

	return result, nil
}

func (m *mongoTestCaseRepository) InsertOne(c context.Context, collection string, document *models.TestCase) (primitive.ObjectID, error) {
	res, err := m.db.Collection(collection).InsertOne(context.Background(), document)

	if err != nil {
		return primitive.NilObjectID, err
	}

	return res.InsertedID.(primitive.ObjectID), nil
}

func (m *mongoTestCaseRepository) InsertOneResult(c context.Context, collection string, document *models.TestcaseResult) (primitive.ObjectID, error) {
	res, err := m.db.Collection(collection).InsertOne(context.Background(), document)

	if err != nil {
		return primitive.NilObjectID, err
	}

	return res.InsertedID.(primitive.ObjectID), nil
}

func (m *mongoTestCaseRepository) UpdateOne(c context.Context, collection string, filter primitive.D, update primitive.D) error {
	_, err := m.db.Collection(collection).UpdateOne(context.Background(), filter, update)

	if err != nil {
		return err
	}

	return nil
}
