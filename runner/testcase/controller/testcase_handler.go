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
type TestCaseHandler struct {
	TCService models.TestCaseService
}

func NewTestCaseHandler(ep string, e *echo.Echo, tcs models.TestCaseService) {
	handler := &TestCaseHandler{
		TCService: tcs,
	}

	api := e.Group(ep)

	api.GET("/", handler.GetAllTestCase)
	api.GET("/sample", handler.GetAllSampleTestCase)
	api.GET("/:id", handler.GetTestCase)
	api.POST("/", handler.CreateTestCase)
	api.PUT("/", handler.UpdateTestCase)
}

func (tch *TestCaseHandler) GetAllTestCase(c echo.Context) error {
	problem_id := c.QueryParam("problem")

	if problem_id == "" {
		return c.JSON(http.StatusBadRequest, ResponseError{Message: "Invalid problem id"})
	}

	testcases, err := tch.TCService.Fetch(c.Request().Context(), problem_id)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseError{Message: err.Error()})
	}

	return c.JSON(http.StatusOK, testcases)
}

func (tch *TestCaseHandler) GetAllSampleTestCase(c echo.Context) error {
	problem_id := c.QueryParam("problem")

	if problem_id == "" {
		return c.JSON(http.StatusBadRequest, ResponseError{Message: "Invalid problem id"})
	}

	testcases, err := tch.TCService.FetchSample(c.Request().Context(), problem_id)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseError{Message: err.Error()})
	}

	return c.JSON(http.StatusOK, testcases)
}

func (tch *TestCaseHandler) GetTestCase(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return c.JSON(http.StatusBadRequest, ResponseError{Message: "Invalid id"})
	}

	testcase, err := tch.TCService.GetByID(c.Request().Context(), id)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseError{Message: err.Error()})
	}

	return c.JSON(http.StatusOK, testcase)
}

func (tch *TestCaseHandler) CreateTestCase(c echo.Context) error {
	testcase := &models.TestCase{}

	if err := c.Bind(testcase); err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseError{Message: err.Error()})
	}

	if err := tch.TCService.Store(c.Request().Context(), testcase); err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseError{Message: err.Error()})
	}

	return c.JSON(http.StatusOK, ResponseError{Message: "Status created"})

}

func (tch *TestCaseHandler) UpdateTestCase(c echo.Context) error {
	testcase := &models.TestCase{}

	if err := c.Bind(testcase); err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseError{Message: err.Error()})
	}

	if err := tch.TCService.Update(c.Request().Context(), testcase); err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseError{Message: err.Error()})
	}

	return c.JSON(http.StatusOK, testcase)
}
