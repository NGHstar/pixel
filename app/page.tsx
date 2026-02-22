import LocaleSwitch from '@/components/LocaleSwitch'
import { ModeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Locale, useTranslations } from 'next-intl'
import { cookies } from 'next/headers'

export default function Home() {
  // ---
  const t = useTranslations('homepage')

  return (
    <div
      className="flex container mx-auto min-h-750 items-center
    justify-start max-w-5xl w-full flex-col py-32"
    >
      <main className=" z-10">
        <h1 className="text-5xl font-extrabold mb-4">{t('title')}</h1>
        <p>{t('description')}</p>
        <div className="flex gap-4">
          <Button variant={'primary'}>test</Button>
          <Button variant={'outline'}>test</Button>
          <ModeToggle />
        </div>
      </main>
    </div>
  )
}
