"use client";

import { useState, useMemo } from "react";
import { MasonryGallery } from "@/components/masonry-gallery";
import { Lightbox } from "@/components/lightbox";
import type { LightboxImage } from "@/components/lightbox";
import type { GalleryImage } from "@/components/masonry-gallery";
import { buildImageUrl } from "@/lib/image-url";

function toLightboxImages(images: GalleryImage[]): LightboxImage[] {
  return images
    .filter((item) => item.image.filename)
    .map((item) => {
      const src = buildImageUrl(item.image.filename, item.image.folder) || "";
      const alt = item.image.alt || item.image.filename || "Gallery image";
      return { src, alt, caption: item.caption };
    });
}

interface ProjectGallerySectionProps {
  images: GalleryImage[];
}

export function ProjectGallerySection({ images }: ProjectGallerySectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const lightboxImages = useMemo(() => toLightboxImages(images), [images]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <MasonryGallery
        images={images}
        onImageClick={(index) => {
          setLightboxIndex(index);
          setLightboxOpen(true);
        }}
      />

      {lightboxOpen && (
        <Lightbox
          key={lightboxIndex}
          images={lightboxImages}
          isOpen={lightboxOpen}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
