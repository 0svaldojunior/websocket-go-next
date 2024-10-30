package api

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"server/internal/store/pgstore/pgstore"
	"server/internal/utils"

	"github.com/go-chi/chi/v5"
)

func (handler apiHandler) handleCreateRoomMessages(
	writer http.ResponseWriter,
	request *http.Request,
) {
	rawRoomID := chi.URLParam(request, "room_id")
	roomID := handler.verifyRawRoomID(rawRoomID, writer, request)

	type _body struct {
		Message string `json:"message"`
	}

	var body _body
	if err := json.NewDecoder(request.Body).Decode(&body); err != nil {
		http.Error(writer, "invalid json", http.StatusBadRequest)
		return
	}

	messageID, err := handler.queries.InsertMessage(
		request.Context(),
		pgstore.InsertMessageParams{RoomID: roomID, Message: body.Message},
	)
	if err != nil {
		slog.Error("failed to insert message", "error", err)
		http.Error(
			writer,
			"something went wrong",
			http.StatusInternalServerError,
		)
		return
	}

	utils.SendJSON(writer, utils.Response{Data: messageID}, http.StatusCreated)

	go handler.notifyClients(
		Message{
			Kind:   MessageKindMessageCreated,
			RoomID: rawRoomID,
			Value: MessageMessageCreated{
				ID:      messageID.String(),
				Message: body.Message,
			},
		},
	)
}
