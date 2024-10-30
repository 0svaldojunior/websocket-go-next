'use client'

import { createRoom } from '@/app/http/create-room'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../Button'
import { Input } from '../Input'
import { toast } from '../Toast/use-toast'

export function FormHome() {
  const [roomName, setRoomName] = useState<string>('')
  const router = useRouter()

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setRoomName(event.target.value)
  }

  async function handleCreateRoom() {
    if (roomName === '') {
      return
    }

    try {
      const response = await createRoom({ theme: roomName })
      const { roomID } = response

      router.push(`/room/${roomID}`)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to make room!',
        description: `Something went wrong: ${error}`,
      })
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border-zinc-800 bg-zinc-900 p-2 ring-orange-400 ring-offset-2 ring-offset-zinc-950 focus-within:ring-1">
      <Input.Base
        type="text"
        placeholder="Name room"
        handle={handleInputChange}
      />

      <Button.Base variant="default" handle={handleCreateRoom} />
    </div>
  )
}
