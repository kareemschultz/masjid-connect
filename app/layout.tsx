import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MasjidConnect GY',
  description: 'Linking Faith and Community - Islamic companion app for Georgetown, Guyana',
  manifest: '/manifest.json',
  icons: {
    icon: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0b14',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#0a0b14]">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geistSans.className} antialiased bg-[#0a0b14] text-[#f9fafb]`}>
        {children}
      </body>
    </html>
  )
}
