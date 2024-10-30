'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { queryClient } from '@/lib/react-query'

interface MainContextProps {
  children: ReactNode
}

export function MainContext({ children }: MainContextProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  )
}
