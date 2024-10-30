'use server'

import { api } from '@/lib/api'
import { AxiosResponse } from 'axios'

interface CreateMessageReactionRequest {
  roomID: string
  messageID: string
}

type DataType = {
  react_count: number
}

type ApiResponse = {
  data: DataType
}

export async function createMessageReaction({
  messageID,
  roomID,
}: CreateMessageReactionRequest) {
  const response: AxiosResponse<ApiResponse> = await api.patch(
    `/api/rooms/${roomID}/messages/${messageID}/react`,
  )

  const { data } = response.data

  return { amountOfReactions: data.react_count }
}
