'use client'

import clsx from 'clsx'
import { ArrowRight } from 'lucide-react'
import { ReactNode } from 'react'

const baseClass =
  'flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors'

const variantMap = {
  gray: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 ml-auto',
  default: 'bg-orange-400 text-orange-950 hover:bg-orange-500',
}

type ButtonProps = {
  variant?: keyof typeof variantMap
  handle: () => void
  children?: ReactNode
}

export function ButtonBase({
  children,
  variant = 'default',
  handle,
}: ButtonProps) {
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
