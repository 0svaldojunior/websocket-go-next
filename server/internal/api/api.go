package api

import (
	"context"
	"net/http"
	"sync"

	"server/internal/store/pgstore/pgstore"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/gorilla/websocket"
)

type apiHandler struct {
	queries     *pgstore.Queries
	router      *chi.Mux
	upgrader    websocket.Upgrader
	subscribers map[string]map[*websocket.Conn]context.CancelFunc
	mutex       *sync.Mutex
}

func (handler apiHandler) ServeHTTP(
	writer http.ResponseWriter,
	request *http.Request,
) {
	handler.router.ServeHTTP(writer, request)
}

func NewHandler(queries *pgstore.Queries) http.Handler {
	api := apiHandler{
		queries: queries,
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool { return true },
		},
		subscribers: make(map[string]map[*websocket.Conn]context.CancelFunc),
		mutex:       &sync.Mutex{},
	}

	router := chi.NewRouter()
	router.Use(middleware.RequestID, middleware.Recoverer, middleware.Logger)

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"https://*", "http://*"},
		AllowedMethods: []string{
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"OPTIONS",
			"PATCH",
		},
		AllowedHeaders: []string{
			"Accept",
			"Authorization",
			"Content-Type",
			"X-CSRF-Token",
		},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	router.Get("/subscribe/{room_id}", api.handleSubscribe)

	router.Route("/api", func(router chi.Router) {
		router.Route("/rooms", func(router chi.Router) {
			router.Post("/", api.handleCreateRoom)
			router.Get("/", api.handleGetRooms)

			router.Route("/{room_id}/messages", func(router chi.Router) {
				router.Post("/", api.handleCreateRoomMessages)
				router.Get("/", api.handleGetRoomMessages)

				router.Route("/{message_id}", func(router chi.Router) {
					router.Get("/", api.handleGetRoomMessage)
					router.Patch("/react", api.handleReactToMessage)
					router.Delete("/react", api.handleRemoveReactFromMessage)
					router.Patch("/answer", api.handleMarkMessageAsAnswered)
				})
			})
		})
	})

	api.router = router

	return api
}
