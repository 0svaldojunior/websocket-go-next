package api

import (
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func (handler apiHandler) handleMarkMessageAsAnswered(
	writer http.ResponseWriter,
	request *http.Request,
) {
	rawRoomID := chi.URLParam(request, "room_id")
	roomID := handler.verifyRawRoomID(rawRoomID, writer, request)

	rawMessageID := chi.URLParam(request, "message_id")
	messageID := handler.verifyRawMessageID(rawMessageID, writer, request)

	message, err := handler.queries.GetMessage(request.Context(), messageID)
	if err != nil {
		slog.Error("failed to mark message as answered", "error", err)
		http.Error(
			writer,
			"something went wrong",
			http.StatusInternalServerError,
		)
		return
	}

	if message.RoomID != roomID {
		slog.Warn("your message id does not match with room id")
		http.Error(
			writer,
			"your does not remove react this message",
			http.StatusBadRequest,
		)
		return
	}

	err = handler.queries.MArkMessageAsAnswered(request.Context(), messageID)
	if err != nil {
		slog.Error("failed to mark message answered", "error", err)
		http.Error(
			writer,
			"something went wrong",
			http.StatusInternalServerError,
		)
		return
	}

	writer.WriteHeader(http.StatusOK)

	go handler.notifyClients(Message{
		Kind:   MessageKindMessageAnswered,
		RoomID: rawRoomID,
		Value:  MessageMessageAnswered{ID: rawMessageID},
	})
}
