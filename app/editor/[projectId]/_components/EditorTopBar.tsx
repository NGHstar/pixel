'use client'

import { Button } from '@/components/ui/button'
import UpgradeModal from '@/components/UpgradeModal'
import { useCanvas } from '@/context/canvas'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { usePlanAccess } from '@/hooks/use-plan-access'
import { EditorTopSideBarTools, EditorTopSideBarExportFormats } from '@/utils/tools'
import { ProTools, ToolKeys } from '@/utils/types'
import { useMutation, useQuery } from 'convex/react'
import { useTranslations } from 'next-intl'
import {
  ArrowLeft,
  ChevronDown,
  Download,
  FileImage,
  Loader2,
  Lock,
  RefreshCcw,
  RotateCcw,
  RotateCw,
  Save,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { FabricImage } from 'fabric'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function EditorTopBar({ project }: { project: Doc<'projects'> }) {
  const t = useTranslations('editor.topbar')
  const tools = EditorTopSideBarTools
  const exportFormats = EditorTopSideBarExportFormats

  // Undo/Redo state
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [isUndoRedoOperation, setIsUndoRedoOperation] = useState(false)

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isSavingRef = useRef(false)

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<string | null>(null)

  const user = useQuery(api.users.getCurrentUser)
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false)
  const [restrictedTool, setRestrictedTool] = useState<keyof ProTools | null | 'export'>(null)

  const { activeTool, onToolChange, canvasEditor } = useCanvas()
  const { hasAccess, canExport, isFree } = usePlanAccess()

  const handleBackToDashboard = () => router.push('/dashboard')

  const handleToolChange = (toolId: ToolKeys) => {
    if (!hasAccess(toolId)) {
      setRestrictedTool(toolId as keyof ProTools)
      setShowUpgradeModal(true)
      return
    }

    onToolChange(toolId)
  }

  const updateProject = useMutation(api.projects.updateProject)

  // تابع ذخیره در undo stack
  const saveToUndoStack = useCallback(() => {
    if (!canvasEditor || isUndoRedoOperation || isSavingRef.current) return

    try {
      isSavingRef.current = true
      const canvasState = JSON.stringify(canvasEditor.toJSON())

      setUndoStack(prev => {
        if (prev.length > 0 && prev[prev.length - 1] === canvasState) {
          return prev
        }

        const newStack = [...prev, canvasState]
        if (newStack.length > 30) {
          return newStack.slice(-30)
        }
        return newStack
      })

      setRedoStack([])
    } finally {
      isSavingRef.current = false
    }
  }, [canvasEditor, isUndoRedoOperation])

  // تابع با debounce
  const debouncedSaveToUndoStack = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToUndoStack()
    }, 300)
  }, [saveToUndoStack])

  // Setup undo/redo listeners
  useEffect(() => {
    if (!canvasEditor) return

    const initializeUndoStack = () => {
      if (canvasEditor && !isUndoRedoOperation) {
        const initialState = JSON.stringify(canvasEditor.toJSON())
        setUndoStack([initialState])
      }
    }

    const initTimeout = setTimeout(initializeUndoStack, 500)

    const handleCanvasModified = () => {
      if (!isUndoRedoOperation) {
        debouncedSaveToUndoStack()
      }
    }

    const events = [
      'object:modified',
      'object:added',
      'object:removed',
      'path:created',
      'mouse:up',
      'object:scaling',
      'object:rotating',
      'object:moving',
    ]

    events.forEach(event => {
      canvasEditor.on(event, handleCanvasModified)
    })

    const handleMouseUp = () => {
      if (!isUndoRedoOperation) {
        setTimeout(() => {
          saveToUndoStack()
        }, 100)
      }
    }

    canvasEditor.on('mouse:up', handleMouseUp)

    return () => {
      clearTimeout(initTimeout)
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      events.forEach(event => {
        canvasEditor.off(event, handleCanvasModified)
      })
      canvasEditor.off('mouse:up', handleMouseUp)
    }
  }, [canvasEditor, isUndoRedoOperation, debouncedSaveToUndoStack, saveToUndoStack])

  // تابع Undo
  const handleUndo = useCallback(async () => {
    if (!canvasEditor || undoStack.length <= 1 || isUndoRedoOperation) return

    setIsUndoRedoOperation(true)

    try {
      const currentState = JSON.stringify(canvasEditor.toJSON())
      const newUndoStack = [...undoStack]
      newUndoStack.pop()

      if (newUndoStack.length === 0) {
        toast.error(t('toast.noUndo'))
        return
      }

      const previousState = newUndoStack[newUndoStack.length - 1]

      await canvasEditor.loadFromJSON(JSON.parse(previousState))
      canvasEditor.requestRenderAll()

      setUndoStack(newUndoStack)
      setRedoStack(prev => [...prev, currentState])

      await updateProject({
        projectId: project._id,
        canvasState: canvasEditor.toJSON(),
      })

      toast.success(t('toast.undoSuccess'))
    } catch (error) {
      console.error('Error during undo:', error)
      toast.error(t('toast.undoFail'))
    } finally {
      setTimeout(() => setIsUndoRedoOperation(false), 150)
    }
  }, [canvasEditor, undoStack, isUndoRedoOperation, updateProject, project._id, t])

  // تابع Redo
  const handleRedo = useCallback(async () => {
    if (!canvasEditor || redoStack.length === 0 || isUndoRedoOperation) return

    setIsUndoRedoOperation(true)

    try {
      const newRedoStack = [...redoStack]
      const nextState = newRedoStack.pop()

      if (!nextState) {
        toast.error(t('toast.noRedo'))
        return
      }

      const currentState = JSON.stringify(canvasEditor.toJSON())
      setUndoStack(prev => [...prev, currentState])

      await canvasEditor.loadFromJSON(JSON.parse(nextState))
      canvasEditor.requestRenderAll()

      setRedoStack(newRedoStack)

      await updateProject({
        projectId: project._id,
        canvasState: canvasEditor.toJSON(),
      })

      toast.success(t('toast.redoSuccess'))
    } catch (error) {
      console.error('Error during redo:', error)
      toast.error(t('toast.redoFail'))
    } finally {
      setTimeout(() => setIsUndoRedoOperation(false), 150)
    }
  }, [canvasEditor, redoStack, isUndoRedoOperation, updateProject, project._id, t])

  const canUndo = undoStack.length > 1
  const canRedo = redoStack.length > 0

  // تابع Reset
  const handleResetToOriginal = async () => {
    if (!canvasEditor || !project || !project.originalImageUrl) {
      toast.error(t('toast.originalImageNotFound'))
      return
    }

    setIsLoading(true)

    try {
      canvasEditor.clear()
      canvasEditor.backgroundColor = '#FFF'
      canvasEditor.backgroundImage = null

      const fabricImage = await FabricImage.fromURL(project.originalImageUrl, { crossOrigin: 'anonymous' })

      canvasEditor.setDimensions({
        width: fabricImage.width,
        height: fabricImage.height,
      })

      fabricImage.set({
        left: project.width / 2,
        top: project.height / 2,
        originX: 'center',
        originY: 'center',
        selectable: true,
        evented: true,
      })

      fabricImage.filters = []

      canvasEditor.add(fabricImage)
      canvasEditor.centerObject(fabricImage)
      canvasEditor.setActiveObject(fabricImage)
      canvasEditor.requestRenderAll()

      await updateProject({
        projectId: project._id,
        canvasState: canvasEditor.toJSON(),
        currentImageUrl: project.originalImageUrl,
        activeTransformations: undefined,
        backgroundRemoved: false,
      })

      toast.success(t('toast.resetSuccess'))
    } catch (error) {
      console.log('error resetting canvas: ', error)
      toast.error(t('toast.resetFail'))
    } finally {
      setIsLoading(false)
    }
  }

  // تابع Save
  const handleManualSave = async () => {
    setIsLoading(true)
    try {
      await updateProject({
        projectId: project._id,
        canvasState: canvasEditor.toJSON(),
      })
      toast.success(t('toast.saveSuccess'))
    } catch (error) {
      console.log('error saving project', error)
      toast.error(t('toast.saveFail'))
    } finally {
      setIsLoading(false)
    }
  }

  // تابع Export
  const handleExport = async (config: (typeof exportFormats)[0]) => {
    if (!canvasEditor || !project) {
      toast.error(t('toast.exportNotReady'))
      return
    }

    if (!canExport(user?.exportsThisMonth || 0)) {
      setRestrictedTool('export')
      setShowUpgradeModal(true)
      return
    }

    setIsExporting(true)
    setExportFormat(config.format)

    try {
      const currentZoom = canvasEditor.getZoom()
      const currentViewportTransform = [...canvasEditor.viewportTransform]

      canvasEditor.setZoom(1)
      canvasEditor.setViewportTransform([1, 0, 0, 1, 0, 0])
      canvasEditor.setDimensions({
        width: project.width,
        height: project.height,
      })
      canvasEditor.requestRenderAll()

      const dataURL = canvasEditor.toDataURL({
        format: config.format.toLowerCase(),
        quality: config.quality,
        multiplier: 1,
      })

      canvasEditor.setZoom(currentZoom)
      canvasEditor.setViewportTransform(currentViewportTransform)
      canvasEditor.setDimensions({
        width: project.width * currentZoom,
        height: project.height * currentZoom,
      })
      canvasEditor.requestRenderAll()

      const link = document.createElement('a')
      link.download = `${project.title}.${config.extension}`
      link.href = dataURL
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success(t('toast.exportSuccess', { format: config.format }))
    } catch (error) {
      console.error('Error exporting image:', error)
      toast.error(t('toast.exportFail'))
    } finally {
      setIsExporting(false)
      setExportFormat(null)
    }
  }

  return (
    <>
      <div className="border-b px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="sm" className="pt-1.5" onClick={handleBackToDashboard}>
            <ArrowLeft className="h-4 w-4 mr-0.5 -translate-y-0.5" />
            {t('allProjects')}
          </Button>
          <div className="font-extrabold capitalize">{project.title}</div>

          <div className="flex items-center gap-3">
            {/* Right side controls */}
            <div className="flex items-center gap-4">
              {/* Undo/Redo */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-white ${!canUndo ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700'}`}
                  onClick={handleUndo}
                  disabled={!canUndo || isUndoRedoOperation}
                  title={`Undo (${undoStack.length - 1} actions available)`}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-white ${!canRedo ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700'}`}
                  onClick={handleRedo}
                  disabled={!canRedo || isUndoRedoOperation}
                  title={t('redoTitle', { count: redoStack.length })}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Reset Button */}
            <Button
              variant="outline"
              size="sm"
              className="ltr:pt-1 pr-4!"
              onClick={handleResetToOriginal}
              disabled={!project.originalImageUrl || isLoading}
            >
              <RefreshCcw className="w-4 h-4 -translate-y-0.5" />
              {t('reset')}
            </Button>

            {/* Save Button */}
            <Button
              variant="primary"
              className="ltr:pt-1 pr-4!"
              size="sm"
              onClick={handleManualSave}
              disabled={!canvasEditor || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 -translate-y-0.5 animate-spin" />
                  {t('saving')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 -translate-y-0.5" />
                  {t('save')}
                </>
              )}
            </Button>

            {/* Export Button */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="glass"
                  size="sm"
                  disabled={isExporting || !canvasEditor}
                  className="gap-2 ltr:pt-1"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 -translate-y-0.5" />
                      {t('export')}
                      <ChevronDown className="w-4 h-4 -translate-y-px" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-slate-800 border-b-slate-700">
                <DropdownMenuLabel className="px-3 py-2 text-sm text-foreground">
                  {t('exportMenu.resolution', { width: project.width, height: project.height })}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {exportFormats.map((config, index) => (
                  <DropdownMenuItem
                    className="text-foreground hover:bg-slate-700! cursor-pointer flex items-center gap-2"
                    key={index}
                    onClick={() => handleExport(config)}
                  >
                    <FileImage className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="font-medium">{config.label}</div>
                      <div className="text-xs text-foreground/70">
                        {t('exportMenu.format', {
                          format: config.format,
                          quality: Math.round(config.quality * 100),
                        })}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}

                {isFree && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="px-3 py-2 text-xs text-foreground/50">
                      {t('exportMenu.freePlan', { count: user?.exportsThisMonth || 0 })}
                      {(user?.exportsThisMonth || 0) >= 20 && (
                        <div className="text-amber-400 mt-1">{t('exportMenu.upgradeToPro')}</div>
                      )}
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tools Section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {tools.map(tool => {
              const Icon = tool.icon
              const isActive = activeTool === tool.id
              const hasToolAccess = hasAccess(tool.id)
              return (
                <Button
                  key={tool.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={`ltr:pt-1 relative ${isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                    ${!hasToolAccess ? 'opacity-60' : ''}`}
                  onClick={() => handleToolChange(tool.id)}
                >
                  <Icon className="h-4 w-4 ltr:-translate-y-0.5 ltr:-translate-x-px" />
                  <span className="-translate-px rtl:translate-y-px">{t(tool.labelKey)}</span>
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
