import { useTranslations } from 'next-intl'
import Logo from '../Logo'

export default function FooterSection() {
  const t = useTranslations('footer')

  return (
    <footer className="bg-foreground/10 dark:bg-slate-950 text-foreground py-6 w-full px-4">
      <div className="max-w-5xl flex justify-between mx-auto">
        <Logo />
        <p className="text-md text-quaternary text-foreground z-50 pt-1.5">{t('copyright')}</p>
      </div>
    </footer>
  )
}
