import { getPayload } from "payload";
import config from "@payload-config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/section";
import { ProjectImage } from "@/components/project-image";
import { ProjectGallerySection } from "@/components/project-gallery-section";
import type { Project, Media } from "@/payload-types";
import type { GalleryImage } from "@/components/masonry-gallery";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { buildImagePath, extractLexicalText } from "@/lib/image-url";

interface PageProps {
  params: Promise<{ slug: string }>;
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
  const heroMedia = firstImage?.image;
  const heroMediaObj: Media | null = heroMedia && typeof heroMedia === "object" ? heroMedia : null;
  const heroPath = buildImagePath(heroMediaObj?.filename, heroMediaObj?.folder);
  const heroAlt = heroMediaObj?.alt || project.title;
  const categoryName =
    typeof project.category === "object" && project.category ? project.category.name : "Uncategorized";

  const galleryImages: GalleryImage[] = (project.images ?? [])
    .slice(1)
    .filter((item) => typeof item.image === "object" && item.image?.filename)
    .map((item) => {
      const img = item.image as Media;
      return {
        id: item.id,
        image: { filename: img.filename, folder: img.folder, alt: img.alt },
        caption: item.caption,
      };
    });

  return (
    <>
      <div className="relative aspect-[21/9] w-full max-w-6xl mx-auto overflow-hidden rounded-2xl bg-wood-200">
        {heroPath ? (
          <ProjectImage
            path={heroPath}
            alt={heroAlt}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-wood-400 text-sm">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
          <span className="inline-block text-xs font-medium uppercase tracking-wide text-white/80 bg-black/30 rounded-full px-3 py-1">
            {categoryName}
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            {project.title}
          </h1>
        </div>
      </div>

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

        <div className="grid gap-10 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-2 text-wood-600 leading-relaxed">
            {project.description ? (
              <RichText data={project.description} />
            ) : (
              <p>No description available.</p>
            )}
          </div>

          {project.details && project.details.length > 0 && (
            <aside className="lg:col-span-1">
              <dl className="sticky top-24 grid gap-4 rounded-2xl border border-wood-200 bg-wood-50 p-6">
                {project.details.map((d) => (
                  <div key={d.label}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-wood-400">
                      {d.label}
                    </dt>
                    <dd className="mt-1 text-sm text-wood-700">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          )}
        </div>
      </Section>

      {galleryImages.length > 0 && (
        <Section title="Gallery">
          <ProjectGallerySection images={galleryImages} />
        </Section>
      )}

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
    description: project.description
      ? extractLexicalText(project.description).slice(0, 160)
      : "",
  };
}
