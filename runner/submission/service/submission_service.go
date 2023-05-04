package service

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"runwayclub.dev/codeathon/v2/models"
)

type submissionService struct {
	submissionRepo models.SubmissionRepository
}

func NewSubmissionService(sr models.SubmissionRepository) models.SubmissionService {
	return &submissionService{
		submissionRepo: sr,
	}
}

func (ss *submissionService) GetSubmissionByUID(c context.Context, uid string, pid string) ([]models.SubmissionResult, error) {
	_pid, err := primitive.ObjectIDFromHex(pid)

	if err != nil {
		return nil, err
	}

	filter := bson.D{
		{Key: "uid", Value: uid},
		{Key: "problemID", Value: _pid},
	}

	option := options.Find()

	option.SetSort(bson.D{{Key: "created_at", Value: -1}})
	option.SetLimit(5)

	result, err := ss.submissionRepo.Fetch(c, "submissions", filter, option)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (ss *submissionService) GetSubmissionByID(c context.Context, id string) (models.SubmissionResult, error) {
	_id, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return models.SubmissionResult{}, err
	}

	filter := bson.D{{Key: "_id", Value: _id}}

	result, err := ss.submissionRepo.GetByID(c, "submissions", filter)

	if err != nil {
		return models.SubmissionResult{}, err
	}

	return result, nil
}

func (ss *submissionService) CreateSubmission(c context.Context, submission *models.Submission) (primitive.ObjectID, error) {
	submission.CreateAt = time.Now().UnixMilli()
	return ss.submissionRepo.InsertOne(c, "submissions", submission)
}

func (ss *submissionService) UpdateSubmissionResult(c context.Context, submission *models.SubmissionResult) error {
	filter := bson.D{{Key: "_id", Value: submission.ID}}

	update := bson.D{
		{Key: "$set", Value: bson.D{
			{Key: "score", Value: submission.Score},
			{Key: "evaluated", Value: submission.Evaluated},
			{Key: "total_time", Value: submission.TotalTime},
			{Key: "total_memory", Value: submission.TotalMemory},
			{Key: "total_score", Value: submission.TotalScore},
		}},
	}

	return ss.submissionRepo.UpdateOne(c, "submissions", filter, update)
}
