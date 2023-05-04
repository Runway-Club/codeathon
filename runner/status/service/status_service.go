package service

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"

	"runwayclub.dev/codeathon/v2/models"
)

type statusService struct {
	statusRepo models.StatusRepository
}

func NewStatusService(sr models.StatusRepository) models.StatusService {
	return &statusService{
		statusRepo: sr,
	}
}

func (ps *statusService) Store(c context.Context, status *models.Status) error {
	_, err := ps.statusRepo.InsertOne(c, "status", status)

	if err != nil {
		return err
	}

	return nil
}

func (ps *statusService) Update(c context.Context, status *models.Status) error {
	filter := bson.D{{Key: "_id", Value: status.ID}}

	update := bson.D{
		{Key: "$set", Value: bson.D{
			{Key: "status", Value: status.Status},
		}},
	}

	return ps.statusRepo.UpdateOne(c, "status", filter, update)
}
