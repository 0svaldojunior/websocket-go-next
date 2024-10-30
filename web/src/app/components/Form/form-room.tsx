'use client'

import { createMessage } from '@/app/http/create-message'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../Button'
import { Input } from '../Input'
import { toast } from '../Toast/use-toast'

interface FromRoomProps {
  roomID: string
}

export function FormRoom({ roomID }: FromRoomProps) {
  const [questionName, setQuestionName] = useState<string>('')
  const router = useRouter()

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuestionName(event.target.value)
  }

  async function handleCreateRoom() {
    if (questionName.length <= 3 || !roomID) {
      toast({
        variant: 'destructive',
        title: 'Failed to create a question!',
        duration: 2500,
        description:
          'Failed to create a questions, because the question have length smeller than 3 or room id is invalid.',
      })
      return
    }

    try {
      const { messageID } = await createMessage({
        message: questionName,
        roomID,
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error:',
        description: `${error}`,
      })
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border-zinc-800 bg-zinc-900 p-2 ring-orange-400 ring-offset-2 ring-offset-zinc-950 focus-within:ring-1">
      <Input.Base
        type="text"
        placeholder="What your question?"
        handle={handleInputChange}
      />

      <Button.Base variant="default" handle={handleCreateRoom}>
        Make question
        <ArrowRight className="size-4" />
      </Button.Base>
    </div>
  )
}
