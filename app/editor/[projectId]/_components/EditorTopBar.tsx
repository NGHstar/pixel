'use client'

import { Button } from '@/components/ui/button'
import UpgradeModal from '@/components/UpgradeModal'
import { useCanvas } from '@/context/canvas'
import { usePlanAccess } from '@/hooks/use-plan-access'
import { EditorTopSideBarTools } from '@/utils/tools'
import { ArrowLeft, Crop, Expand, Eye, Lock, Maximize2, Palette, Sliders, Text } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function EditorTopBar({ project }: { project: any }) {
  // ---
  const tools = EditorTopSideBarTools

  const router = useRouter()
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false)
  const [restrictedTool, setRestrictedTool] = useState<any>(null)

  const { activeTool, onToolChange, canvasEditor } = useCanvas()
  const { hasAccess, canExport, isFree } = usePlanAccess()

  const handleBackToDashboard = () => router.push('/dashboard')

  const handleToolChange = (toolId: any) => {
    if (!hasAccess(toolId)) {
      setRestrictedTool(toolId)
      setShowUpgradeModal(true)
      return
    }

    onToolChange(toolId)
  }

  return (
    <>
      <div className="border-b px-2 py-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="sm" className="pt-1.5" onClick={handleBackToDashboard}>
            <ArrowLeft className="h-4 w-4 mr-0.5 -translate-y-0.5" />
            All Projects
          </Button>

          <div className="font-extrabold capitalize">{project.title}</div>

          <div>Right Actions</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {tools.map(tool => {
              // ---
              const Icon = tool.icon
              const isActive = activeTool === tool.id
              const hasToolAccess = hasAccess(tool.id)
              return (
                <Button
                  key={tool.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={`pt-2 relative${isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                    
                    ${!hasToolAccess ? 'opacity-60' : ''}
                    `}
                  onClick={() => handleToolChange(tool.id)}
                >
                  <Icon className="h-4 w-4 -translate-0.75" />
                  {tool.label}
                  {tool.proOnly && !hasToolAccess && (
                    <Lock className="h-3 w-3 text-amber-600/70 dark:text-amber-400/70 -translate-0.75 ml-1" />
                  )}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => {
          setShowUpgradeModal(false)
          setRestrictedTool(null)
        }}
        restrictedTool={restrictedTool}
        reason=""
      />
    </>
  )
}

export default EditorTopBar
