package main

import (
	"context"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
	"runwayclub.dev/codeathon/v2/controllers"
	"runwayclub.dev/codeathon/v2/core"
)

func main() {
	opt := option.WithCredentialsFile("admin-key.json")
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		panic(err)
	}

	server, err := core.NewServer("config.json", app)
	if err != nil {
		panic(err)
	}

	controllers.NewExecutionController("/api/v1/execution", server)
	controllers.NewInfoController("/api/v1/info", server)

	server.Start()
}
