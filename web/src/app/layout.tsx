import './globals.css'

import { MainContext } from '@/context/main-context'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Toaster } from './components/Toast/toaster'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'AMA | Ask me anything',
  description: 'Create a room and writer anything!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-zinc-950 text-zinc-50 antialiased`}
      >
        <MainContext>
          {children}
          <Toaster />
        </MainContext>
      </body>
    </html>
  )
}
