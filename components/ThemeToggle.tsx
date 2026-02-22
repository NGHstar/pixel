'use client'

import * as React from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslations } from 'next-intl'

export function ModeToggle() {
  const { setTheme } = useTheme()
  const t = useTranslations('themes')

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="rtl:flex-row-reverse" onClick={() => setTheme('light')}>
          <Sun /> <p className="ltr:pt-1 rtl:pt-0.5">{t('light')}</p>
        </DropdownMenuItem>
        <DropdownMenuItem className="rtl:flex-row-reverse" onClick={() => setTheme('dark')}>
          <Moon /> <p className="ltr:pt-1 rtl:pt-0.5">{t('dark')}</p>
        </DropdownMenuItem>
        <DropdownMenuItem className="rtl:flex-row-reverse" onClick={() => setTheme('system')}>
          <Monitor /> <p className="ltr:pt-1 rtl:pt-0.5">{t('system')}</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
