import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { Edit, Trash } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Doc } from '@/convex/_generated/dataModel'
import { getDistance } from '@/utils/get-distance'

function ProjectCard({ project, onEdit }: { project: Doc<'projects'>; onEdit: () => void }) {
  const handleDelete = useMutation(api.projects.deleteProject)

  const t = useTranslations('project-card')
  const locale = useLocale() as 'fa' | 'en'

  const lastUpdated = getDistance(new Date(project.updatedAt), locale)

  return (
    <Card className="pt-0 bg-foreground/5 overflow-hidden hover:border-foreground/20 duration-300">
      <div className="relative group">
        {project.thumbnailUrl && (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover transition duration-300 group-hover:blur-sm"
          />
        )}

        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            className="gap-2 pt-3 bg-background hover:bg-background/70"
            onClick={onEdit}
          >
            <Edit className="w-4 h-5 -translate-y-0.5" />
            {t('edit')}
          </Button>

          <Button
            variant="glass"
            className="text-white bg-background hover:bg-background/70 gap-2 pt-3"
            onClick={() => {
              const confirmed = window.confirm(t('delete-confirm'))
              if (!confirmed) return

              handleDelete({ projectId: project._id })
            }}
          >
            <Trash className="w-4 h-5 -translate-y-0.5" />
            {t('delete')}
          </Button>
        </div>
      </div>

      <CardContent>
        <h3 className="font-semibold mb-1 truncate">{project.title}</h3>

        <div className="flex items-center justify-between text-sm text-foreground/70">
          <span>
            {t('updated')}: {lastUpdated}
          </span>

          <Badge
            dir="ltr"
            variant="secondary"
            className="text-xs bg-foreground/10 text-foreground/60 pt-1.5 px-3"
          >
            {project.width} x {project.height}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectCard
