import { Section } from '@/components/section';

export default function ContactPage() {
  return (
    <Section
      title="Get in touch"
      subtitle="Ready to start your project? Fill out the form or reach out directly."
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <form className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-wood-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full rounded-xl border border-wood-200 bg-white px-4 py-3 text-sm text-wood-800 placeholder:text-wood-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-wood-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full rounded-xl border border-wood-200 bg-white px-4 py-3 text-sm text-wood-800 placeholder:text-wood-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-wood-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full rounded-xl border border-wood-200 bg-white px-4 py-3 text-sm text-wood-800 placeholder:text-wood-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="Tell us about your project..."
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-12 items-center rounded-full bg-accent px-8 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            Send message
          </button>
        </form>
        <div className="space-y-6 text-wood-600 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-wood-800 mb-1">Email</h3>
            <p>hello@yourcompany.com</p>
          </div>
          <div>
            <h3 className="font-semibold text-wood-800 mb-1">Phone</h3>
            <p>+48 123 456 789</p>
          </div>
          <div>
            <h3 className="font-semibold text-wood-800 mb-1">Location</h3>
            <p>Warsaw, Poland</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
