"use client";

import { useState } from "react";
import { ProjectImage } from "./project-image";
import { buildImagePath } from "@/lib/image-url";

export interface GalleryImage {
  id?: string | null;
  image: { filename?: string | null; folder?: string | null; alt?: string | null };
  caption?: string | null;
}

interface MasonryGalleryProps {
  images: GalleryImage[];
  pageSize?: number;
  onImageClick?: (index: number) => void;
}

function getImagePath(imageObj: GalleryImage["image"]): string | null {
  return buildImagePath(imageObj.filename, imageObj.folder);
}

function getImageAlt(imageObj: GalleryImage["image"]): string {
  return imageObj.alt || imageObj.filename || "Gallery image";
}

export function MasonryGallery({
  images,
  pageSize = 8,
  onImageClick,
}: MasonryGalleryProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  if (!images || images.length === 0) {
    return null;
  }

  const visible = images.slice(0, visibleCount);
  const remaining = images.length - visibleCount;
  const hasMore = remaining > 0;

  return (
    <div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {visible.map((item, i) => {
          const imagePath = getImagePath(item.image);
          const alt = getImageAlt(item.image);
          const globalIndex = i;

          return (
            <div
              key={item.id ?? i}
              className="break-inside-avoid overflow-hidden rounded-xl border border-wood-200 bg-white group cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onImageClick?.(globalIndex)}
              role={onImageClick ? "button" : undefined}
              tabIndex={onImageClick ? 0 : undefined}
              onKeyDown={(e) => {
                if (onImageClick && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onImageClick(globalIndex);
                }
              }}
            >
              {imagePath ? (
                <div className="relative">
                  <ProjectImage
                    path={imagePath}
                    alt={alt}
                    width={800}
                    height={600}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-auto block"
                  />
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-wood-400 text-sm bg-wood-100">
                  No image
                </div>
              )}
              {item.caption && (
                <div className="p-3">
                  <p className="text-sm text-wood-600">{item.caption}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((prev) =>
                Math.min(prev + pageSize, images.length)
              )
            }
            className="inline-flex items-center px-5 py-2.5 rounded-full border border-wood-300 text-wood-700 text-sm font-medium hover:bg-wood-50 transition-colors"
          >
            +{remaining} more
          </button>
        </div>
      )}
    </div>
  );
}
