package main

import (
	"context"

	"runwayclub.dev/codeathon/v2/core"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	_problemHandler "runwayclub.dev/codeathon/v2/problem/controller"
	_problemRepo "runwayclub.dev/codeathon/v2/problem/repository/mongo"
	_problemService "runwayclub.dev/codeathon/v2/problem/service"

	_submissionHandler "runwayclub.dev/codeathon/v2/submission/controller"
	_submissionRepo "runwayclub.dev/codeathon/v2/submission/repository/mongo"
	_submissionService "runwayclub.dev/codeathon/v2/submission/service"

	_statusHandler "runwayclub.dev/codeathon/v2/status/controller"
	_statusRepo "runwayclub.dev/codeathon/v2/status/repository/mongo"
	_statusService "runwayclub.dev/codeathon/v2/status/service"

	_testCaseHandler "runwayclub.dev/codeathon/v2/testcase/controller"
	_testCaseRepo "runwayclub.dev/codeathon/v2/testcase/repository/mongo"
	_testCaseService "runwayclub.dev/codeathon/v2/testcase/service"
)

const uri = "mongodb+srv://quockhanh19142:nEN2jtl9Szvx9XoN@codeathonclone.vutxca7.mongodb.net/test"

func initializeServer() *core.Server {
	server, err := core.NewServer("config.json")

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

	client, close := initializeMongo()
	defer close()

	_mongoDatabase := client.Database("codeathon")

	prolemRepo := _problemRepo.NewMongoProblemRepository(_mongoDatabase)
	statusRepo := _statusRepo.NewMongoStatusRepository(_mongoDatabase)
	testCaseRepo := _testCaseRepo.NewMongoTestCaseRepository(_mongoDatabase)
	submissionRepo := _submissionRepo.NewMongoSubmissionRepository(_mongoDatabase)

	problemService := _problemService.NewProblemService(prolemRepo)
	statusService := _statusService.NewStatusService(statusRepo)
	testCaseService := _testCaseService.NewTestCaseService(testCaseRepo)
	submissionService := _submissionService.NewSubmissionService(submissionRepo)
	judgeService := _submissionService.NewJudgeService(testCaseService, submissionService, server.Config.Judge0)

	_problemHandler.NewProblemHandler("/api/v1/problem", server.Echo, problemService)
	_statusHandler.NewStatusHandler("/api/v1/status", server.Echo, statusService)
	_testCaseHandler.NewTestCaseHandler("/api/v1/testcase", server.Echo, testCaseService)
	_submissionHandler.NewSubmissionHandler("/api/v1/submission", server.Echo, submissionService, judgeService)

	server.Start()
}
