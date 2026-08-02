'use client';

import { MasonryGallery } from '@/components/masonry-gallery';
import type { LightboxImage } from '@/components/lightbox';
import type { GalleryImage } from '@/components/masonry-gallery';
import { buildImageUrl } from '@/lib/image-url';

export function toLightboxImages(images: GalleryImage[]): LightboxImage[] {
  return images
    .filter((item) => item.image.filename)
    .map((item) => {
      const src = buildImageUrl(item.image.filename, item.image.folder) || '';
      const alt = item.image.alt || item.image.filename || 'Gallery image';
      return { src, alt, caption: item.caption };
    });
}

interface ProjectGallerySectionProps {
  images: GalleryImage[];
  onImageClick?: (index: number) => void;
}

export function ProjectGallerySection({ images, onImageClick }: ProjectGallerySectionProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return <MasonryGallery images={images} onImageClick={onImageClick} />;
}
