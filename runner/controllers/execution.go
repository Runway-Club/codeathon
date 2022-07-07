package controllers

import (
	"github.com/labstack/echo/v4"
	"runwayclub.dev/codeathon/v2/core"
)

func NewExecutionController(endpoint string, s *core.Server) *echo.Group {
	api := s.Echo.Group(endpoint)
	api.POST("/", func(c echo.Context) error {
		return c.String(200, "Hello World")
	})

	return api
}
