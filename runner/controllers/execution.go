package controllers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"runwayclub.dev/codeathon/v2/core"
	"runwayclub.dev/codeathon/v2/logic"
	"runwayclub.dev/codeathon/v2/models"
)

func NewExecutionController(endpoint string, s *core.Server) *echo.Group {
	api := s.Echo.Group(endpoint)
	problemLogic := logic.NewProblemLogic(s)

	api.POST("/", func(c echo.Context) error {
		// parse body to submission
		submission := &models.Submission{}

		if err := c.Bind(submission); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		err := problemLogic.RequestEvaluate(submission)

		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		return c.NoContent(http.StatusOK)
	})

	api.GET("/:id", func(c echo.Context) error {
		id := c.Param("id")
		err := problemLogic.Evaluate(id)

		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}
		return c.NoContent(http.StatusOK)
	})

	go problemLogic.AutoEvaluate()

	return api
}
