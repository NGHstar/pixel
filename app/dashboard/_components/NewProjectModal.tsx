'use client'

import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Crown, ImageIcon, Loader2, Upload, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { usePlanAccess } from '@/hooks/use-plan-access'
import { useMutation, useQuery } from 'convex/react'
import { Button } from '@/components/ui/button'
import { useDropzone } from 'react-dropzone'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import UpgradeModal from '@/components/UpgradeModal'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { api } from '@/convex/_generated/api'
import { useTranslations } from 'next-intl'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
}

function NewProjectModal({ isOpen, onClose }: DialogProps) {
  //---
  const t = useTranslations('new-project-modal')

  const router = useRouter()

  const [isUploading, setIsUploading] = useState(false)
  const [projectTitle, setProjectTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const [showUpgradeModel, setShowUpgradeModel] = useState(false)

  const { isFree, canCreateProject } = usePlanAccess()

  const createProject = useMutation(api.projects.create)
  const projects = useQuery(api.projects.getUserProjects)

  const currentProjectsCount = projects?.length || 0

  const canCreate = canCreateProject(currentProjectsCount)

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))

      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
      setProjectTitle(nameWithoutExt || 'Untitled project')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'images/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024, // 20 MB
  })

  const clearImageInput = () => {
    setPreviewUrl('')
    setSelectedFile(null)
    setProjectTitle('')
  }

  const handleCreateProject = async () => {
    // ---
    if (!canCreate) {
      setShowUpgradeModel(true)
      return
    }

    if (!selectedFile || !projectTitle.trim()) {
      toast.error('please select an image and enter a project title')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('fileName', selectedFile.name)

      const uploadResponse: any = await axios.post('/api/imagekit/upload', formData)

      if (!uploadResponse.data.success) {
        console.log(uploadResponse)
        throw new Error(uploadResponse.error || 'failed to upload image')
      }

      const projectId = await createProject({
        title: projectTitle.trim(),
        originalImageUrl: uploadResponse.data.url,
        currentImageUrl: uploadResponse.data.url,
        thumbnailUrl: uploadResponse.data.thumbnailUrl,
        width: uploadResponse.data.width || 800,
        height: uploadResponse.data.height || 600,
        canvasState: null,
      })

      toast.success('Project created successfully')
      router.push(`/editor/${projectId}`)
    } catch (error: any) {
      console.error('FULL ERROR:', error)
      console.error('RESPONSE:', error?.response?.data)
      toast.error(error?.response?.data?.details || error.message)
    } finally {
      setIsUploading(false)
      clearImageInput()
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // جلوگیری از اسکرول بک‌گراند
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* بک‌دراپ ( backdrop ) */}
      <div
        className="fixed inset-0 z-50 bg-white/10 backdrop-blur-xl transition-all duration-300"
        onClick={onClose}
      />

      {/* دیالوگ اصلی */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`
            relative bg-white dark:bg-gray-900 rounded-lg shadow-xl 
            max-w-lg w-full max-h-[90vh] overflow-hidden
            animate-in fade-in zoom-in duration-300
          `}
        >
          {/* هدر دیالوگ */}
          <div className="relative flex flex-col sm:flex-row items-bottom gap-2 sm:gap-4 justify-start p-5 border-b border-gray-300 dark:border-gray-800">
            {<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('title')}</h2>}
            {isFree && (
              <Badge variant="secondary" className="bg-slate-700 text-white/70 ltr:pt-1 px-3">
                {currentProjectsCount}/3 {t('projects')}
              </Badge>
            )}
            <button
              onClick={() => {
                clearImageInput()
                onClose()
              }}
              className="absolute inset-e-2 top-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* محتوای دیالوگ */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {isFree && currentProjectsCount >= 2 && (
              <Alert className="mb-6">
                <Crown className="w-5 h-5 text-amber-400" />
                <AlertDescription className="text-amber-300/80">
                  <div className="font-semibold text-amber-400 mb-1">
                    {currentProjectsCount === 2 ? 'Last Free Project' : 'Project Limit Reached'}
                    {currentProjectsCount === 2
                      ? 'This will be your last free project. Upgrade to Pixel Pro for unlimited projects.'
                      : 'Free plan is limited to 3 projects. Upgrade to Pixel Pro to create more projects.'}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Upload Area */}
            {!selectedFile ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-cyan-400 bg-cyan-400/5'
                    : 'border-foreground/20 hover:border-foreground/40'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-foreground/50 mx-auto mb-4" />

                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {isDragActive ? t('upload-title-drag-mode') : t('upload-title')}
                </h3>

                <p className="text-foreground/70 mb-4">
                  {canCreate ? t('upload-description') : t('upload-description-limit-mode')}
                </p>
                <p className="text-foreground/50 text-sm">{t('supported-formats')}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-full h-64 object-cover rounded-xl border border-foreground/10"
                  />
                  <Button
                    className="absolute text-foreground top-3 right-3 bg-black/60 border border-white/20"
                    variant="ghost"
                    size="icon"
                    onClick={clearImageInput}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <label htmlFor="project-title">{t('input.title')}</label>
                  <Input
                    id="project-title"
                    type="text"
                    value={projectTitle}
                    onChange={e => setProjectTitle(e.target.value)}
                    placeholder={t('input.placeholder')}
                    className="pt-7 pb-6 mt-2"
                  />
                </div>
                <div className="bg-cyan-600/10 dark:bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* dialog footer */}
          <footer className="p-5 flex gap-3 justify-end">
            <Button
              variant="ghost"
              disabled={isUploading}
              onClick={() => {
                clearImageInput()
                onClose()
              }}
              className=" text-foreground/70 hover:text-foreground bg-foreground/5 pb-1.5"
            >
              {t('cancel-button')}
            </Button>
            <Button
              disabled={!selectedFile || !projectTitle.trim() || isUploading}
              variant="primary"
              onClick={() => {
                handleCreateProject()
              }}
              className="pb-1.5"
            >
              {isUploading ? (
                <>
                  {t('creating')} <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (
                t('create-button')
              )}
            </Button>
          </footer>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModel}
        onClose={() => setShowUpgradeModel(false)}
        restrictedTool="projects"
        reason="Free plan is limited to 3 projects. Upgrade to 'Pro' for unlimited projects and access to all AI editing tools."
      />
    </>
  )
}

export default NewProjectModal
