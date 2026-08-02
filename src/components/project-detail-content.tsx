'use client';

import { useState, useMemo } from 'react';
import { MasonryGallery } from '@/components/masonry-gallery';
import { Lightbox } from '@/components/lightbox';
import type { LightboxImage } from '@/components/lightbox';
import type { GalleryImage } from '@/components/masonry-gallery';
import { RichTextWithLightbox } from '@/components/rich-text-with-lightbox';
import { Section } from '@/components/section';
import { toLightboxImages } from '@/components/project-gallery-section';
import type { SerializedEditorState } from 'lexical';

interface ProjectDetailContentProps {
  description: SerializedEditorState | null | undefined;
  galleryImages: GalleryImage[];
  inlineImages: LightboxImage[];
  details: { label: string; value: string; id?: string | null }[] | null | undefined;
}

export function ProjectDetailContent({
  description,
  galleryImages,
  inlineImages,
  details,
}: ProjectDetailContentProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const galleryLightboxImages = useMemo(() => toLightboxImages(galleryImages), [galleryImages]);

  const allLightboxImages = useMemo(() => {
    const seen = new Set<string>();
    const result: LightboxImage[] = [];
    for (const img of inlineImages) {
      if (!seen.has(img.src)) {
        seen.add(img.src);
        result.push(img);
      }
    }
    for (const img of galleryLightboxImages) {
      if (!seen.has(img.src)) {
        seen.add(img.src);
        result.push(img);
      }
    }
    return result;
  }, [galleryLightboxImages, inlineImages]);

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-3 lg:gap-16">
        <div className="lg:col-span-2 text-wood-600 leading-relaxed">
          {description ? (
            <RichTextWithLightbox
              data={description}
              inlineImages={inlineImages}
              onImageClick={(inlineIdx) => {
                setLightboxIndex(inlineIdx);
                setLightboxOpen(true);
              }}
            />
          ) : (
            <p>No description available.</p>
          )}
        </div>

        {details && details.length > 0 && (
          <aside className="lg:col-span-1">
            <dl className="sticky top-24 grid gap-4 rounded-2xl border border-wood-200 bg-wood-50 p-6">
              {details.map((d) => (
                <div key={d.id ?? d.label}>
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

      {galleryImages.length > 0 && (
        <Section title="Gallery">
          <MasonryGallery
            images={galleryImages}
            onImageClick={(idx) => {
              const clicked = toLightboxImages([galleryImages[idx]])[0];
              const lightboxIdx = clicked
                ? allLightboxImages.findIndex((img) => img.src === clicked.src)
                : -1;
              if (lightboxIdx >= 0) {
                setLightboxIndex(lightboxIdx);
                setLightboxOpen(true);
              }
            }}
          />
        </Section>
      )}

      {lightboxOpen && (
        <Lightbox
          key={lightboxIndex}
          images={allLightboxImages}
          isOpen={lightboxOpen}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
