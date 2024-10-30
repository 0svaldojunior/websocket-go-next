package api

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"server/internal/utils"
)

func (handler apiHandler) handleGetRooms(
	writer http.ResponseWriter,
	request *http.Request,
) {
	type _body struct {
		ID string `json:"id"`
	}

	var body _body
	if err := json.NewDecoder(request.Body).Decode(&body); err != nil {
		http.Error(writer, "invalid json", http.StatusBadRequest)
		return
	}

	rawRoomID := body.ID

	roomID := handler.verifyRawRoomID(string(rawRoomID), writer, request)

	room, err := handler.queries.GetRoom(request.Context(), roomID)
	if err != nil {
		slog.Error("failed to get room", "error", err)
		http.Error(
			writer,
			"something went wrong",
			http.StatusInternalServerError,
		)
		return
	}

	utils.SendJSON(writer, utils.Response{Data: room}, http.StatusOK)
}
