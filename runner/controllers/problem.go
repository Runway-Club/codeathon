package controllers

import (
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/labstack/echo/v4"
	"runwayclub.dev/codeathon/v2/core"
	"runwayclub.dev/codeathon/v2/logic"
)

func NewProblemController(endpoint string, s *core.Server, m *mongo.Client) *echo.Group {
	api := s.Echo.Group(endpoint)
	handler := logic.NewProblemHandler(m)

	api.GET("/", handler.GetAllProblem)
	api.GET("/:id", handler.GetProblem)
	api.POST("/", handler.CreateProblem)
	api.PUT("/", handler.UpdateProblem)
	api.DELETE("/:id", handler.DeleteProblem)

	return api
}
