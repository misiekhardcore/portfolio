import { Section } from "@/components/section";
import { ProjectCard } from "@/components/project-card";
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function ProjectsPage() {
  const payload = await getPayload({ config })
  const { docs: projects } = await payload.find({ collection: 'projects', sort: '-completedAt' })

  if (projects.length === 0) {
    return (
      <Section
        title="Our projects"
        subtitle="Every project is a story of transformation."
      >
        <div className="rounded-2xl border border-wood-200 bg-white p-12 text-center text-wood-400 text-sm">
          No projects yet. Add some in the admin panel.
        </div>
      </Section>
    )
  }

  return (
    <Section
      title="Our projects"
      subtitle="Every project is a story of transformation. Browse our portfolio of completed work."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: any) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            category={project.category}
            slug={project.slug}
            image={project.thumbnail?.url ?? project.images?.[0]?.url ?? ''}
          />
        ))}
      </div>
    </Section>
  );
}
