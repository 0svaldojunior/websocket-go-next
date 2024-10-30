package api

import (
	"log/slog"
	"net/http"

	"server/internal/utils"

	"github.com/go-chi/chi/v5"
)

func (handler apiHandler) handleReactToMessage(
	writer http.ResponseWriter,
	request *http.Request,
) {
	rawRoomID := chi.URLParam(request, "room_id")
	roomID := handler.verifyRawRoomID(rawRoomID, writer, request)

	rawMessageID := chi.URLParam(request, "message_id")
	messageID := handler.verifyRawMessageID(rawMessageID, writer, request)

	message, err := handler.queries.GetMessage(request.Context(), messageID)
	if err != nil {
		slog.Error("failed to react message", "error", err)
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
			"your does not react this message",
			http.StatusBadRequest,
		)
		return
	}

	reactCount, err := handler.queries.ReactToMessage(
		request.Context(),
		messageID,
	)
	if err != nil {
		slog.Error("failed to react message", "error", err)
		http.Error(
			writer,
			"something went wrong",
			http.StatusInternalServerError,
		)
		return
	}

	utils.SendJSON(writer, utils.Response{Data: reactCount}, http.StatusOK)

	go handler.notifyClients(Message{
		Kind:   MessageKindMessageRactionIncreased,
		RoomID: rawRoomID,
		Value: MessageMessageReactionIncreased{
			ID:    rawMessageID,
			Count: reactCount,
		},
	})
}
