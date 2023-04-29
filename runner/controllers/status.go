package controllers

import (
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/labstack/echo/v4"
	"runwayclub.dev/codeathon/v2/core"
	"runwayclub.dev/codeathon/v2/logic"
)

func NewStatusController(endpoint string, s *core.Server, m *mongo.Client) *echo.Group {
	api := s.Echo.Group(endpoint)
	handler := logic.NewStatusHandler(m)

	api.POST("/", handler.CreateStatus)
	api.PUT("/", handler.UpdateStatus)

	return api
}
