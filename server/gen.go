package gen

//go:generate go run ./cmd/tools/tern_dotenv/main.go
//go:generate sqlc generate -f ./internal/store/pgstore/sqlc.yml
