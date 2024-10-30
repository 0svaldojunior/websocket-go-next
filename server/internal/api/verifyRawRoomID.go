package api

import (
	"errors"
	"net/http"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

func (handler apiHandler) verifyRawRoomID(
	rawRoomID string,
	writer http.ResponseWriter,
	request *http.Request,
) uuid.UUID {
	roomID, err := uuid.Parse(rawRoomID)
	if err != nil {
		http.Error(writer, "invalid room id", http.StatusBadRequest)
		return uuid.Nil
	}

	_, err = handler.queries.GetRoom(request.Context(), roomID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			http.Error(writer, "room not found", http.StatusBadRequest)
			return uuid.Nil
		}

		http.Error(
			writer,
			"something went wrong",
			http.StatusInternalServerError,
		)
		return uuid.Nil
	}

	return roomID
}
