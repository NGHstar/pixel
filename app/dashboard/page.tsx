'use client'

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { Plus, Sparkles } from 'lucide-react'
import { useState } from 'react'
import NewProjectModal from './_components/NewProjectModal'
import ProjectsGrid from './_components/ProjectsGrid'
import { useTranslations } from 'next-intl'

function Dashboard() {
  // ---
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)

  const data = useQuery(api.projects.getUserProjects)

  const t = useTranslations('dashboard')

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-6">
        <NewProjectModal isOpen={showNewProjectModal} onClose={() => setShowNewProjectModal(false)} />
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{t('your-projects')}</h1>
            <p className="text-white/70">{t('your-projects-desc')}</p>
          </div>
          <Button
            variant="primary"
            className="ltr:pt-3 pr-4.5! pl-4! rtl:pl-3!"
            onClick={() => setShowNewProjectModal(true)}
          >
            <span className="ltr:-translate-y-px">{t('new-project')}</span>
            <Plus className="w-5 h-5 ltr:-translate-y-px" />
          </Button>
        </header>
        <main>
          {data === undefined ? (
            <div>Loading...</div>
          ) : data instanceof Error ? (
            <div>Error: {data.message}</div>
          ) : data === null || data.length === 0 ? (
            <div className="flex flex-col py-20 items-center justify-center border bg-white/2">
              <span className="text-5xl mb-4">✨</span>
              <h3 className="text-2xl font-semibold text-white mb-3">{t('noProjects.label')}</h3>
              <p className="text-white/70 mb-8 max-w-md text-center">{t('noProjects.description')}</p>
              <Button
                onClick={() => setShowNewProjectModal(true)}
                variant="primary"
                size="xl"
                className="ltr:pt-1.5 rtl:pt-0.5 text-xl rtl:text-lg"
              >
                <Sparkles className="ltr:-translate-y-0.5" />
                {t('noProjects.buttonText')}
              </Button>
            </div>
          ) : (
            <ProjectsGrid projects={data} />
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard
