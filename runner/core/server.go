package core

import (
	"encoding/json"
	"fmt"
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

	// add cors
	e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Response().Header().Set("Access-Control-Allow-Origin", "*")
			c.Response().Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			c.Response().Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
			if c.Request().Method == "OPTIONS" {
				return nil
			}
			return next(c)
		}
	})

	return &Server{
		Echo:   e,
		Config: config,
	}, nil
}

func (s *Server) Start() {
	s.Echo.Start(fmt.Sprintf("%s:%d", s.Config.Host, s.Config.Port))
}
