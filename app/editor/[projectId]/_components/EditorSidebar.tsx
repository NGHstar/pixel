import { EditorSideBarTools } from '@/utils/tools'
import CropTool from './tools/CropTool'
import ResizeTool from './tools/ResizeTool'
import AdjustTool from './tools/AdjustTool'
import { Doc } from '@/convex/_generated/dataModel'
import { useCanvas } from '@/context/canvas'
import { ToolKeys } from '@/utils/types'
import { useTranslations } from 'next-intl'
import AiEditTool from './tools/AiEditTool'
import AiExtendTool from './tools/AiExtendTool'
import BackgroundTool from './tools/BackgroundTool'
import TextTool from './tools/TextTool'

function EditorSidebar({ project }: { project: Doc<'projects'> }) {
  const t = useTranslations('editor.sidebar')
  const tools = EditorSideBarTools

  const { activeTool } = useCanvas()

  const toolConfig = tools[activeTool]

  if (!toolConfig) return

  const Icon = toolConfig.icon

  return (
    <div className="min-w-96 border-r flex flex-col pt-1">
      <div className="p-5 border-b">
        <div className="flex items-center gap-2.5">
          <Icon className="w-5 h-5" />
          <h2 className="text-lg font-semibold translate-y-0.75">{t(toolConfig.titleKey)}</h2>
        </div>
        <p className="text-sm mt-1.5 text-foreground/70">{t(toolConfig.descriptionKey)}</p>
      </div>

      <div className="flex-1 p-5 overflow-y-auto">{renderToolConfig(activeTool, project)}</div>
    </div>
  )
}

function renderToolConfig(activeTool: ToolKeys, project: Doc<'projects'>) {
  switch (activeTool) {
    case 'crop':
      return <CropTool />
    case 'resize':
      return <ResizeTool project={project} />
    case 'adjust':
      return <AdjustTool />
    case 'ai_edit':
      return <AiEditTool project={project} />
    case 'ai_extender':
      return <AiExtendTool project={project} />
    case 'background':
      return <BackgroundTool project={project} />
    case 'text':
      return <TextTool />
    default:
      const _defTool: never = activeTool
      return _defTool
  }
}

export default EditorSidebar
