import type { Metadata } from 'next'
import { Sora, Inter } from 'next/font/google'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import './globals.css'

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Taraba State University | Harnessing Nature\'s Gift',
  description: 'Official website of Taraba State University, Jalingo.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="font-body text-ink">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
