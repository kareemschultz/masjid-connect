import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { PwaInstallPrompt } from '@/components/pwa-install-prompt'
import { OfflineBadge } from '@/components/offline-badge'
import { ThemeProvider } from '@/components/theme-provider'
import { AppTourHost } from '@/components/app-tour-host'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MasjidConnect GY - Islamic Companion App',
  description: 'Linking Faith and Community. Prayer times, Quran reader, Hifz tracker, Tasbih, Qibla finder, and more for the Muslim community of Georgetown, Guyana.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MasjidConnect',
  },
  icons: {
    icon: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  },
  openGraph: {
    title: 'MasjidConnect GY',
    description: 'Your complete Islamic companion app for Georgetown, Guyana.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0b14' },
    { media: '(prefers-color-scheme: light)', color: '#10b981' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Amiri+Quran&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider />
        <OfflineBadge />
        <AppTourHost />
        {children}
        <PwaInstallPrompt />
      </body>
    </html>
  )
}
