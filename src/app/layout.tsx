import type { Metadata } from 'next'
import { Sora, Inter } from 'next/font/google'
import { MotionProvider } from '../components/motion/MotionProvider'
import './globals.css'

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Taraba State University | Harnessing Nature\'s Gift',
  description: 'Official website of Taraba State University, Jalingo.',
}

// Bare root layout — deliberately has NO Header/Footer. Those live in
// (site)/layout.tsx instead, so /studio (a sibling of the (site) route
// group, not inside it) never inherits them.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="font-body text-ink">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}