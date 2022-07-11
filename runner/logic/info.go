package logic

import (
	"context"
	"encoding/json"
	"net/http"

	"cloud.google.com/go/firestore"
	"runwayclub.dev/codeathon/v2/core"
	"runwayclub.dev/codeathon/v2/models"
)

type InfoLogic struct {
	db     *firestore.Client
	config *core.Config
}

func NewInfoLogic(server *core.Server) *InfoLogic {
	client, err := server.App.Firestore(context.Background())
	if err != nil {
		panic(err)
	}

	return &InfoLogic{
		db:     client,
		config: server.Config,
	}
}

func (l *InfoLogic) GetLanguages() ([]*models.Language, error) {
	res, err := http.Get(l.config.Judge0 + "/languages/")
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	// parse data to languages
	languages := make([]*models.Language, 0)
	if err := json.NewDecoder(res.Body).Decode(&languages); err != nil {
		return nil, err
	}
	return languages, nil
}
