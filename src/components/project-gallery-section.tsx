"use client";

import { useState, useMemo } from "react";
import { MasonryGallery } from "@/components/masonry-gallery";
import { Lightbox } from "@/components/lightbox";
import type { LightboxImage } from "@/components/lightbox";
import type { GalleryImage } from "@/components/masonry-gallery";

function toLightboxImages(images: GalleryImage[]): LightboxImage[] {
  return images.map((item) => {
    const filename = item.image.filename;
    const folder = item.image.folder || "projects";
    const src = filename ? `/api/images/${folder}/${filename}` : "";
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

      <Lightbox
        images={lightboxImages}
        isOpen={lightboxOpen}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
