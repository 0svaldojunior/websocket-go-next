'use server'

import { api } from '@/lib/api'
import { AxiosResponse } from 'axios'

interface CreateRoomRequest {
  theme: string
}
type DataType = {
  id: string
}

type ApiResponse = {
  data: DataType
}

export async function createRoom({ theme }: CreateRoomRequest) {
  const response: AxiosResponse<ApiResponse> = await api.post('/api/rooms', {
    theme,
  })

  const { data } = response.data

  return { roomID: data.id }
}
