interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, title, subtitle, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`py-20 px-6 ${className}`}>
      <div className="mx-auto max-w-6xl">
        {title && (
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-wood-800 sm:text-4xl">
              {title}
            </h2>
            {subtitle && <p className="mt-3 text-wood-500 max-w-xl mx-auto">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
