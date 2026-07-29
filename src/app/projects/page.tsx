import { Section } from "@/components/section";

export default function ProjectsPage() {
  return (
    <Section
      title="Our projects"
      subtitle="Every project is a story of transformation. Browse our portfolio of completed work."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-wood-200 bg-white p-12 text-center text-wood-400 text-sm">
          Project gallery coming soon
        </div>
      </div>
    </Section>
  );
}
