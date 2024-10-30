'use client'

import { GetRoomMessagesResponse } from '@/app/http/get-room-messages'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

interface UseMessagesWebSocketsProps {
  roomID: string
}

type WebhookMessage =
  | { kind: 'message_created'; value: { id: string; message: string } }
  | { kind: 'message_answered'; value: { id: string } }
  | { kind: 'message_reaction_increased'; value: { id: string; count: number } }
  | { kind: 'message_reaction_decreased'; value: { id: string; count: number } }

export function useMessagesWebSockets({ roomID }: UseMessagesWebSocketsProps) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const webSocket = new WebSocket(`ws://localhost:8080/subscribe/${roomID}`)

    webSocket.onopen = () => {
      console.log('WebSocket connected!')
    }

    webSocket.onmessage = (event) => {
      const data: WebhookMessage = JSON.parse(event.data)

      switch (data.kind) {
        case 'message_created':
          queryClient.setQueryData<GetRoomMessagesResponse>(
            ['messages', roomID],
            (prevState) => {
              return {
                messages: [
                  ...(prevState?.messages ?? []),
                  {
                    id: data.value.id,
                    text: data.value.message,
                    amountOfReactions: 0,
                    answered: false,
                  },
                ],
              }
            },
          )
          break
        case 'message_answered':
          queryClient.setQueryData<GetRoomMessagesResponse>(
            ['messages', roomID],
            (prevState) => {
              if (!prevState) {
                return undefined
              }

              return {
                messages: prevState.messages?.map((item) => {
                  if (item.id === data.value.id) {
                    return { ...item, answered: true }
                  }

                  return item
                }),
              }
            },
          )
          break
        case 'message_reaction_decreased':
        case 'message_reaction_increased':
          queryClient.setQueryData<GetRoomMessagesResponse>(
            ['messages', roomID],
            (prevState) => {
              if (!prevState) {
                return undefined
              }

              return {
                messages: prevState.messages?.map((item) => {
                  if (item.id === data.value.id) {
                    return {
                      ...item,
                      amountOfReactions: data.value.count,
                    }
                  }

                  return item
                }),
              }
            },
          )
          break
      }
    }

    webSocket.onclose = () => {
      console.log('WebSocket connection closed!')
    }

    return () => {
      webSocket.close()
    }
  }, [roomID, queryClient])
}
