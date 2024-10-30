'use client'

import clsx from 'clsx'
import { ArrowRight } from 'lucide-react'
import { ReactNode } from 'react'

const baseClass =
  'mt-3 flex items-center gap-2 text-sm font-medium bg-transparent'

const variantMap = {
  like: 'text-orange-400 hover:text-orange-500',
  unlike: 'text-zinc-400 hover:text-zinc-300',
}

type LikeProps = {
  variant: keyof typeof variantMap
  handle?: () => void
  children?: ReactNode
}

export function LikeBase({ children, variant, handle }: LikeProps) {
  const buttonClass = clsx(baseClass, variantMap[variant])

  if (!children) {
    return (
      <button onClick={handle} className={buttonClass}>
        Make Room
        <ArrowRight className="size-4" />
      </button>
    )
  }

  return (
    <button onClick={handle} className={buttonClass}>
      {children}
    </button>
  )
}
