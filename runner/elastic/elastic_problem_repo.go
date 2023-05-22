package elastic

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"

	"github.com/elastic/go-elasticsearch/esapi"
	"github.com/elastic/go-elasticsearch/v8"
	"runwayclub.dev/codeathon/v2/models"
)

type elasticProblemRepository struct {
	elastic *elasticsearch.Client
}

func NewElasticProblemRepository(es *elasticsearch.Client) models.ElasticProblemRepository {
	return &elasticProblemRepository{
		elastic: es,
	}
}

func (epr *elasticProblemRepository) createQuery(query string, fields []string) map[string]interface{} {
	q := map[string]interface{}{
		"query": map[string]interface{}{
			"multi_match": map[string]interface{}{
				"query":  query,
				"fields": fields,
				"type":   "phrase",
			},
		},
	}

	return q
}

func (epr *elasticProblemRepository) removeDuplicate(sliceList []string) []string {
	allKeys := make(map[string]bool)
	list := []string{}
	for _, item := range sliceList {
		if _, value := allKeys[item]; !value {
			allKeys[item] = true
			list = append(list, item)
		}
	}
	return list
}

func (epr *elasticProblemRepository) Search(c context.Context, index string, fields []string, text string) ([]string, error) {
	var (
		buf bytes.Buffer
		r   map[string]interface{}
	)

	query := epr.createQuery(text, fields)

	if err := json.NewEncoder(&buf).Encode(query); err != nil {
		return []string{}, err
	}

	res, err := epr.elastic.Search(
		epr.elastic.Search.WithContext(context.Background()),
		epr.elastic.Search.WithIndex("problem"),
		epr.elastic.Search.WithBody(&buf),
		epr.elastic.Search.WithTrackTotalHits(true),
		epr.elastic.Search.WithPretty(),
	)

	if err != nil {
		return []string{}, err
	}
	defer res.Body.Close()

	if res.IsError() {
		return []string{}, errors.New(res.String())
	}

	if err := json.NewDecoder(res.Body).Decode(&r); err != nil {
		return []string{}, err
	}

	result := []string{}

	for _, hit := range r["hits"].(map[string]interface{})["hits"].([]interface{}) {
		source := hit.(map[string]interface{})["_source"].(map[string]interface{})

		for _, field := range fields {
			if source[field] != nil {
				result = append(result, source[field].(string))
			}
		}
	}

	result = epr.removeDuplicate(result)

	return result, nil
}

func (epr *elasticProblemRepository) InsertOne(c context.Context, index string, id string, doc interface{}) error {
	data, err := json.Marshal(doc)

	if err != nil {
		return err
	}

	// Set up the request object.
	req := esapi.IndexRequest{
		Index:      index,
		DocumentID: id,
		Body:       bytes.NewReader(data),
		Refresh:    "true",
	}

	// Perform the request with the client.
	res, err := req.Do(c, epr.elastic)

	if err != nil {
		return err
	}

	defer res.Body.Close()

	if res.IsError() {
		return errors.New(res.String())
	}

	return nil
}

func (epr *elasticProblemRepository) UpdateOne(c context.Context, index string, id string, doc interface{}) error {
	return nil
}

func (epr *elasticProblemRepository) DeleteOne(c context.Context, index string, id string) error {
	return nil
}
