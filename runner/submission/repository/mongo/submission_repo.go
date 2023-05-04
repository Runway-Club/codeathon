package mongo

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"runwayclub.dev/codeathon/v2/models"
)

type mongoSubmissionRepository struct {
	db *mongo.Database
}

func NewMongoSubmissionRepository(conn *mongo.Database) models.SubmissionRepository {
	return &mongoSubmissionRepository{
		db: conn,
	}
}

func (m *mongoSubmissionRepository) Fetch(c context.Context, collection string, filter primitive.D, option *options.FindOptions) ([]models.SubmissionResult, error) {
	cursor, err := m.db.Collection(collection).Find(context.TODO(), filter, option)

	if err != nil {
		return nil, err
	}

	var submissions []models.SubmissionResult

	if err = cursor.All(context.Background(), &submissions); err != nil {
		return nil, err
	}

	return submissions, nil
}

func (m *mongoSubmissionRepository) GetByID(c context.Context, collection string, filter primitive.D) (models.SubmissionResult, error) {
	var submission models.SubmissionResult

	err := m.db.Collection(collection).FindOne(context.Background(), filter).Decode(&submission)

	if err != nil {
		return models.SubmissionResult{}, err
	}

	return submission, nil
}

func (m *mongoSubmissionRepository) InsertOne(c context.Context, collection string, document *models.Submission) (primitive.ObjectID, error) {
	result, err := m.db.Collection(collection).InsertOne(context.Background(), document)

	if err != nil {
		return primitive.NilObjectID, err
	}

	return result.InsertedID.(primitive.ObjectID), nil
}

func (m *mongoSubmissionRepository) UpdateOne(c context.Context, collection string, filter primitive.D, update primitive.D) error {
	_, err := m.db.Collection(collection).UpdateOne(context.Background(), filter, update)

	if err != nil {
		println(err.Error())
		return err
	}

	return nil
}
