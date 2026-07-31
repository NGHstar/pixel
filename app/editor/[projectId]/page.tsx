'use client'

import { CanvasContext } from '@/context/canvas'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { Monitor } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { RingLoader } from 'react-spinners'
import CanvasEditor from './_components/Canvas'
import EditorTopBar from './_components/EditorTopBar'
import { Id } from '@/convex/_generated/dataModel'
import { Canvas } from 'fabric'
import EditorSidebar from './_components/EditorSidebar'

function Editor() {
  const t = useTranslations('editor')
  const { projectId } = useParams<{ projectId: Id<'projects'> }>()

  const [canvasEditor, setCanvasEditor] = useState<null | Canvas>(null)
  const [processingMessage, setProcessingMessage] = useState('')
  const [activeTool, setActiveTool] = useState<string | null>('resize')

  const project = useQuery(api.projects.getProject, { projectId })

  return (
    <CanvasContext.Provider
      value={{
        canvasEditor,
        setCanvasEditor,
        activeTool,
        onToolChange: setActiveTool,
        processingMessage,
        setProcessingMessage,
      }}
    >
      <div className="lg:hidden min-h-screen flex justify-center items-center p-6">
        <div className="text-center max-w-md">
          <Monitor className="w-16 h-16 text-cyan-500/80 dark:text-cyan-400/80 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4 text-foreground/90">{t('desktopRequiredTitle')}</h2>
          <p className="text-lg mb-2 text-foreground/70">{t('desktopRequiredDescription')}</p>
          <p className="text-sm text-foreground/60">{t('desktopRequiredHint')}</p>
        </div>
      </div>

      <div className="hidden lg:block min-h-screen">
        {project === undefined ? (
          <div className="fixed inset-0 flex flex-col gap-5 items-center text-muted-foreground justify-center">
            <RingLoader color="var(--color-foreground)" />
            {t('loadingCanvas')}
          </div>
        ) : project instanceof Error ? (
          <div>
            {t('loadError')}: {project.message}
          </div>
        ) : project === null ? (
          <div className="flex flex-col py-20 items-center justify-center">{t('nullState')}</div>
        ) : (
          <div>
            {/* ai process loading */}
            {processingMessage && (
              <div className="fixed inset-0 bg-background/20 backdrop-blur-xl z-50 flex items-center justify-center">
                <div className="rounded-lg p-6 flex flex-col items-center gap-4">
                  <RingLoader color="var(--color-foreground)" />
                  <div className="text-center">
                    <p className="font-medium">{processingMessage}</p>
                    <p className="text-sm text-foreground/70 mt-1">{t('processingHint')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* top bar */}
            <EditorTopBar project={project} />

            {/* side-bar & canvas */}
            <div className="flex flex-1 overflow-hidden">
              {/* side bar */}
              <EditorSidebar project={project} />
              {/* canvas */}
              <div className="min-h-screen flex-1 bg-slate-800">
                <CanvasEditor project={project} />
              </div>
            </div>
          </div>
        )}
      </div>
    </CanvasContext.Provider>
  )
}

export default Editor
