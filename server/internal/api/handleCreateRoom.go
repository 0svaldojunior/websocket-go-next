package api

import (
	"encoding/json"
	"log/slog"
	"net/http"
)

func (handler apiHandler) handleCreateRoom(
	writer http.ResponseWriter,
	request *http.Request,
) {
	type _body struct {
		Theme string `json:"theme"`
	}

	var body _body
	if err := json.NewDecoder(request.Body).Decode(&body); err != nil {
		http.Error(writer, "invalid json", http.StatusBadRequest)
		return
	}

	roomID, err := handler.queries.InsertRoom(request.Context(), body.Theme)
	if err != nil {
		slog.Error("failed to insert room", "error", err)
		http.Error(
			writer,
			"something went wrong",
			http.StatusInternalServerError,
		)
		return
	}

	type response struct {
		ID string `json:"id"`
	}

	data, _ := json.Marshal(response{ID: roomID.String()})
	writer.Header().Set("Content-Type", "application/json")
	writer.Write(data)
}
