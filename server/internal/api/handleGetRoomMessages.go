package api

import (
	"log/slog"
	"net/http"

	"server/internal/utils"

	"github.com/go-chi/chi/v5"
)

func (handler apiHandler) handleGetRoomMessages(
	writer http.ResponseWriter,
	request *http.Request,
) {
	rawRoomID := chi.URLParam(request, "room_id")
	roomID := handler.verifyRawRoomID(rawRoomID, writer, request)

	messages, err := handler.queries.GetRoomMessages(request.Context(), roomID)
	if err != nil {
		slog.Error("failed to get rrom messages", "error", err)
		http.Error(
			writer,
			"something went wrong",
			http.StatusInternalServerError,
		)
		return
	}

	utils.SendJSON(writer, utils.Response{Data: messages}, http.StatusOK)
}
