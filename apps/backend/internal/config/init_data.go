package config

import (
	"errors"

	"github.com/knadh/koanf/parsers/yaml"
	"github.com/knadh/koanf/providers/env"
	"github.com/knadh/koanf/providers/file"
	"github.com/knadh/koanf/v2"
	"github.com/subosito/gotenv"
)

type Employee struct {
	Email     string `koanf:"email"`
	Password  string `koanf:"password"`
	Role      string `koanf:"role"`
	Code      string `koanf:"code"`
	FirstName string `koanf:"first_name"`
	LastName  string `koanf:"last_name"`
	Phone     string `koanf:"phone"`
	Position  string `koanf:"position"`
}

type InitData struct {
	Employees []Employee `koanf:"employees"`
}

func LoadInitData() (*InitData, error) {
	_ = gotenv.Load()
	k := koanf.New(".")

	if err := k.Load(env.Provider("", ".", nil), nil); err != nil {
		return nil, err
	}

	initDataFile := k.String("INIT_DATA_FILE")
	if initDataFile == "" {
		return nil, errors.New("INIT_DATA_FILE not set")
	}

	if err := k.Load(file.Provider(initDataFile), yaml.Parser()); err != nil {
		return nil, err
	}

	var initData InitData
	if err := k.Unmarshal("", &initData); err != nil {
		return nil, err
	}

	return &initData, nil
}
