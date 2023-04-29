package main

import (
	"context"

	firebase "firebase.google.com/go"

	"google.golang.org/api/option"
	"runwayclub.dev/codeathon/v2/controllers"
	"runwayclub.dev/codeathon/v2/core"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const uri = "mongodb+srv://quockhanh19142:nEN2jtl9Szvx9XoN@codeathonclone.vutxca7.mongodb.net/test"

func initializeServer() *core.Server {
	opt := option.WithCredentialsFile("admin-key.json")
	app, err := firebase.NewApp(context.Background(), nil, opt)

	if err != nil {
		panic(err)
	}

	server, err := core.NewServer("config.json", app)

	if err != nil {
		panic(err)
	}

	return server
}

func initializeMongo() (*mongo.Client, func()) {
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(uri).SetServerAPIOptions(serverAPI)

	client, err := mongo.Connect(context.TODO(), opts)

	if err != nil {
		panic(err)
	}

	callback := func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}

	return client, callback
}

func main() {
	server := initializeServer()

	mongoClient, callback := initializeMongo()
	defer callback()

	controllers.NewProblemController("/api/v1/problem", server, mongoClient)
	controllers.NewInfoController("/api/v1/info", server)
	controllers.NewSubmisstionController("/api/v1/submission", server, mongoClient)
	controllers.NewStatusController("/api/v1/status", server, mongoClient)

	server.Start()
}
