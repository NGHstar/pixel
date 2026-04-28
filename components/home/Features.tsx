import { easeInOut, motion } from 'motion/react'
import { useTranslations } from 'next-intl'

type props = {
  icon: string
  title: string
  description: string
}

// Feature Card Component
const FeatureCard = ({ icon, title, description }: props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ rotateZ: -3, scale: 1.1 }}
      transition={{
        opacity: { duration: 0.8, ease: easeInOut },
        y: { duration: 0.8, ease: easeInOut },
        rotateZ: { duration: 0.15, ease: easeInOut },
        scale: { duration: 0.15, ease: easeInOut },
      }}
      viewport={{ once: true, amount: 0.6 }}
      className="backdrop-blur-lg bg-foreground/5 border
       border-foreground/10 rounded-2xl p-8 cursor-pointer"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  )
}

// Features Section Component
const FeaturesSection = () => {
  // ---
  const features: props[] = useTranslations().raw('features')
  const t = useTranslations('featuresHeader')

  return (
    <section className="py-20" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: easeInOut }}
          viewport={{ once: true, amount: 0.6 }}
        >
          <h2 className="text-3xl sm:text-5xl font-bold bg-linear-to-r from-foreground leading-relaxed to-blue-500 bg-clip-text text-transparent mb-2">
            {t('title')}
          </h2>
          <p className="sm:text-xl text-sm text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
