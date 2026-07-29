interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function ServiceCard({ title, description, icon }: ServiceCardProps) {
  return (
    <div className="group rounded-2xl border border-wood-200 bg-white p-8 transition-shadow hover:shadow-lg">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-wood-800 mb-2">{title}</h3>
      <p className="text-sm text-wood-500 leading-relaxed">{description}</p>
    </div>
  );
}
