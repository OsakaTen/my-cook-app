// app/layout.tsx
import './globals.css'   // index.css 相当
import React from 'react'
import { ReactNode } from 'react'
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'My App',
  description: '食材管理・レシピ提案アプリ',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${inter.className}`}>
        {children}
      </body>
    </html>
  )
}

