package api

import (
	"log/slog"
	"net/http"

	"server/internal/utils"

	"github.com/go-chi/chi/v5"
)

func (handler apiHandler) handleGetRoomMessage(
	writer http.ResponseWriter,
	request *http.Request,
) {
	rawRoomID := chi.URLParam(request, "room_id")
	roomID := handler.verifyRawRoomID(rawRoomID, writer, request)

	rawMessageID := chi.URLParam(request, "message_id")
	messageID := handler.verifyRawMessageID(rawMessageID, writer, request)

	message, err := handler.queries.GetMessage(request.Context(), messageID)
	if err != nil {
		slog.Error("failed to get message", "error", err)
		http.Error(
			writer,
			"something went wrong",
			http.StatusInternalServerError,
		)
		return
	}

	if message.RoomID != roomID {
		slog.Warn("your id does not match room id")
		http.Error(
			writer,
			"your id does not match with room id",
			http.StatusBadRequest,
		)
		return
	}

	utils.SendJSON(writer, utils.Response{Data: message}, http.StatusOK)
}
