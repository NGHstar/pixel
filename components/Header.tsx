'use client'

import Link from 'next/link'
import Logo from './Logo'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ModeToggle } from './ThemeToggle'
import React, { ReactNode } from 'react'

function Header({ children }: { children: ReactNode }) {
  // ---
  const path = usePathname()
  const t = useTranslations('header')

  return (
    <header className="fixed w-full backdrop-blur-xl border-b z-50 text-nowrap flex items-start">
      <div
        className="max-w-5xl container mx-auto gap-8
      border-foreground/10 flex items-center justify-between p-4"
      >
        <Link href="/">
          <Logo />
        </Link>
        {path === '/' && (
          <div className="hidden md:flex space-x-6 pt-2">
            <Link href="#features" className="header__link">
              {t('features')}
            </Link>
            <Link href="#pricing" className="header__link">
              {t('pricing')}
            </Link>
            <Link href="#contact" className="header__link">
              {t('contact')}
            </Link>
          </div>
        )}
        <div className="flex gap-2">
          <ModeToggle />
          {children}
        </div>
      </div>
    </header>
  )
}

export default Header
