package api

import (
	"context"
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/gorilla/websocket"
)

func (handler apiHandler) handleSubscribe(
	writer http.ResponseWriter,
	request *http.Request,
) {
	rawRoomID := chi.URLParam(request, "room_id")
	handler.verifyRawRoomID(rawRoomID, writer, request)

	conection, err := handler.upgrader.Upgrade(writer, request, nil)
	if err != nil {
		slog.Warn("failed to upgrade connection", "error", err)
		http.Error(
			writer,
			"failed to upgrade to websocket connection",
			http.StatusBadRequest,
		)
		return
	}

	defer conection.Close()

	ctx, cancel := context.WithCancel(request.Context())

	handler.mutex.Lock()
	if _, ok := handler.subscribers[rawRoomID]; !ok {
		handler.subscribers[rawRoomID] = make(
			map[*websocket.Conn]context.CancelFunc,
		)
	}
	slog.Info(
		"new client connected",
		"roo_id",
		rawRoomID,
		"client_ip",
		request.RemoteAddr,
	)
	handler.subscribers[rawRoomID][conection] = cancel
	handler.mutex.Unlock()

	<-ctx.Done()

	handler.mutex.Lock()
	delete(handler.subscribers[rawRoomID], conection)
	handler.mutex.Unlock()
}
