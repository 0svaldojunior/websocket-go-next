package api

import (
	"errors"
	"net/http"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

func (handler apiHandler) verifyRawMessageID(
	rawMessageID string,
	writer http.ResponseWriter,
	request *http.Request,
) uuid.UUID {
	messageID, err := uuid.Parse(rawMessageID)
	if err != nil {
		http.Error(writer, "invalid message id", http.StatusBadRequest)
		return uuid.Nil
	}

	_, err = handler.queries.GetMessage(request.Context(), messageID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			http.Error(writer, "message not found", http.StatusBadRequest)
			return uuid.Nil
		}

		http.Error(
			writer,
			"something went wrong",
			http.StatusInternalServerError,
		)
		return uuid.Nil
	}

	return messageID
}
