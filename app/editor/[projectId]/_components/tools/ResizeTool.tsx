'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCanvas } from '@/context/canvas'
import { api } from '@/convex/_generated/api'
import { ResizeToolOptions } from '@/utils/tools'
import { useMutation } from 'convex/react'
import { Expand, Loader, Lock, Monitor, Unlock } from 'lucide-react'
import { aspectRatio } from 'motion/react'
import { useEffect, useState } from 'react'

function ResizeTool({ project }) {
  const { canvasEditor, processingMessage, setProcessingMessage } = useCanvas()

  const [newWidth, setNewWidth] = useState<number>(project?.width || 800)
  const [newHeight, setNewHeight] = useState<number>(project?.height || 600)
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true)
  const [selectedPreset, setSelectedPreset] = useState<any>(null)

  const { updateProject, data, isLoading } = useMutation(api.projects.updateProject)

  if (data === null) return <div>loading...</div>

  const handleApplyResize = async () => {
    // ---
    if (!canvasEditor || !project || (newWidth === project.width && newHeight === project.height)) return

    setProcessingMessage('Resizing Canvas ...')

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
      console.log('error applying resize: ', error)
    } finally {
      setProcessingMessage('')
    }
  }

  const calcDimensions = (ratio: number[]) => {
    if (!project) return { width: project.width, height: project.height }

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
        <p className="text-foreground/70 text-sm">Canvas is not ready</p>
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
        <h4 className="text-sm font-medium mb-2">Current Size</h4>
        <div className="text-xs text-foreground/70">
          {project.width} x {project.height}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Custom Size</h3>
          <Button variant="ghost" size="icon" onClick={() => setLockAspectRatio(!lockAspectRatio)}>
            {lockAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="projectWidth" className="text-xs text-foreground/70 mb-1 block">
              Width
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
              Height
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
              {lockAspectRatio ? 'Aspect ratio is locked' : 'Free resizing'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Aspect Ratios</h3>
        <div className="custom-scrollbar grid grid-cols-1 max-h-60 gap-2 overflow-y-auto pr-3">
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
                  <div className="font-medium">{option.name}</div>
                  <div className="text-xs opacity-70">
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
          <h4 className="text-sm font-medium mb-2">New Size Preview</h4>
          <div className="text-xs text-foreground/70">
            <div>
              New Canvas: {newWidth} x {newHeight}
            </div>
            <div className="dark:text-cyan-400 text-cyan-600">
              {newWidth > project.width || newHeight > project.height
                ? 'Canvas will be expanded'
                : 'Canvas will be cropped'}
            </div>
            <div className="text-foreground/50 mt-1">
              Objects will maintain their current size and position
            </div>
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
        Apply Resize
      </Button>

      <div className="bg-foreground/10 rounded-lg p-3">
        <p className="text-xs text-foreground/70">
          <strong>Resize canvas: </strong>Changes canvas dimensions.
          <br />
          <strong>Aspect Ratios: </strong>Smart sizing based on your current canvas.
          <br />
          Objects maintain their size and position.
        </p>
      </div>
    </div>
  )
}

export default ResizeTool
