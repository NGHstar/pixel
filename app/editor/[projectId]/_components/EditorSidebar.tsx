import { useCanvas } from '@/context/canvas'
import { EditorSideBarTools } from '@/utils/tools'
import CropTool from './tools/CropTool'
import ResizeTool from './tools/ResizeTool'
import AdjustTool from './tools/AdjustTool'

function EditorSidebar({ project }) {
  // ---
  const tools = EditorSideBarTools

  const { activeTool } = useCanvas()

  // todo
  // const toolConfig = tools[activeTool]

  const toolConfig = tools[0]

  //todo
  // if (!toolConfig) return

  const Icon = toolConfig.icon

  return (
    <div className="min-w-96 border-r flex flex-col  pt-1">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2.5">
          <Icon className="w-5 h-5" />
          <h2 className="text-lg font-semibold translate-y-0.75">{toolConfig.title}</h2>
        </div>
        <p className="text-sm mt-1.5 text-foreground/70">{toolConfig.description}</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {
          //todo
          //renderToolConfig(activeTool, project)
          renderToolConfig('resize', project)
        }
      </div>
    </div>
  )
}

function renderToolConfig(activeTool: string, project) {
  switch (activeTool) {
    case 'crop':
      return <CropTool />
    case 'resize':
      return <ResizeTool project={project} />
    case 'adjust':
      return <AdjustTool />
    default:
      return <div>Select a tool to get started</div>
  }
  return <></>
}

export default EditorSidebar
