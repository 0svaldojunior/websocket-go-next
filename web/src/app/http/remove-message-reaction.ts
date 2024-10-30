import { api } from '@/lib/api'
import { AxiosResponse } from 'axios'

interface RemoveMessageReactionRequest {
  roomID: string
  messageID: string
}

type DataType = {
  react_count: number
}

type ApiResponse = {
  data: DataType
}

export async function removeMessageReaction({
  messageID,
  roomID,
}: RemoveMessageReactionRequest) {
  const response: AxiosResponse<ApiResponse> = await api.delete(
    `/api/rooms/${roomID}/messages/${messageID}/react`,
  )

  const { data } = response.data

  return { amountOfReactions: data.react_count }
}
