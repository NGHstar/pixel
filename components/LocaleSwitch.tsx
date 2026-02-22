'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Languages } from 'lucide-react'
import { Locale } from 'next-intl'

type props = {
  changeLocaleAction: (locale: Locale) => Promise<void>
}

export default function LocaleSwitch({ changeLocaleAction }: props) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Button variant="outline" size="icon">
          <Languages />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="rtl:flex-row-reverse pt-2"
          onClick={() => {
            changeLocaleAction('en' as Locale)
          }}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          className="rtl:flex-row-reverse"
          onClick={() => {
            changeLocaleAction('fa' as Locale)
          }}
        >
          فارسی
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
