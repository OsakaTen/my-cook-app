// app/layout.tsx
import './globals.css'   // index.css 相当
import React from 'react'
import { ReactNode } from 'react'


export const metadata = {
  title: 'My App',
  description: 'Next.js App',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  )
}

