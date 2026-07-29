import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  category: string;
  slug: string;
  image: string;
}

export function ProjectCard({ title, category, slug, image }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className="group block rounded-2xl border border-wood-200 bg-white overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] bg-wood-100 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-5">
        <span className="text-xs font-medium uppercase tracking-wide text-accent">
          {category}
        </span>
        <h3 className="mt-1 text-lg font-semibold text-wood-800 group-hover:text-wood-600 transition-colors">
          {title}
        </h3>
      </div>
    </Link>
  );
}
