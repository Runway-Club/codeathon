package mongo

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"runwayclub.dev/codeathon/v2/models"
)

type mongoStatusRepository struct {
	db *mongo.Database
}

func NewMongoStatusRepository(conn *mongo.Database) models.StatusRepository {
	return &mongoStatusRepository{
		db: conn,
	}
}

func (m *mongoStatusRepository) InsertOne(c context.Context, collection string, document *models.Status) (primitive.ObjectID, error) {
	res, err := m.db.Collection(collection).InsertOne(context.Background(), document)

	if err != nil {
		return primitive.NilObjectID, err
	}

	return res.InsertedID.(primitive.ObjectID), nil
}

func (m *mongoStatusRepository) UpdateOne(c context.Context, collection string, filter primitive.D, update primitive.D) error {
	_, err := m.db.Collection(collection).UpdateOne(context.Background(), filter, update)

	if err != nil {
		return err
	}

	return nil
}
