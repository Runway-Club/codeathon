package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"runwayclub.dev/codeathon/v2/models"
)

// ResponseError represent the response error struct
type ResponseError struct {
	Message string `json:"message"`
}

// StatusHandler  represent the httphandler for Status
type StatusHandler struct {
	SService models.StatusService
}

func NewStatusHandler(ep string, e *echo.Echo, ss models.StatusService) {
	handler := &StatusHandler{
		SService: ss,
	}

	api := e.Group(ep)

	api.POST("/", handler.CreateStatus)
	api.PUT("/", handler.UpdateStatus)
}

func (ph *StatusHandler) CreateStatus(c echo.Context) error {
	status := &models.Status{}

	if err := c.Bind(status); err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseError{Message: err.Error()})
	}

	if err := ph.SService.Store(c.Request().Context(), status); err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseError{Message: err.Error()})
	}

	return c.JSON(http.StatusOK, ResponseError{Message: "Status created"})

}

func (ph *StatusHandler) UpdateStatus(c echo.Context) error {
	status := &models.Status{}

	if err := c.Bind(status); err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseError{Message: err.Error()})
	}

	if err := ph.SService.Update(c.Request().Context(), status); err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseError{Message: err.Error()})
	}

	return c.JSON(http.StatusOK, status)
}
