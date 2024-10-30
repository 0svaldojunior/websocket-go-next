'use server'

import { api } from '@/lib/api'
import { AxiosResponse } from 'axios'

interface GetRoomMessagesRequest {
  roomID: string
}

export interface GetRoomMessagesResponse {
  messages:
    | {
        id: string
        text: string
        amountOfReactions: number
        answered: boolean
      }[]
    | undefined
}

type DataType = {
  id: string
  room_id: string
  message: string
  reaction_count: number
  answered: boolean
}

type ApiResponse = {
  data: DataType[] | null
}

export async function getRoomMessages({
  roomID,
}: GetRoomMessagesRequest): Promise<GetRoomMessagesResponse> {
  const response: AxiosResponse<ApiResponse> = await api.get(
    `/api/rooms/${roomID}/messages`,
  )

  const { data } = response.data

  const messages = data?.map((item) => ({
    id: item.id,
    text: item.message,
    amountOfReactions: item.reaction_count,
    answered: item.answered,
  }))

  return { messages }
}
