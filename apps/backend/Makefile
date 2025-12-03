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

install-tools:
	go install github.com/pressly/goose/v3/cmd/goose@latest


