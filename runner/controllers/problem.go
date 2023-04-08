package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"runwayclub.dev/codeathon/v2/core"
	"runwayclub.dev/codeathon/v2/logic"
)


func DisplayProblemController(s *core.Server){
	router := gin.Default()
	api := router.Group("/api")
	problemLogic:= logic.NewProblemLogic(s)
	{
		v1:= api.Group("/v1")
		{
			v1.GET("problem/:id", func(context *gin.Context){
				id := context.Param("id");
				problem, err := problemLogic.Get(id)
				if err != nil {
					context.String(http.StatusInternalServerError, err.Error())
				}
				context.JSON(http.StatusOK,problem);
			})
		}
	}
	router.Run(":8080");
}

func GetUserProblemController(s *core.Server){
	router := gin.Default()
	api := router.Group("/api")
	problemLogic:= logic.NewProblemLogic(s)
	{
		v1:= api.Group("/v1")
		{
			v1.GET("user/:id", func(context *gin.Context){
				userId := context.Param("id");
				problem, err := problemLogic.GetUserProblem(userId)
				if err != nil {
					context.String(http.StatusInternalServerError, err.Error())
				}
				context.JSON(http.StatusOK,problem);
			})
		}
	}
	router.Run(":8080");
}

