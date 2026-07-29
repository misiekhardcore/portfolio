import { Section } from "@/components/section";
import { RichText } from "@/components/rich-text";
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function AboutPage() {
  const payload = await getPayload({ config })
  const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
  const aboutText = (siteSettings as any).aboutText

  return (
    <Section title="About us" subtitle="The people, the craft, the philosophy.">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
        <div className="space-y-5 text-wood-600 leading-relaxed">
          {aboutText ? (
            <RichText content={aboutText} />
          ) : (
            <>
              <p>
                We are a small team of craftsmen and renovation specialists based in
                Warsaw. For over a decade we have been designing, building, and
                restoring homes — one project at a time.
              </p>
              <p>
                Our approach is simple: listen carefully, plan thoroughly, and
                execute with precision. We believe that the best results come from
                treating every project as if it were our own home.
              </p>
              <p>
                Whether it&rsquo;s a hand-cut dovetail joint or a full kitchen
                gut-and-refit, we bring the same level of care and attention to
                every detail.
              </p>
            </>
          )}
        </div>
        <div className="aspect-[4/3] rounded-2xl bg-wood-200 flex items-center justify-center text-wood-400 text-sm">
          Team photo placeholder
        </div>
      </div>
    </Section>
  );
}
