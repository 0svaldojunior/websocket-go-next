package utils

import (
	"encoding/json"
	"log/slog"
	"net/http"
)

type Response struct {
	Error string `json:"error,omitempty"`
	Data  any    `json:"data,omitempty"`
}

func SendJSON(writer http.ResponseWriter, response Response, status int) {
	writer.Header().Set("Content-Type", "application/json")

	data, err := json.Marshal(response)
	if err != nil {
		slog.Error("Failed to marshal json response data", "error", err)
		SendJSON(
			writer,
			Response{Error: "Something went wrong"},
			http.StatusInternalServerError,
		)
		return
	}

	writer.WriteHeader(status)
	if _, err := writer.Write(data); err != nil {
		slog.Error("Failed to write json response to client", "error", err)
		return
	}
}
