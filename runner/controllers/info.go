package controllers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"runwayclub.dev/codeathon/v2/core"
	"runwayclub.dev/codeathon/v2/logic"
)

func NewInfoController(path string, server *core.Server) {
	infoLogic := logic.NewInfoLogic(server)
	api := server.Echo.Group(path)
	api.GET("/languages/", func(c echo.Context) error {
		languages, err := infoLogic.GetLanguages()
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}
		return c.JSON(200, languages)
	})
}
