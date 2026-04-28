'use client'

import { easeOut, motion } from 'motion/react'
import { useTranslations } from 'next-intl'

function CanvasDemo() {
  const t = useTranslations('canvasDemo')
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.6, ease: easeOut }}
      className="relative z-10 max-w-4xl mx-auto"
      style={{ perspective: '1000px' }}
    >
      <div className="backdrop-blur-lg bg-foreground/5 z-100 hover:scale-105 ease-in-out duration-600  rounded-3xl p-2 transform-gpu">
        <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-2xl p-8 min-h-96">
          <div className="flex flex-row-reverse items-center justify-between mb-8">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-gray-400 text-sm">{t('title')}</div>
          </div>

          <div className="grid sm:grid-cols-4 grid-cols-2 gap-4 mb-6">
            {[
              { icon: '✂️', label: t('crop') },
              { icon: '📐', label: t('resize') },
              { icon: '🎨', label: t('adjust') },
              { icon: '🤖', label: t('aiTools') },
            ].map((tool, index) => (
              <div
                key={index}
                className="backdrop-blur-lg bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all cursor-pointer"
                title={tool.label}
              >
                <div className="text-2xl mb-1">{tool.icon}</div>
                <div className="text-xs text-gray-400">{tool.label}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full h-48 bg-linear-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl shadow-2xl shadow-blue-500/50 flex items-center justify-center">
              <div className="text-white font-bold">{t('canvasText')}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CanvasDemo
