'use client'

import { useTranslations } from 'next-intl'
import Logo from '../Logo'
import { usePathname } from 'next/navigation'

export default function FooterSection() {
  // ---
  const path = usePathname()
  const t = useTranslations('footer')

  if (path.includes('/editor')) return null // hide navbar in editor

  return (
    <footer className="bg-foreground/10 dark:bg-slate-950 text-foreground py-6 w-full px-4">
      <div className="max-w-5xl flex justify-between mx-auto">
        <Logo />
        <p className="text-md text-quaternary text-foreground z-50 pt-1.5">{t('copyright')}</p>
      </div>
    </footer>
  )
}
