import { ChangeEvent, HTMLInputTypeAttribute } from 'react'

interface BaseInputProps {
  placeholder: string
  type: HTMLInputTypeAttribute
  handle: (event: ChangeEvent<HTMLInputElement>) => void
}

export function Base({ placeholder, type, handle }: BaseInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      autoComplete="off"
      onChange={handle}
      className="mx-2 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
    />
  )
}
