package controllers

import (
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/labstack/echo/v4"
	"runwayclub.dev/codeathon/v2/core"
	"runwayclub.dev/codeathon/v2/logic"
)

func NewSubmisstionController(endpoint string, s *core.Server, m *mongo.Client) *echo.Group {
	api := s.Echo.Group(endpoint)
	handler := logic.NewSubmissionHandler(s, m)

	api.GET("/", handler.GetSubmissionByUID)
	api.GET("/:id", handler.GetSubmissionByID)
	api.POST("/", handler.CreateSubmission)

	return api
}
