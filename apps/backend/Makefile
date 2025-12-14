CMD_PATH=./cmd

run-api:
	go run $(CMD_PATH)/api/main.go

run-worker:
	go run $(CMD_PATH)/worker/main.go

migrate-create:
	goose -s create ${name} sql

migrate-up:
	goose up

migrate-up-one:
	goose up-by-one

migrate-up-to:
	goose up ${version}	

migrate-down-one:
	goose down

migrate-down-to:
	goose down ${version}

migrate-down-all:
	goose down

swag-gen:
	swag init -g cmd/api/main.go

install-tools:
	go install github.com/pressly/goose/v3/cmd/goose@latest
	go install github.com/swaggo/swag/cmd/swag@latest
	go install github.com/google/wire/cmd/wire@latest

