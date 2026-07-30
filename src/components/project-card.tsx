import Link from "next/link";
import { ProjectImage } from "./project-image";
import type { Project, Media } from "@/payload-types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const firstImage = project.images?.[0];
  const media = firstImage?.image;
  const mediaObj: Media | null = media && typeof media === "object" ? media : null;
  const imagePath = mediaObj?.filename
    ? `${mediaObj.folder || "projects"}/${mediaObj.filename}`
    : undefined;
  const imageAlt = mediaObj?.alt || project.title;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-2xl border border-wood-200 bg-white overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] bg-wood-100 overflow-hidden">
        {imagePath ? (
          <ProjectImage
            path={imagePath}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-wood-400 text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-5">
        <span className="text-xs font-medium uppercase tracking-wide text-accent">
          {typeof project.category === "object" && project.category ? project.category.name : "Uncategorized"}
        </span>
        <h3 className="mt-1 text-lg font-semibold text-wood-800 group-hover:text-wood-600 transition-colors">
          {project.title}
        </h3>
      </div>
    </Link>
  );
}
