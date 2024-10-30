'use client'

import { Share2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '.'
import { toast } from '../Toast/use-toast'

export function ShareButton() {
  const [copied, setCopied] = useState(false)

  function handleShareClick() {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(currentUrl)
          .then(() => {
            setCopied(true)
            toast({
              className: 'border-px',
              variant: 'default',
              duration: 1000,
              title: 'Copied!',
              description: 'The room URL was copied to your clipboard.',
            })
            setTimeout(() => setCopied(false), 2000)
          })
          .catch((error) => {
            console.error('Erro ao copiar a URL:', error)
          })
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = currentUrl
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        try {
          document.execCommand('copy')
          setCopied(true)
          toast({
            className: 'border-px',
            variant: 'default',
            duration: 2000,
            title: 'Copied!',
            description: 'The room URL was copied to your clipboard.',
          })
          setTimeout(() => setCopied(false), 2000)
        } catch (error) {
          console.error('Erro ao copiar a URL (fallback):', error)
        }
        document.body.removeChild(textArea)
      }
    }
  }

  return (
    <Button.Base variant="gray" handle={handleShareClick}>
      <span className="pr-2">{copied ? 'URL copied!' : 'Share'}</span>
      <Share2 className="size-4" />
    </Button.Base>
  )
}
