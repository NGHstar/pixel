'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Wand2, Info, Sparkles, User, Mountain, CheckCircle, AlertTriangle, Camera } from 'lucide-react'
import { FabricImage } from 'fabric'
import { api } from '@/convex/_generated/api'
import { useCanvas } from '@/context/canvas'
import { Doc } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { useTranslations } from 'next-intl'

const RETOUCH_PRESETS = [
  {
    key: 'ai_retouch',
    labelKey: 'presets.ai_retouch.label',
    descriptionKey: 'presets.ai_retouch.description',
    icon: Sparkles,
    transform: 'e-retouch',
    recommended: true,
  },
  {
    key: 'ai_upscale',
    labelKey: 'presets.ai_upscale.label',
    descriptionKey: 'presets.ai_upscale.description',
    icon: User,
    transform: 'e-upscale',
    recommended: false,
  },
  {
    key: 'enhance_sharpen',
    labelKey: 'presets.enhance_sharpen.label',
    descriptionKey: 'presets.enhance_sharpen.description',
    icon: Mountain,
    transform: 'e-retouch,e-contrast,e-sharpen',
    recommended: false,
  },
  {
    key: 'premium_quality',
    labelKey: 'presets.premium_quality.label',
    descriptionKey: 'presets.premium_quality.description',
    icon: Camera,
    transform: 'e-retouch,e-upscale,e-contrast,e-sharpen',
    recommended: false,
  },
]

function AiEditTool({ project }: { project: Doc<'projects'> }) {
  const t = useTranslations('editor.ai_edit')
  const { canvasEditor, setProcessingMessage } = useCanvas()
  const [selectedPreset, setSelectedPreset] = useState('ai_retouch') // Fixed default
  const updateProject = useMutation(api.projects.updateProject)

  const getMainImage = () => canvasEditor?.getObjects().find(obj => obj.type === 'image') || null

  const buildRetouchUrl = (imageUrl, presetKey) => {
    const preset = RETOUCH_PRESETS.find(p => p.key === presetKey)
    if (!imageUrl || !preset) return imageUrl

    const [baseUrl, existingQuery] = imageUrl.split('?')

    if (existingQuery) {
      const params = new URLSearchParams(existingQuery)
      const existingTr = params.get('tr')

      if (existingTr) {
        // Append retouch to existing transformations
        return `${baseUrl}?tr=${existingTr},${preset.transform}`
      }
    }

    // No existing transformations, create new
    return `${baseUrl}?tr=${preset.transform}`
  }

  const applyRetouch = async () => {
    const mainImage = getMainImage()
    const selectedPresetData = RETOUCH_PRESETS.find(p => p.key === selectedPreset)

    if (!mainImage || !project || !selectedPresetData) return

    setProcessingMessage(t('processing.enhancingWithPreset', { preset: t(selectedPresetData.labelKey) }))

    try {
      const currentImageUrl = mainImage.getSrc?.() || mainImage._element?.src || mainImage.src
      const retouchedUrl = buildRetouchUrl(currentImageUrl, selectedPreset)

      const retouchedImage = await FabricImage.fromURL(retouchedUrl, {
        crossOrigin: 'anonymous',
      })

      // Preserve current image properties
      const imageProps = {
        left: mainImage.left,
        top: mainImage.top,
        originX: mainImage.originX,
        originY: mainImage.originY,
        angle: mainImage.angle,
        scaleX: mainImage.scaleX,
        scaleY: mainImage.scaleY,
        selectable: true,
        evented: true,
      }

      // Replace image
      canvasEditor.remove(mainImage)
      retouchedImage.set(imageProps)
      canvasEditor.add(retouchedImage)
      retouchedImage.setCoords()
      canvasEditor.setActiveObject(retouchedImage)
      canvasEditor.requestRenderAll()

      // Update project
      await updateProject({
        projectId: project._id,
        currentImageUrl: retouchedUrl,
        canvasState: canvasEditor.toJSON(),
        activeTransformations: selectedPresetData.transform,
      })
    } catch (error) {
      console.error('Error retouching image:', error)
      alert(t('errors.retouchFailed'))
    } finally {
      setProcessingMessage(null)
    }
  }

  // Early returns
  if (!canvasEditor) {
    return <div className="p-4 text-white/70 text-sm">{t('canvasNotReady')}</div>
  }

  const mainImage = getMainImage()
  if (!mainImage) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-amber-400 font-medium mb-1">{t('noImageFoundTitle')}</h3>
            <p className="text-amber-300/80 text-sm">{t('noImageFoundDescription')}</p>
          </div>
        </div>
      </div>
    )
  }

  const hasActiveTransformations = project.activeTransformations?.includes('e-retouch')
  const selectedPresetData = RETOUCH_PRESETS.find(p => p.key === selectedPreset)

  return (
    <div className="space-y-6">
      {/* Status Indicator */}
      {hasActiveTransformations && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-green-400 font-medium mb-1">{t('imageEnhancedTitle')}</h3>
              <p className="text-green-300/80 text-sm">{t('imageEnhancedDescription')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Preset Selection */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">{t('chooseStyle')}</h3>
        <div className="grid grid-cols-2 gap-3">
          {RETOUCH_PRESETS.map(preset => {
            const Icon = preset.icon
            const isSelected = selectedPreset === preset.key

            return (
              <div
                key={preset.key}
                className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-white/20 bg-slate-700/30 hover:border-white/40'
                }`}
                onClick={() => setSelectedPreset(preset.key)}
              >
                <div className="flex flex-col items-center text-center">
                  <Icon className="h-8 w-8 text-cyan-400 mb-2" />
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium text-sm">{t(preset.labelKey)}</h4>
                    {preset.recommended && (
                      <span className="px-1.5 py-0.5 bg-cyan-500 text-white text-xs rounded-full">★</span>
                    )}
                  </div>
                  <p className="text-white/70 text-xs">{t(preset.descriptionKey)}</p>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Apply Button */}
      <Button onClick={applyRetouch} className="w-full" variant="primary">
        <Wand2 className="h-4 w-4 mr-2" />
        {t('applyPreset', { preset: selectedPresetData ? t(selectedPresetData.labelKey) : '' })}
      </Button>

      {/* Information */}
      <div className="bg-slate-700/30 rounded-lg p-4">
        <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
          <Info className="h-4 w-4" />
          {t('info.title')}
        </h4>
        <div className="space-y-2 text-xs text-white/70">
          <p>
            • <strong>{t('info.aiRetouchLabel')}</strong> {t('info.aiRetouch')}
          </p>
          <p>
            • <strong>{t('info.smartProcessingLabel')}</strong> {t('info.smartProcessing')}
          </p>
          <p>
            • <strong>{t('info.multipleStylesLabel')}</strong> {t('info.multipleStyles')}
          </p>
          <p>
            • <strong>{t('info.instantResultsLabel')}</strong> {t('info.instantResults')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AiEditTool
