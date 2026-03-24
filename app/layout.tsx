import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from './ClientLayout'
import AOSInit from '@/components/AOSInit'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Drive With Bui - Professional Driving Lessons in Lidcombe, Sydney',
  description: 'Get your NSW driving license with confidence. Expert driving lessons for beginners, international students, and test preparation. Patient instructors, modern dual-control cars, affordable packages.',
  keywords: 'driving lessons Sydney, driving instructor Lidcombe, NSW driving test, learn to drive, international student driving lessons, driving test preparation',
  authors: [{ name: 'Drive With Bui' }],
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://drivewithbui.com',
    title: 'Drive With Bui - Professional Driving Lessons in Lidcombe, Sydney',
    description: 'Expert driving lessons for beginners, international students, and test preparation.',
    siteName: 'Drive With Bui',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drive With Bui - Professional Driving Lessons',
    description: 'Get your NSW driving license with confidence.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <AOSInit />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
