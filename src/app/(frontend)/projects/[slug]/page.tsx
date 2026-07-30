import { getPayload } from "payload";
import config from "@payload-config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/section";
import { ProjectImage } from "@/components/project-image";
import type { Project, Media } from "@/payload-types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function richTextToPlainText(node: unknown): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (typeof node !== "object") return "";
  const n = node as Record<string, unknown>;
  if (n.text) return String(n.text);
  if (n.children) return (n.children as unknown[]).map(richTextToPlainText).join("\n");
  if (n.root) return richTextToPlainText(n.root);
  return "";
}

async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "projects",
      where: { slug: { equals: slug } },
      depth: 2,
    });
    return (docs[0] as Project) ?? null;
  } catch {
    return null;
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const firstImage = project.images?.[0];
  const media = firstImage?.image;
  const mediaObj: Media | null = media && typeof media === "object" ? media : null;
  const imagePath = mediaObj?.filename
    ? `${mediaObj.folder || "projects"}/${mediaObj.filename}`
    : undefined;
  const imageAlt = mediaObj?.alt || project.title;

  return (
    <>
      <Section>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm font-medium text-wood-500 hover:text-wood-700 transition-colors mb-8"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to projects
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] rounded-2xl bg-wood-200 overflow-hidden">
            {imagePath ? (
              <ProjectImage
                path={imagePath}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-wood-400 text-sm">
                No image
              </div>
            )}
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-accent">
              {typeof project.category === "object" && project.category ? project.category.name : "Uncategorized"}
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-wood-800 sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-6 text-wood-600 leading-relaxed">
              {project.description
                ? richTextToPlainText(project.description)
                : "No description available."}
            </p>
            {project.details && project.details.length > 0 && (
              <dl className="mt-8 grid gap-4 sm:grid-cols-3">
                {project.details.map((d) => (
                  <div key={d.label}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-wood-400">
                      {d.label}
                    </dt>
                    <dd className="mt-1 text-sm text-wood-700">{d.value}</dd>
                  </div>
                ))}
              </dl>
            )}
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
  const project = await getProjectBySlug(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.description ? richTextToPlainText(project.description).slice(0, 160) : "",
  };
}
