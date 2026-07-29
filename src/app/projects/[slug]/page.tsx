import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/section";

interface Project {
  title: string;
  category: string;
  description: string;
  image: string;
  details: { label: string; value: string }[];
}

const projects: Record<string, Project> = {
  "oak-steel-kitchen": {
    title: "Oak & Steel Kitchen",
    category: "Kitchen Renovation",
    description:
      "A complete kitchen transformation in a 1930s villa. We removed three walls to create an open-plan space, installed bespoke oak cabinetry with matte black steel frames, and laid herringbone parquet flooring throughout.",
    image: "/projects/kitchen-placeholder.jpg",
    details: [
      { label: "Duration", value: "6 weeks" },
      { label: "Location", value: "Warsaw, Mokotów" },
      { label: "Materials", value: "European oak, powder-coated steel, quartz countertop" },
    ],
  },
  "herringbone-deck": {
    title: "Herringbone Deck",
    category: "Decking",
    description:
      "A 45 m² outdoor deck laid in a herringbone pattern using thermally modified ash. Integrated bench seating, planter boxes, and subtle LED step lighting complete the space.",
    image: "/projects/deck-placeholder.jpg",
    details: [
      { label: "Duration", value: "3 weeks" },
      { label: "Location", value: "Warsaw, Wilanów" },
      { label: "Materials", value: "Thermo-ash decking, stainless steel fixings" },
    ],
  },
  "library-wall": {
    title: "Floor-to-Ceiling Library",
    category: "Custom Furniture",
    description:
      "A full-wall fitted library spanning 5 metres wide and 2.8 metres tall. Solid walnut shelving with integrated LED strip lighting, a rolling ladder, and a hidden cabinet for AV equipment.",
    image: "/projects/library-placeholder.jpg",
    details: [
      { label: "Duration", value: "4 weeks" },
      { label: "Location", value: "Warsaw, Żoliborz" },
      { label: "Materials", value: "American black walnut, brass hardware" },
    ],
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects[slug];

  if (!project) {
    notFound();
  }

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
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-accent">
              {project.category}
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-wood-800 sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-6 text-wood-600 leading-relaxed">
              {project.description}
            </p>
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
  const project = projects[slug];
  if (!project) return {};
  return {
    title: project.title,
    description: project.description.slice(0, 160),
  };
}

export async function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({ slug }));
}
