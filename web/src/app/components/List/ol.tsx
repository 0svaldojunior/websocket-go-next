import { ReactNode } from 'react'

interface OLProps {
  children: ReactNode
}

export function OL({ children }: OLProps) {
  return (
    <ol className="list-outside list-decimal space-y-8 px-3">{children}</ol>
  )
}
