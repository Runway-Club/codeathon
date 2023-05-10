package controller

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"runwayclub.dev/codeathon/v2/models"
)

// ResponseError represent the response error struct
type ResponseError struct {
	Message string `json:"message"`
}

// ProblemHandler  represent the httphandler for problem
type ProblemHandler struct {
	PService models.ProblemService
}

func NewProblemHandler(ep string, e *echo.Echo, ps models.ProblemService) {
	handler := &ProblemHandler{
		PService: ps,
	}

	api := e.Group(ep)

	api.GET("/", handler.GetAllProblem)
	api.GET("/count", handler.GetProblemQuantity)
	api.GET("/:id", handler.GetProblem)
	api.POST("/", handler.CreateProblem)
	api.PUT("/", handler.UpdateProblem)
	api.DELETE("/:id", handler.DeleteProblem)
}

func (ph *ProblemHandler) GetAllProblem(c echo.Context) error {
	body := &struct {
		UID   string `json:"uid"`
		Owner string `json:"owner"`
	}{}

	c.Bind(body)

	pageS := c.QueryParam("page")
	page, _ := strconv.ParseInt(pageS, 10, 64)

	limitS := c.QueryParam("limit")
	limit, _ := strconv.ParseInt(limitS, 10, 64)

	sortS := c.QueryParam("sort")
	sortOrderS := c.QueryParam("order")

	args := map[string]interface{}{
		"page":  page,
		"limit": limit,
		"sort":  sortS,
		"order": sortOrderS,
		"uid":   body.UID,
		"owner": body.Owner,
	}

	res, err := ph.PService.Fetch(c.Request().Context(), args)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseError{Message: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func (ph *ProblemHandler) GetProblem(c echo.Context) error {
	id := c.Param("id")

	res, err := ph.PService.GetByID(c.Request().Context(), id)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseError{Message: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func (ph *ProblemHandler) GetProblemQuantity(c echo.Context) error {
	body := &struct {
		Owner string `json:"owner"`
	}{}

	c.Bind(body)

	args := map[string]interface{}{
		"owner": body.Owner,
	}

	res, err := ph.PService.Count(c.Request().Context(), args)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseError{Message: err.Error()})
	}

	return c.JSON(http.StatusOK, res)
}

func (ph *ProblemHandler) CreateProblem(c echo.Context) error {
	problem := &models.Problem{}

	if err := c.Bind(problem); err != nil {
		return c.JSON(http.StatusBadRequest, ResponseError{Message: err.Error()})
	}

	if problem.Title == "" {
		return c.JSON(http.StatusBadRequest, ResponseError{Message: "title cannot be empty"})
	}

	if problem.Content == "" {
		return c.JSON(http.StatusBadRequest, ResponseError{Message: "content cannot be empty"})
	}

	if problem.Difficulty == "" {
		return c.JSON(http.StatusBadRequest, ResponseError{Message: "difficulty cannot be empty"})
	}

	if problem.UID == "" {
		return c.JSON(http.StatusBadRequest, ResponseError{Message: "uid cannot be empty"})
	}

	err := ph.PService.Store(c.Request().Context(), problem)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseError{Message: err.Error()})
	}

	return c.JSON(http.StatusOK, ResponseError{Message: "success"})
}

func (ph *ProblemHandler) UpdateProblem(c echo.Context) error {
	return nil
}

func (ph *ProblemHandler) DeleteProblem(c echo.Context) error {
	return nil
}
