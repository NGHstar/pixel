import { useTranslations } from 'next-intl'
import { Button } from '../ui/button'
import { easeInOut, motion } from 'motion/react'

function PlansSection() {
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
          plan={t('starter')}
          price={t('starterPrice')}
          features={t.raw('starterFeatures') as string[]}
          buttonText={t('starterBtn')}
        />
        <PricingCard
          plan={t('pro')}
          price={t('proPrice')}
          features={t.raw('proFeatures') as string[]}
          featured={t('badge')}
          buttonText={t('proBtn')}
        />
      </motion.div>
    </section>
  )
}

interface PricingCardProps {
  plan: string
  price: string
  features: string[]
  featured?: string
  buttonText: string
}

const PricingCard = ({ plan, price, features, featured = '', buttonText }: PricingCardProps) => {
  return (
    <div
      className={`relative flex flex-col flex-1 justify-center backdrop-blur-lg 
        bg-foreground/5 border rounded-2xl pt-8 pb-6 px-7 max-w-96 min-w-72 transition-transform 
        hover:scale-105 ${featured !== '' ? 'bg-linear-210 from-blue-500/20 to-purple-600/20' : ''}`}
    >
      {featured !== '' && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r
         from-blue-500 to-purple-600 text-white px-5 ltr:pt-1.5 py-1 
         rounded-full text-sm font-bold"
        >
          {featured}
        </span>
      )}
      <h3 className="text-2xl font-bold mb-4">{plan}</h3>
      <p className="text-4xl font-extrabold text-cyan-400 mb-6">{price}</p>
      <ul className="space-y-2 mb-6 text-slate-600 dark:text-slate-400">
        {features.map((f, i) => (
          <li key={i}>• {f}</li>
        ))}
      </ul>
      <Button
        variant={`${featured !== '' ? 'primary' : 'outline'}`}
        disabled={featured === ''}
        className="w-full h-11 ltr:pt-1 text-md"
        size="lg"
      >
        {buttonText}
      </Button>
    </div>
  )
}

export default PlansSection
