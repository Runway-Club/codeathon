package core

import (
	"encoding/json"
	"io/ioutil"

	"github.com/labstack/echo/v4"
)

type Server struct {
	Echo   *echo.Echo
	Config *Config
}

func NewServer(configFile string) (*Server, error) {
	configRaw, err := ioutil.ReadFile(configFile)
	if err != nil {
		panic(err)
	}
	config := &Config{}
	err = json.Unmarshal(configRaw, config)
	if err != nil {
		panic(err)
	}

	e := echo.New()

	return &Server{
		Echo:   e,
		Config: config,
	}, nil
}
