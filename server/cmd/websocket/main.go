package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"

	"server/internal/api"
	"server/internal/store/pgstore/pgstore"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}

	ctx := context.Background()

	connectionsPool, err := pgxpool.New(
		ctx,
		fmt.Sprintf("user=%s password=%s host=%s port=%s dbname=%s",
			os.Getenv("SERVER_DATABASE_USER"),
			os.Getenv("SERVER_DATABASE_PASSWORD"),
			os.Getenv("SERVER_DATABASE_HOST"),
			os.Getenv("SERVER_DATABASE_PORT"),
			os.Getenv("SERVER_DATABASE_NAME"),
		))
	if err != nil {
		panic(err)
	}

	defer connectionsPool.Close()

	if err := connectionsPool.Ping(ctx); err != nil {
		panic(err)
	}

	handler := api.NewHandler(pgstore.New(connectionsPool))

	go func() {
		if err := http.ListenAndServe(":8080", handler); err != nil {
			if !errors.Is(err, http.ErrServerClosed) {
				panic(err)
			}
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
}
