import { Section } from "@/components/section";
import { ServiceCard } from "@/components/service-card";
import { ProjectCard } from "@/components/project-card";
import Link from "next/link";

const services = [
  {
    title: "Custom Furniture",
    description:
      "Bespoke tables, shelves, wardrobes, and cabinetry built to your space and style — from rustic oak to clean modern lines.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="9" width="18" height="12" rx="2" />
        <rect x="5" y="5" width="14" height="4" rx="1" />
        <line x1="8" y1="13" x2="8" y2="17" />
        <line x1="16" y1="13" x2="16" y2="17" />
        <line x1="11" y1="13" x2="11" y2="17" />
        <line x1="5" y1="13" x2="5" y2="17" />
        <line x1="19" y1="13" x2="19" y2="17" />
      </svg>
    ),
  },
  {
    title: "Kitchen Renovations",
    description:
      "Full kitchen remodels — new cabinetry, countertops, flooring, lighting, and plumbing. We manage the entire project from start to finish.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M4 4h16v16H4z" />
        <rect x="6" y="6" width="12" height="7" />
        <rect x="6" y="16" width="5" height="2" rx="0.5" />
        <rect x="14" y="16" width="4" height="2" rx="0.5" />
      </svg>
    ),
  },
  {
    title: "Decking & Outdoor",
    description:
      "Hardwood and composite decking, pergolas, fencing, and garden structures built to withstand the elements and look great for years.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="2" y="8" width="20" height="3" rx="1" />
        <line x1="4" y1="14" x2="4" y2="20" />
        <line x1="8" y1="14" x2="8" y2="20" />
        <line x1="12" y1="14" x2="12" y2="20" />
        <line x1="16" y1="14" x2="16" y2="20" />
        <line x1="20" y1="14" x2="20" y2="20" />
        <line x1="2" y1="11" x2="22" y2="11" />
      </svg>
    ),
  },
  {
    title: "Interior Fit-outs",
    description:
      "Complete room transformations — flooring, wall panelling, built-in storage, painting, and finishing. One team, one vision.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
];

const featuredProjects = [
  {
    title: "Oak & Steel Kitchen",
    category: "Kitchen Renovation",
    slug: "oak-steel-kitchen",
    image: "/projects/kitchen-placeholder.jpg",
  },
  {
    title: "Herringbone Deck",
    category: "Decking",
    slug: "herringbone-deck",
    image: "/projects/deck-placeholder.jpg",
  },
  {
    title: "Floor-to-Ceiling Library",
    category: "Custom Furniture",
    slug: "library-wall",
    image: "/projects/library-placeholder.jpg",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Section className="pb-32 pt-24 text-center bg-gradient-to-b from-wood-100/50 to-transparent">
        <div className="animate-slide-up">
          <h1 className="text-4xl font-bold tracking-tight text-wood-800 sm:text-5xl lg:text-6xl">
            Craftsmanship
            <br />
            <span className="text-accent">you can trust</span>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-lg text-wood-600 leading-relaxed">
            Bespoke woodworking and full-scale home renovations.
            We turn houses into homes — one carefully crafted detail at a time.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/projects"
              className="inline-flex h-12 items-center rounded-full bg-accent px-8 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
            >
              View our work
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-full border border-wood-300 px-8 text-sm font-semibold text-wood-700 transition-colors hover:border-wood-400 hover:bg-wood-100"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </Section>

      {/* Services */}
      <Section
        id="services"
        title="What we do"
        subtitle="From a single piece of furniture to a full home transformation, we bring precision and care to every project."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((svc) => (
            <ServiceCard key={svc.title} {...svc} />
          ))}
        </div>
      </Section>

      {/* Featured Projects */}
      <Section
        id="featured"
        title="Recent work"
        subtitle="A selection of projects we&rsquo;re proud of."
        className="bg-white"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((proj) => (
            <ProjectCard key={proj.slug} {...proj} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/projects"
            className="inline-flex h-12 items-center rounded-full border border-wood-300 px-8 text-sm font-semibold text-wood-700 transition-colors hover:border-wood-400 hover:bg-wood-100"
          >
            See all projects
          </Link>
        </div>
      </Section>

      {/* CTA */}
      <Section className="text-center bg-wood-800 text-wood-100 rounded-none">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Let&rsquo;s build something&nbsp;together
        </h2>
        <p className="mt-4 max-w-lg mx-auto text-wood-300">
          Every project starts with a conversation. Tell us about your ideas and
          we&rsquo;ll help you bring them to life.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-accent px-8 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          Start your project
        </Link>
      </Section>
    </>
  );
}
