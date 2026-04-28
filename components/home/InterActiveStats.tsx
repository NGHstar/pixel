'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate, easeOut } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'

const StatItem = ({
  to,
  prefix = '+',
  suffix = '',
  duration = 2,
}: {
  to: number
  prefix?: string
  suffix?: string
  duration?: number
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px 0px' })

  const count = useMotionValue(0)

  const locale = useLocale()

  const rounded = useTransform(count, latest => new Intl.NumberFormat(locale).format(Math.floor(latest)))

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, {
        duration,
        ease: easeOut,
      })
      return () => controls.stop()
    }
  }, [isInView, count, to, duration])

  return (
    <div ref={ref}>
      <motion.span className="stat">
        {prefix}
        <motion.span>{rounded}</motion.span>
        {suffix}
      </motion.span>
    </div>
  )
}

const InteractiveStats = () => {
  const t = useTranslations('stats')

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true, amount: 1 }}
      className="py-20 text-center"
    >
      <div className="flex flex-col md:flex-row justify-center gap-12">
        <div>
          <StatItem to={10000} />
          <p className="text-foreground/50 dark:text-slate-400">{t('images')}</p>
        </div>

        <div>
          <StatItem to={500} />
          <p className="text-foreground/50 dark:text-slate-400">{t('users')}</p>
        </div>

        <div>
          <StatItem to={45000} />
          <p className="text-foreground/50 dark:text-slate-400">{t('ai')}</p>
        </div>

        <div>
          <StatItem to={98} prefix="" suffix="%" />
          <p className="text-foreground/50 dark:text-slate-400">{t('userSatisfy')}</p>
        </div>
      </div>
    </motion.section>
  )
}

export default InteractiveStats
