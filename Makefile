run-frontend:
	cd ./apps/frontend && pnpm dev
run-api:
	cd ./apps/backend && go run ./cmd/api/main.go
run-worker:
	cd ./apps/backend && go run ./cmd/worker/main.go
wire-gen:
	cd ./apps/backend/internal/app && wire gen
