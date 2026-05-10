'use client'

import { useCanvas } from '@/context/canvas'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Canvas, FabricImage } from 'fabric'

function CanvasEditor({
  project,
}: {
  project: {
    projectId: number
    canvasState: any
    width: number
    height: number
    currentImageUrl: string
    originalImageUrl: string
    thumbnailUrl: string
    activeTransformations: string
    backgroundRemoved: boolean
  }
}) {
  const [isLoading, setIsLoading] = useState(true)
  const canvasRef = useRef<any>(null)
  const containerRef = useRef<any>(null)
  const { canvasEditor, setCanvasEditor, activeTool, onToolChange }: any = useCanvas()
  const isInitializedRef = useRef(false)

  const updateProject = (data: string) => {
    console.log(data)
  }

  const calculateViewportScale = () => {
    if (!containerRef.current || !project) return 1

    const container = containerRef.current
    const containerWidth = container.clientWidth - 40
    const containerHeight = container.clientHeight - 40

    const scaleX = containerWidth / project.width
    const scaleY = containerHeight / project.height

    return Math.min(scaleX, scaleY, 1)
  }

  const cleanupCanvas = () => {
    if (canvasEditor) {
      try {
        canvasEditor.dispose()
        setCanvasEditor(null)
      } catch (error) {
        console.error('Error disposing canvas:', error)
      }
    }

    if (canvasRef.current && (canvasRef.current as any).__fabric) {
      try {
        ;(canvasRef.current as any).__fabric.dispose()
      } catch (error) {
        console.error('Error disposing fabric canvas:', error)
      }
      delete (canvasRef.current as any).__fabric
    }

    isInitializedRef.current = false
  }

  useEffect(() => {
    cleanupCanvas()

    const initialCanvas = async () => {
      if (!canvasRef.current || !project) {
        console.log('Canvas ref or project is missing')
        setIsLoading(false)
        return
      }

      console.log('Starting canvas initialization...', {
        projectId: project.projectId,
        width: project.width,
        height: project.height,
        currentImageUrl: project.currentImageUrl,
        originalImageUrl: project.originalImageUrl,
        hasCanvasState: !!project.canvasState,
      })

      setIsLoading(true)

      try {
        const viewportScale = calculateViewportScale()
        console.log('Viewport scale:', viewportScale)

        // ایجاد canvas جدید
        const canvas = new Canvas(canvasRef.current, {
          width: project.width,
          height: project.height,
          backgroundColor: '#FFF',
          preserveObjectStacking: true,
          controlsAboveOverlay: true,
          selection: true,
          hoverCursor: 'move',
          moveCursor: 'move',
          defaultCursor: 'default',
          allowTouchScrolling: false,
          renderOnAddRemove: true,
          skipTargetFind: false,
        })

        isInitializedRef.current = true

        // تنظیم ابعاد
        canvas.setDimensions(
          {
            width: project.width * viewportScale,
            height: project.height * viewportScale,
          },
          {
            backstoreOnly: false,
          }
        )

        canvas.setZoom(viewportScale)

        console.log('Canvas created successfully')

        // FIRST: اگر canvas state وجود دارد، ابتدا آن را بارگذاری کن
        if (project.canvasState) {
          try {
            console.log('Loading canvas state first...')
            await canvas.loadFromJSON(project.canvasState)
            console.log('Canvas state loaded successfully, objects:', canvas.getObjects().length)
          } catch (err) {
            console.error('Error loading canvas state: ', err)
          }
        }

        // SECOND: سپس تصویر را اضافه کن (اگر canvas state تصویری نداشته باشد)
        let imageLoaded = false

        // بررسی کن که آیا canvas state قبلاً تصویری دارد یا نه
        const existingImages = canvas.getObjects().filter(obj => obj.type === 'image')
        console.log('Existing images in canvas state:', existingImages.length)

        if (existingImages.length === 0 && (project.currentImageUrl || project.originalImageUrl)) {
          try {
            const imageUrl = project.currentImageUrl || project.originalImageUrl
            console.log('Loading image from URL:', imageUrl)

            if (imageUrl) {
              const fabricImage = await FabricImage.fromURL(imageUrl, {
                crossOrigin: 'anonymous',
              })

              console.log('Image loaded successfully:', {
                width: fabricImage.width,
                height: fabricImage.height,
              })

              const imgAspectRatio = fabricImage.width / fabricImage.height
              const canvasAspectRatio = project.width / project.height

              let scaleX = 1,
                scaleY = 1

              if (imgAspectRatio > canvasAspectRatio) {
                scaleX = project.width / fabricImage.width
                scaleY = scaleX
              } else {
                scaleY = project.height / fabricImage.height
                scaleX = scaleY
              }

              console.log('Scale values:', { scaleX, scaleY })

              fabricImage.set({
                left: project.width / 2,
                top: project.height / 2,
                originX: 'center',
                originY: 'center',
                scaleX: scaleX,
                scaleY: scaleY,
                selectable: true,
                evented: true,
              })

              canvas.add(fabricImage)
              canvas.centerObject(fabricImage)
              imageLoaded = true
              console.log('Image added to canvas')
            }
          } catch (error) {
            console.error('Error loading project image: ', error)
          }
        } else {
          console.log('Skipping image load because canvas state already has images or no URL provided')
        }

        canvas.calcOffset()
        canvas.requestRenderAll()

        // بررسی نهایی
        console.log('Final canvas objects:', canvas.getObjects().length)
        console.log('Canvas render completed')

        setCanvasEditor(canvas)

        setTimeout(() => {
          window.dispatchEvent(new Event('resize'))
        }, 500)

        if (canvas.getObjects().length === 0) {
          console.warn('Canvas is empty - no objects loaded')
        }
      } catch (error) {
        console.error('Error initializing canvas:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initialCanvas()

    return () => {
      cleanupCanvas()
    }
  }, [project?.projectId])

  useEffect(() => {
    if (canvasEditor) {
      console.log('Canvas editor updated:', {
        hasCanvas: !!canvasEditor,
        objectsCount: canvasEditor.getObjects()?.length,
        width: canvasEditor.width,
        height: canvasEditor.height,
      })
    }
  }, [canvasEditor])

  useEffect(() => {
    const handleResize = () => {
      if (!canvasEditor || !project) return

      const newScale = calculateViewportScale()

      canvasEditor.setDimensions(
        {
          width: project.width * newScale,
          height: project.height * newScale,
        },
        { backstoreOnly: false }
      )

      canvasEditor.setZoom(newScale)
      canvasEditor.calcOffset()
      canvasEditor.requestRenderAll()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [canvasEditor, project])

  const saveCanvasState = async () => {
    if (!canvasEditor || !project) return

    try {
      const canvasJson = canvasEditor.toJSON()
      //todo
      // await updateProject({
      //   projectId: project._id,
      //   canvasState: canvasJson,
      // })
    } catch (error) {
      console.error('Error saving canvas state')
    }
  }

  useEffect(() => {
    if (!canvasEditor) return

    // debounce save function
    let saveTimeout: any
    const handleCanvasChange = () => {
      clearTimeout(saveTimeout)
      saveTimeout = setTimeout(() => {
        saveCanvasState()
      }, 2000)
    }

    // listen for canvas modification events
    canvasEditor.on('object:modified', handleCanvasChange)
    canvasEditor.on('object:added', handleCanvasChange)
    canvasEditor.on('object:removed', handleCanvasChange)

    return () => {
      clearTimeout(saveTimeout)
      canvasEditor.off('object:modified', handleCanvasChange)
      canvasEditor.off('object:added', handleCanvasChange)
      canvasEditor.off('object:removed', handleCanvasChange)
    }
  }, [canvasEditor])

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center bg-secondary w-full h-full overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #64748b 25%, transparent 25%),
            linear-gradient(-45deg, #64748b 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #64748b 75%),
            linear-gradient(-45deg, transparent 75%, #64748b 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
        }}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin w-6 h-6 text-foreground/80" />
            <p className="text-foreground/70 text-sm">loading canvas ...</p>
          </div>
        </div>
      )}

      <div className="px-5">
        <canvas
          ref={canvasRef}
          id="canvas"
          className="border shadow-lg"
          style={{
            display: 'block',
            margin: '0 auto',
          }}
        ></canvas>
      </div>
    </div>
  )
}

export default CanvasEditor
