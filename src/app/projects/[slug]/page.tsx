import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/section";
import { ProjectImage } from "@/components/project-image";
import { RichText } from "@/components/rich-text";
import { getPayload } from 'payload'
import config from '@payload-config'

const categoryLabels: Record<string, string> = {
  'kitchen-renovation': 'Kitchen Renovation',
  'decking-outdoor': 'Decking & Outdoor',
  'custom-furniture': 'Custom Furniture',
  'interior-fit-outs': 'Interior Fit-outs',
  'other': 'Other',
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
  })

  if (docs.length === 0) {
    notFound();
  }

  const project = docs[0] as any
  const mainImage = project.thumbnail?.url ?? project.images?.[0]?.url

  return (
    <>
      <Section>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm font-medium text-wood-500 hover:text-wood-700 transition-colors mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to projects
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] rounded-2xl bg-wood-200 overflow-hidden">
            <ProjectImage
              src={mainImage}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-accent">
              {categoryLabels[project.category] ?? project.category}
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-wood-800 sm:text-4xl">
              {project.title}
            </h1>
            <div className="mt-6 text-wood-600 leading-relaxed">
              <RichText content={project.description} />
            </div>
            <dl className="mt-8 grid gap-4 sm:grid-cols-3">
              {(project.details as any[]).map((d: any) => (
                <div key={d.id ?? d.label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-wood-400">
                    {d.label}
                  </dt>
                  <dd className="mt-1 text-sm text-wood-700">{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section className="text-center bg-wood-800 text-wood-100 rounded-none">
        <h2 className="text-3xl font-semibold tracking-tight">
          Have a similar project in mind?
        </h2>
        <p className="mt-4 max-w-lg mx-auto text-wood-300">
          We&rsquo;d love to hear about it. Reach out and let&rsquo;s discuss
          how we can help.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-accent px-8 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          Get in touch
        </Link>
      </Section>
    </>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
  })
  if (docs.length === 0) return {}
  const project = docs[0] as any
  return {
    title: project.title,
    description: project.description
      ? (project.description as any).root?.children?.[0]?.children?.[0]?.text?.slice(0, 160)
      : '',
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'projects' })
  return docs.map((doc: any) => ({ slug: doc.slug }))
}
