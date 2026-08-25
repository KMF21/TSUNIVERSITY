import type { Metadata } from 'next'
import { Sora, Inter } from 'next/font/google'
import { MotionProvider } from '../components/motion/MotionProvider'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tsuniversity.edu.ng'),

  title: {
    default: 'Taraba State University, Jalingo',
    template: '%s | Taraba State University',
  },

  description:
    'The official website of Taraba State University, Jalingo. Explore academic programmes, admissions, faculties, departments, research, student services, university news and information about the University.',

  applicationName: 'Taraba State University',

  generator: 'Next.js',

  keywords: [
    'Taraba State University',
    'TSU',
    'Taraba State University Jalingo',
    'TSU Jalingo',
    'University in Taraba State',
    'Nigerian universities',
    'undergraduate programmes',
    'postgraduate programmes',
    'admissions',
    'academic programmes',
    'faculties',
    'departments',
    'research',
    'Jalingo',
    'Taraba State',
    'Nigeria',
  ],

  authors: [
    {
      name: 'Taraba State University',
    },
  ],

  creator: 'Taraba State University',
  publisher: 'Taraba State University',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://www.tsuniversity.edu.ng/',
    siteName: 'Taraba State University',
    title: 'Taraba State University, Jalingo',
    description:
      'Official website of Taraba State University, Jalingo. Explore academic programmes, admissions, research, university news, faculties, departments and student services.',
    images: [
      {
        url: '/assets/tsu_logo1.png',
        width: 1200,
        height: 630,
        alt: 'Taraba State University, Jalingo',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Taraba State University, Jalingo',
    description:
      'Official website of Taraba State University, Jalingo. Explore programmes, admissions, research, news and university information.',
    images: ['/assets/tsu_logo1.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },

  category: 'education',
}

// Bare root layout — deliberately has NO Header/Footer.
// Those live in (site)/layout.tsx instead, so /studio (a sibling
// of the (site) route group) never inherits them.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="font-body text-ink">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}