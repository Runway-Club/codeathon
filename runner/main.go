package main

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"runwayclub.dev/codeathon/v2/core"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/elastic/go-elasticsearch/v8"

	_elastic "runwayclub.dev/codeathon/v2/elastic"

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

func initializeServer() *core.Server {
	server, err := core.NewServer("config.json")

	if err != nil {
		panic(err)
	}

	return server
}

func initializeMongo(uri string) (*mongo.Client, func()) {
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

func initializeElastic(e core.Elastic) *elasticsearch.Client {
	var (
		r map[string]interface{}
	)

	cfg := elasticsearch.Config{
		Addresses:              e.Addresses,
		Username:               e.Username,
		Password:               e.Password,
		CertificateFingerprint: e.CertificateFingerprint,
		Transport: &http.Transport{
			MaxIdleConnsPerHost:   10,
			ResponseHeaderTimeout: time.Second,
			TLSClientConfig: &tls.Config{
				MinVersion: tls.VersionTLS12,
			},
		},
	}

	es, err := elasticsearch.NewClient(cfg)

	if err != nil {
		panic(fmt.Sprintf("Error creating the client: %s", err))
	}

	res, err := es.Info()

	if err != nil {
		panic(err)
	}

	defer res.Body.Close()

	// Check response status
	if res.IsError() {
		panic(fmt.Sprintf("Error: %s", res.String()))
	}

	// Deserialize the response into a map.
	if err := json.NewDecoder(res.Body).Decode(&r); err != nil {
		panic(fmt.Sprintf("Error parsing the response body: %s", err))
	}

	// Print client and server version numbers.
	log.Printf("Client: %s", elasticsearch.Version)
	log.Printf("Server: %s", r["version"].(map[string]interface{})["number"])
	log.Println(strings.Repeat("~", 37))

	return es
}

func main() {
	server := initializeServer()

	client, close := initializeMongo(server.Config.MongoURI)
	defer close()

	esClient := initializeElastic(*server.Config.Elastic)

	_mongoDatabase := client.Database("codeathon")

	prolemRepo := _problemRepo.NewMongoProblemRepository(_mongoDatabase)
	statusRepo := _statusRepo.NewMongoStatusRepository(_mongoDatabase)
	testCaseRepo := _testCaseRepo.NewMongoTestCaseRepository(_mongoDatabase)
	submissionRepo := _submissionRepo.NewMongoSubmissionRepository(_mongoDatabase)
	elasticRepo := _elastic.NewElasticProblemRepository(esClient)

	problemService := _problemService.NewProblemService(prolemRepo, elasticRepo)
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
