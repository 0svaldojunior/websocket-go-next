package api

import "log/slog"

const (
	MessageKindMessageCreated          = "message_created"
	MessageKindMessageRactionIncreased = "message_reaction_increased"
	MessageKindMessageRactionDecreased = "message_reaction_decreased"
	MessageKindMessageAnswered         = "message_answered"
)

type MessageMessageReactionIncreased struct {
	ID    string `json:"id"`
	Count int64  `json:"count"`
}

type MessageMessageReactionDecreased struct {
	ID    string `json:"id"`
	Count int64  `json:"count"`
}

type MessageMessageAnswered struct {
	ID string `json:"id"`
}

type MessageMessageCreated struct {
	ID      string `json:"id"`
	Message string `json:"message"`
}

type Message struct {
	Kind   string `json:"kind"`
	Value  any    `json:"value"`
	RoomID string `json:"-"`
}

func (handler apiHandler) notifyClients(msg Message) {
	handler.mutex.Lock()
	defer handler.mutex.Unlock()

	subscribers, ok := handler.subscribers[msg.RoomID]
	if !ok || len(subscribers) == 0 {
		return
	}

	for connection, cancel := range subscribers {
		if err := connection.WriteJSON(msg); err != nil {
			slog.Error("failet to send message to client", "error", err)
			cancel()
		}
	}
}
