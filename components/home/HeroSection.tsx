'use client'

import { easeOut, motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { buttonVariants } from '../ui/button'
import Link from 'next/link'

const HeroSection = () => {
  const t = useTranslations('hero')
  return (
    <section
      id="home"
      className="relative z-10 pt-40 pb-30 flex items-center justify-center text-center px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: easeOut }}
        className="space-y-8"
      >
        <h1 className="text-4xl md:text-6xl leading-relaxed font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 -translate-y-6 max-w-2xl mx-auto">{t('subtitle')}</p>
        <Link
          href={'/dashboard'}
          className={buttonVariants({
            variant: 'primary',
            size: 'xl',
            className: 'ltr:pt-1 rtl:pt-0.5 hover:scale-110 active:scale-95 duration-300 ease-out',
          })}
        >
          {t('button')}
        </Link>
      </motion.div>
    </section>
  )
}

export default HeroSection
