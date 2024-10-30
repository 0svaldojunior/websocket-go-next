import { Button } from '@/app/components/Button'
import { Form } from '@/app/components/Form'
import { Messages } from '@/app/components/messages'
import AmaLogo from '@/assets/ama-logo.png'
import Image from 'next/image'
import { Suspense } from 'react'

interface RoomPageProps {
  params: Promise<{
    roomID: string
  }>
}

export default async function Room(props: RoomPageProps) {
  const { roomID } = await props.params

  return (
    <div className="mx-auto flex max-w-screen-sm flex-col gap-6 px-4 py-10">
      <div className="flex items-center gap-3 px-3">
        <Image alt="AMA Logo" src={AmaLogo} className="h-5 w-5" />
        <span className="truncate text-sm text-zinc-500">
          Room Code:
          <span className="text-zinc-300">{roomID}</span>
        </span>

        <Button.Share />
      </div>

      <div className="h-px w-full bg-zinc-900" />

      <Form.Room roomID={roomID} />

      <Suspense fallback={<p>Loading...</p>}>
        <Messages roomID={roomID} />
      </Suspense>
    </div>
  )
}
