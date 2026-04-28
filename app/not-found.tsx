'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

function NotFound() {
  const t = useTranslations('errors')
  const b = useTranslations('buttons')
  const router = useRouter()

  return (
    <div className="fixed min-h-full min-w-full flex flex-col items-center justify-center z-10 text-xl">
      <div className="flex items-center mb-16">
        <p className="font-bold text-xl">404</p>
        <div className="h-13 mx-6 w-0.5 -translate-y-1 bg-foreground/30" />
        <p className="font-light text-lg text-foreground/70 ltr:mt-1 rtl:mb-1">{t('404')}</p>
      </div>
      <Button variant="outline" onClick={() => router.push('/')}>
        <ArrowLeft className="rtl:rotate-180" />
        <p className="translate-y-0.5 me-2">{b('backToHome')}</p>
      </Button>
    </div>
  )
}

export default NotFound
