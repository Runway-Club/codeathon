package controllers

import (
	"github.com/labstack/echo/v4"
	"runwayclub.dev/codeathon/v2/core"
	"runwayclub.dev/codeathon/v2/logic"
)

func NewInfoController(path string, server *core.Server) {
	infoLogic := logic.NewInfoLogic(server)
	server.Echo.GET(path, func(c echo.Context) error {
		languages, err := infoLogic.GetLanguages()
		if err != nil {
			return err
		}
		return c.JSON(200, languages)
	})
}
