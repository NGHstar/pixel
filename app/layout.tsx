import { Vazirmatn } from 'next/font/google'
import './globals.css'
import { Locale, NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import FloatingShapes from '@/components/FloatingShapes'
import Header from '@/components/Header'
import LocaleSwitch from '@/components/LocaleSwitch'
import { cookies } from 'next/headers'
import { ConvexClientProvider } from './ConvexClientProvider'

const vazir = Vazirmatn({
  variable: '--font-vazirmatn',
  subsets: ['arabic'],
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const dir = locale === 'fa' ? 'rtl' : 'ltr'

  async function changeLocaleAction(locale: Locale) {
    'use server'
    const store = await cookies()
    store.set('locale', locale)
  }

  return (
    <html lang={locale} dir={dir} suppressContentEditableWarning>
      <body className={`${vazir.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ConvexClientProvider>
            <NextIntlClientProvider>
              <Header>
                <LocaleSwitch changeLocaleAction={changeLocaleAction} />
              </Header>
              <main className="dark:bg-slate-900 px-4">
                <FloatingShapes />
                <Toaster richColors />
                {children}
              </main>
            </NextIntlClientProvider>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
