import { useTranslations } from 'next-intl'
import { easeInOut, motion } from 'motion/react'
import PricingCard from '../PricingCard'

function PlansSection() {
  // ---
  const t = useTranslations('plans')

  return (
    <section id="pricing" className="relative z-10 pt-16 pb-32 px-1.5 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: easeInOut }}
        viewport={{ once: true, amount: 1 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-12"
      >
        {t('title')}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: easeInOut }}
        viewport={{ once: true, amount: 0.5 }}
        className="flex flex-wrap justify-center gap-8"
      >
        <PricingCard
          planName="free_user"
          planId="free_user"
          plan={t('starter')}
          price={t('starterPrice')}
          features={t.raw('starterFeatures') as string[]}
          buttonText={t('starterBtn')}
          currentPlanText={t('current')}
        />
        <PricingCard
          planName="pro"
          planId="cplan_3Ec8E9By5uWOu6MdTkbLdDBx4u7"
          plan={t('pro')}
          price={t('proPrice')}
          features={t.raw('proFeatures') as string[]}
          featured={t('badge')}
          buttonText={t('proBtn')}
          currentPlanText={t('current')}
        />
      </motion.div>
    </section>
  )
}

export default PlansSection
