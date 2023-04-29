package logic

import (
	"context"
	"net/http"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"

	"runwayclub.dev/codeathon/v2/models"
)

type StatusHandler struct {
	sl *StatusLogic
}

type StatusLogic struct {
	sdb *StatusDatabase
}

type StatusDatabase struct {
	m *mongo.Database
}

func NewStatusHandler(m *mongo.Client) *StatusHandler {
	return &StatusHandler{
		sl: &StatusLogic{
			sdb: &StatusDatabase{
				m: m.Database("codeathon"),
			},
		},
	}
}

// access database
func (db *StatusDatabase) insertOne(col string, doc interface{}) (interface{}, error) {
	result, err := db.m.Collection(col).InsertOne(context.Background(), doc)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (db *StatusDatabase) updateOne(col string, filter interface{}, update interface{}) (interface{}, error) {
	result, err := db.m.Collection(col).UpdateOne(context.Background(), filter, update)

	if err != nil {
		return nil, err
	}

	return result, nil
}

// medium level
func (l *StatusLogic) createStatus(s *models.Status) (interface{}, error) {
	result, err := l.sdb.insertOne("status", s)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (l *StatusLogic) updateStatus(s *models.Status) (interface{}, error) {
	filter := bson.D{{Key: "_id", Value: s.ID}}

	update := bson.D{
		{Key: "$set", Value: bson.D{
			{Key: "status", Value: s.Status},
			{Key: "pid", Value: s.PID},
			{Key: "uid", Value: s.UID},
		}},
	}

	result, err := l.sdb.updateOne("status", filter, update)

	if err != nil {
		return nil, err
	}

	return result, nil
}

// high level
func (handler *StatusHandler) CreateStatus(c echo.Context) error {
	s := &models.Status{}

	if err := c.Bind(s); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if _, err := handler.sl.createStatus(s); err != nil {
		return err
	}

	return c.JSON(200, s)
}

func (handler *StatusHandler) UpdateStatus(c echo.Context) error {
	s := &models.Status{}

	if err := c.Bind(s); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if _, err := handler.sl.updateStatus(s); err != nil {
		return err
	}

	return c.JSON(200, s)
}
