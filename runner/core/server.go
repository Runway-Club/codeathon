package core

import (
	"encoding/json"
	"fmt"
	"io/ioutil"

	firebase "firebase.google.com/go"
	"github.com/labstack/echo/v4"
)

type Server struct {
	Echo   *echo.Echo
	Config *Config
	App    *firebase.App
}

func NewServer(configFile string, app *firebase.App) (*Server, error) {
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
		App:    app,
	}, nil
}

func (s *Server) Start() {
	s.Echo.Start(fmt.Sprintf("%s:%d", s.Config.Host, s.Config.Port))
}
