import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { Edit, Trash } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

function ProjectCard({ project, onEdit }: { project: any; onEdit: () => void }) {
  // ---
  //   const handleDetele = useMutation(api.projects.deleteProject)
  const handleDelete = () => {
    alert('not implemented yet')
  }

  //todo
  //   const lastUpdated = formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })
  const lastUpdated = formatDistanceToNow(Date(), { addSuffix: true })

  return (
    <Card className="pt-0 group relative bg-foreground/5 overflow-hidden hover:border-foreground/20 duration-300">
      <img src="batman.jpg" alt={project.title} className="w-full h-full object-cover" />
      {
        //todo
      }
      {/* <div>
        {project.thumbnailUrl && (
          <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
        )}
      </div> */}

      <div
        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 duration-300 flex
      items-center justify-center gap-2"
      >
        <Button variant="glass" className="gap-2 pt-3" onClick={onEdit}>
          <Edit className="w-4 h-5 -translate-y-0.5" />
          Edit
        </Button>
        <Button variant="glass" className="text-red-400 hover:text-red-300 gap-2 pt-3" onClick={handleDelete}>
          <Trash className="w-4 h-5 -translate-y-0.5" />
          Delete
        </Button>
      </div>

      <CardContent>
        <h3 className="font-semibold mb-1 truncate">{project.title}</h3>
        <div className="flex items-center justify-between text-sm text-foreground/70">
          <span>updated {lastUpdated}</span>
          <Badge variant="secondary" className="text-xs bg-foreground/10 text-foreground/60 pt-1.5 px-3">
            {project.width} x {project.height}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectCard
