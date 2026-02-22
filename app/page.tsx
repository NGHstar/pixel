import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export default function Home() {
  // ---
  const t = useTranslations('homepage')

  return (
    <div
      className="flex container mx-auto items-center
    justify-start max-w-5xl w-full flex-col py-32"
    >
      <main className=" z-10">
        <h1 className="text-5xl font-extrabold mb-4">{t('title')}</h1>
        <p>{t('description')}</p>
        <div className="flex gap-4">
          <Button variant={'primary'}>test</Button>
        </div>
      </main>
    </div>
  )
}
