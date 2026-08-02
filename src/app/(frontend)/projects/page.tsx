import { getPayload } from 'payload';
import config from '@payload-config';
import { Section } from '@/components/section';
import { ProjectCard } from '@/components/project-card';
import type { Project } from '@/payload-types';

async function getProjects(): Promise<Project[]> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'projects',
      sort: '-date',
      depth: 2,
      limit: 50,
    });
    return docs as Project[];
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <Section
      title="Our projects"
      subtitle="Every project is a story of transformation. Browse our portfolio of completed work."
    >
      {projects.length === 0 ? (
        <div className="rounded-2xl border border-wood-200 bg-white p-12 text-center text-wood-400 text-sm">
          No projects yet
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </Section>
  );
}
