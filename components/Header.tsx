'use client'

import Link from 'next/link'
import Logo from './Logo'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ModeToggle } from './ThemeToggle'
import { ReactNode } from 'react'
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'
import { DropdownMenuItem } from './ui/dropdown-menu'
import AuthButtons from './AuthButtons'
import { LayoutDashboard, LogIn, User } from 'lucide-react'
import { useStoreUser } from '@/hooks/useStoreUserEffect'
import { BounceLoader } from 'react-spinners'
import { Unauthenticated } from 'convex/react'
import { Authenticated } from 'convex/react'

function Header({ children }: { children: ReactNode }) {
  // ---
  const { isAuthenticated, isLoading } = useStoreUser()

  const path = usePathname()
  const t = useTranslations('header')

  if (path.includes('/editor')) return null // hide navbar in editor

  return (
    <header className="fixed w-full dark:bg-gray-800/60 bg-white/50 backdrop-blur-xl border-b z-50 text-nowrap flex items-start">
      <div
        className="max-w-6xl container mx-auto gap-8
      border-foreground/10 flex items-center justify-between p-4"
      >
        <Link href="/">
          <Logo />
        </Link>
        {path === '/' && (
          <div className="hidden md:flex space-x-8 pt-2">
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
          <Unauthenticated>
            <AuthButtons>
              <DropdownMenuItem className="rtl:flex-row-reverse">
                <LogIn />
                <SignInButton>
                  <p className="ltr:pt-1 rtl:pb-1">{t('signin')}</p>
                </SignInButton>
              </DropdownMenuItem>
              <DropdownMenuItem className="rtl:flex-row-reverse">
                <User />
                <SignUpButton>
                  <p className="ltr:pt-1 rtl:pb-0.5">{t('signup')}</p>
                </SignUpButton>
              </DropdownMenuItem>
            </AuthButtons>
          </Unauthenticated>
          {/* Show the user button when the user is signed in */}
          <Authenticated>
            <Link href="/dashboard">
              <Button variant="outline" className="items-center justify-center max-md:w-9">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:flex translate-y-0.5 rtl:translate-y-0 me-1.5">
                  {t('dashboard')}
                </span>
              </Button>
            </Link>
            <div className="ring-2 ring-foreground/20 rounded-full w-9 h-9">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-9 h-9',
                  },
                }}
              />
            </div>
          </Authenticated>
          {isLoading && <BounceLoader size={35} color="var(--color-foreground)" />}
        </div>
      </div>
    </header>
  )
}

export default Header
