'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCanvas } from '@/context/canvas'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { ResizeToolOptions } from '@/utils/tools'
import { useMutation } from 'convex/react'
import { useTranslations } from 'next-intl'
import { Expand, Loader, Lock, Monitor, Unlock } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

function ResizeTool({ project }: { project: Doc<'projects'> }) {
  const t = useTranslations('editor.tools.resize')
  const { canvasEditor, processingMessage, setProcessingMessage } = useCanvas()

  const [newWidth, setNewWidth] = useState<number>(project?.width || 800)
  const [newHeight, setNewHeight] = useState<number>(project?.height || 600)
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true)
  const [selectedPreset, setSelectedPreset] = useState<null | string>(null)

  const updateProject = useMutation(api.projects.updateProject)

  const handleApplyResize = async () => {
    // ---
    if (!canvasEditor || !project || (newWidth === project.width && newHeight === project.height)) return

    setProcessingMessage(t('processing.resizingCanvas'))

    try {
      canvasEditor.width = newWidth
      canvasEditor.height = newHeight

      canvasEditor.setDimensions(
        {
          width: newWidth,
          height: newHeight,
        },
        { backstoreOnly: false } // update both canvas layers
      )

      canvasEditor.calcOffset()
      canvasEditor.requestRenderAll()

      await updateProject({
        projectId: project._id,
        width: newWidth,
        height: newHeight,
        canvasState: canvasEditor.toJSON(),
      })
    } catch (error) {
      if (error instanceof Error) {
        console.log('error applying resize: ', error)
        toast.error(t('toast.errorApplyingResize', { message: error.message }))
      }
    } finally {
      setProcessingMessage('')
    }
  }

  const calcDimensions = (ratio: number[]) => {
    if (!project) return { width: 800, height: 600 }

    const [ratioW, ratioH] = ratio // example: instagram [9, 16]
    const originalArea = project.width * project.height

    const aspectRatio = ratioW / ratioH

    const newHeight = Math.sqrt(originalArea / aspectRatio)
    const newWidth = newHeight * aspectRatio

    return {
      width: Math.round(newWidth),
      height: Math.round(newHeight),
    }
  }

  const applyAspectRatio = (option: (typeof ResizeToolOptions)[0]) => {
    const dimensions = calcDimensions(option.ratio)
    setNewWidth(dimensions.width)
    setNewHeight(dimensions.height)
    setSelectedPreset(option.name)
  }

  if (!canvasEditor || !project)
    return (
      <div className="p-4 flex items-center justify-center gap-2">
        <Loader className="w-4 h-4 animate-spin -translate-y-0.75" />
        <p className="text-foreground/70 text-sm">{t('canvasNotReady')}</p>
      </div>
    )

  const hasChanges = newWidth !== project.width || newHeight !== project.height

  const handleWidthChange = (value: string) => {
    const width = parseInt(value) || 0
    setNewWidth(width)

    if (lockAspectRatio && project) {
      const ratio = project.height / project.width
      setNewHeight(Math.round(width * ratio))
    }

    setSelectedPreset(null)
  }

  const handleHeightChange = (value: string) => {
    const height = parseInt(value) || 0
    setNewHeight(height)

    if (lockAspectRatio && project) {
      const ratio = project.width / project.height
      setNewWidth(Math.round(height * ratio))
    }

    setSelectedPreset(null)
  }

  return (
    <div className="space-y-4">
      <div className="bg-foreground/10 rounded-lg p-3">
        <h4 className="text-sm font-medium mb-2">{t('currentSize')}</h4>
        <div className="text-xs text-foreground/70 rtl:text-right" dir="ltr">
          {project.width} x {project.height}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{t('customSize')}</h3>
          <Button variant="ghost" size="icon" onClick={() => setLockAspectRatio(!lockAspectRatio)}>
            {lockAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="projectWidth" className="text-xs text-foreground/70 mb-1 block">
              {t('width')}
            </label>
            <Input
              id="projectWidth"
              type="number"
              value={newWidth}
              onChange={e => handleWidthChange(e.target.value)}
              min="100"
              max="5000"
              className="bg-foreground/10 border-foreground/15 pt-2 text-foreground/80"
            />
          </div>
          <div>
            <label htmlFor="projectHeight" className="text-xs text-foreground/70 mb-1 block">
              {t('height')}
            </label>
            <Input
              id="projectHeight"
              type="number"
              value={newHeight}
              onChange={e => handleHeightChange(e.target.value)}
              min="100"
              max="5000"
              className="bg-foreground/10 border-foreground/15 pt-2 text-foreground/80"
            />
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-foreground/60">
              {lockAspectRatio ? t('aspectRatioLocked') : t('freeResizing')}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">{t('aspectRatios')}</h3>
        <div className="custom-scrollbar grid grid-cols-1 max-h-60 gap-2 overflow-y-auto ltr:pr-3 rtl:pl-3 pb-4">
          {ResizeToolOptions.map(option => {
            const dimensions = calcDimensions(option.ratio)
            return (
              <Button
                variant={selectedPreset === option.name ? 'ghost' : 'outline'}
                key={option.name}
                size="sm"
                className={`
                    justify-between h-auto py-2 duration-300 text-left ${
                      selectedPreset === option.name
                        ? 'bg-cyan-500 text-background hover:bg-cyan-500 border'
                        : ' '
                    }
                  `}
                onClick={() => applyAspectRatio(option)}
              >
                <div>
                  <div className="font-medium rtl:text-right">{t(option.nameKey)}</div>
                  <div className="text-xs opacity-70 rtl:text-right pt-1" dir="ltr">
                    {dimensions.width} x {dimensions.height} ({option.label})
                  </div>
                </div>
                <Monitor className="w-4 h-4" />
              </Button>
            )
          })}
        </div>
      </div>

      {hasChanges && (
        <div className="dark:bg-foreground/10 bg-foreground/5 rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2">{t('newSizePreview')}</h4>
          <div className="text-xs text-foreground/70">
            <div>{t('newCanvas', { width: newWidth, height: newHeight })}</div>
            <div className="dark:text-cyan-400 text-cyan-600">
              {newWidth > project.width || newHeight > project.height
                ? t('canvasExpanded')
                : t('canvasCropped')}
            </div>
            <div className="text-foreground/50 mt-1">{t('objectsMaintainPosition')}</div>
          </div>
        </div>
      )}

      <Button
        onClick={handleApplyResize}
        disabled={!hasChanges || processingMessage}
        className="w-full pt-3"
        variant="primary"
      >
        <Expand className="h-4 w-4 mr-0.5 -translate-y-0.5" />
        {t('applyResize')}
      </Button>

      <div className="bg-foreground/10 rounded-lg p-3">
        <p
          className="text-xs text-foreground/70 leading-6"
          dangerouslySetInnerHTML={{ __html: t('resizeDescription') }}
        />
      </div>
    </div>
  )
}

export default ResizeTool
