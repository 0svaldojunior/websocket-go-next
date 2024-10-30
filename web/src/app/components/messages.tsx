'use client'

import { List } from './List'
import { getRoomMessages } from '../http/get-room-messages'
import { useMessagesWebSockets } from '@/hooks/use-messages-websockets'
import { useSuspenseQuery } from '@tanstack/react-query'

interface MessagesProps {
  roomID: string
}

export function Messages({ roomID }: MessagesProps) {
  if (!roomID) {
    throw new Error('Messages component must be used within room page')
  }

  const { data } = useSuspenseQuery({
    queryKey: ['messages', roomID],
    queryFn: () => getRoomMessages({ roomID }),
  })

  const { messages } = data

  useMessagesWebSockets({ roomID })

  if (messages?.length === 0) {
    return <p>{`Room does not have any questions!`}</p>
  }

  const sortedMessages = messages?.sort((a, b) => {
    return b.amountOfReactions - a.amountOfReactions
  })

  return (
    <List.OL>
      {sortedMessages?.map((item) => (
        <List.LI
          key={item.id}
          messageID={item.id}
          roomID={roomID}
          text={item.text}
          amountOfReactions={item.amountOfReactions}
          answered={item.answered}
        />
      ))}
    </List.OL>
  )
}
