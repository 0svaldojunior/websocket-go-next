'use server'

import { api } from '@/lib/api'
import { AxiosResponse } from 'axios'

interface CreateMessageRequest {
  roomID: string
  message: string
}

type DataType = {
  id: string
}

type ApiResponse = {
  data: DataType
}

export async function createMessage({ message, roomID }: CreateMessageRequest) {
  const response: AxiosResponse<ApiResponse> = await api.post(
    `/api/rooms/${roomID}/messages`,
    {
      message,
    },
  )

  const { data } = response.data

  return { messageID: data.id }
}
