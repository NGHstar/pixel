'use client'

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { Plus, Sparkles } from 'lucide-react'
import { useState } from 'react'
import NewProjectModal from './_components/NewProjectModal'
import ProjectsGrid from './_components/ProjectsGrid'

function Dashboard() {
  // ---
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)

  const data = useQuery(api.projects.getUserProjects)

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-6">
        <NewProjectModal isOpen={showNewProjectModal} onClose={() => setShowNewProjectModal(false)} />
        <header className="flex items-center justify-between mb-8">
          <div>
            {
              // todo: translation
            }
            <h1 className="text-4xl font-bold text-white mb-2">Your Projects</h1>
            <p className="text-white/70">Create and manage your AI-powered image designs</p>
          </div>
          <Button variant="primary" className="ltr:pt-3" onClick={() => setShowNewProjectModal(true)}>
            <Plus className="w-5 h-5 ltr:-translate-y-0.5" />
            New Project
          </Button>
        </header>
        <main>
          {data === undefined ? (
            <div>Loading...</div>
          ) : data instanceof Error ? (
            <div>Error: {data.message}</div>
          ) : data === null ? (
            <div className="flex flex-col py-20 items-center justify-center">
              <h3 className="text-2xl font-semibold text-white mb-3">Create Your First Project</h3>
              <p className="text-white/70 mb-8 max-w-md">
                Upload an image to start editing with our powerful AI tools
              </p>
              <Button
                onClick={() => setShowNewProjectModal(true)}
                variant="primary"
                size="xl"
                className="ltr:pt-1 pl-8 pr-9 text-xl"
              >
                <Sparkles className="ltr:-translate-y-0.5" />
                Start Creating
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
