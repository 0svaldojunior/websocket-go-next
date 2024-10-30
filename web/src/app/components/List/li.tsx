'use client'

import { createMessageReaction } from '@/app/http/create-message-reaction'
import { removeMessageReaction } from '@/app/http/remove-message-reaction'
import clsx from 'clsx'
import { ArrowUp } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../Button'
import { toast } from '../Toast/use-toast'

const baseClass = 'ml-4 leading-relaxed text-zinc-100'

const answeredMap = new Map<boolean, string>([
  [true, 'opacity-50 pointer-events-none'],
  [false, 'opacity-100'],
])

type LiProps = {
  roomID: string
  messageID: string
  text: string
  amountOfReactions: number
  answered?: boolean
}

export function LI({
  messageID,
  roomID,
  amountOfReactions,
  text,
  answered = false,
}: LiProps) {
  const [hasReacted, setHasReacted] = useState(false)

  async function handleReactToMessage() {
    if (!roomID || !messageID) {
      return
    }

    try {
      setHasReacted(!hasReacted)

      hasReacted && (await removeMessageReaction({ messageID, roomID }))
      !hasReacted && (await createMessageReaction({ messageID, roomID }))
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed!',
        description: 'Failed to react question.',
      })
    }
  }

  const liClass = clsx(baseClass, answeredMap.get(answered))

  return (
    <li className={liClass}>
      {text}
      <Button.Like
        handle={handleReactToMessage}
        variant={hasReacted ? 'like' : 'unlike'}
      >
        <ArrowUp className="size-4" />
        Like Question ({amountOfReactions})
      </Button.Like>
    </li>
  )
}
