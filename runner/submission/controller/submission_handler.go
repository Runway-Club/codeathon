package controller

import (
	"fmt"

	"github.com/labstack/echo/v4"
	"runwayclub.dev/codeathon/v2/models"
)

// ResponseError represent the response error struct
type ResponseError struct {
	Message string `json:"message"`
}

// SubmissionHandler  represent the httphandler for Submission
type SubmissionHandler struct {
	SService models.SubmissionService
	JService models.JudgeCEService
}

func NewSubmissionHandler(ep string, e *echo.Echo, ss models.SubmissionService, js models.JudgeCEService) {
	handler := &SubmissionHandler{
		SService: ss,
		JService: js,
	}

	api := e.Group(ep)

	api.GET("/", handler.FetchSubmission)
	api.GET("/:id", handler.GetSubmission)
	api.POST("/", handler.CreateSubmission)

	go fmt.Println("Submission handler is ready")
}

func (sh *SubmissionHandler) FetchSubmission(c echo.Context) error {
	pid := c.QueryParam("problem_id")
	uid := c.QueryParam("uid")

	if pid == "" {
		return c.JSON(400, ResponseError{Message: "problem_id is required"})
	}

	if uid == "" {
		return c.JSON(400, ResponseError{Message: "uid is required"})
	}

	result, err := sh.SService.GetSubmissionByUID(c.Request().Context(), uid, pid)

	if err != nil {
		return c.JSON(500, ResponseError{Message: err.Error()})
	}

	return c.JSON(200, result)
}

func (sh *SubmissionHandler) GetSubmission(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return c.JSON(400, ResponseError{Message: "id is required"})
	}

	result, err := sh.SService.GetSubmissionByID(c.Request().Context(), id)

	if err != nil {
		return c.JSON(500, ResponseError{Message: err.Error()})
	}

	return c.JSON(200, result)

}

func (sh *SubmissionHandler) CreateSubmission(c echo.Context) error {
	submission := &models.Submission{}

	if err := c.Bind(submission); err != nil {
		return c.JSON(400, ResponseError{Message: err.Error()})
	}

	_id, err := sh.SService.CreateSubmission(c.Request().Context(), submission)

	if err != nil {
		return c.JSON(500, ResponseError{Message: err.Error()})
	}

	submissionResult := &models.SubmissionResult{
		ID:         _id,
		LanguageID: submission.LanguageID,
		Code:       submission.Code,
		Evaluated:  submission.Evaluated,
		Score:      submission.Score,
		CreateAt:   submission.CreateAt,
		ProblemID:  submission.ProblemID,
		UID:        submission.UID,

		TotalScore:  int32(0),
		TotalTime:   float64(0),
		TotalMemory: int32(0),

		Result: "Evaluating",
	}

	go sh.JService.RequestEvaluation(c.Request().Context(), submissionResult)

	return c.JSON(200, submissionResult)
}
