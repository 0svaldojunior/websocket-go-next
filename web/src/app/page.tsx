import Image from 'next/image'
import AmaLogo from '../assets/ama-logo.png'
import { Form } from './components/Form'

export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center px-4">
      <div className="flex max-w-[450px] flex-col gap-6">
        <Image alt="Ama Logo" src={AmaLogo} className="mx-auto h-10 w-10" />
        <p className="text-center leading-relaxed text-zinc-300">{`Create a public room of AMA (ask me anything) and priorize the important questions of community!`}</p>
        <Form.Home />
      </div>
    </main>
  )
}
