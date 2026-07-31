"use client";

import type { SerializedEditorState } from "lexical";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { useCallback, useMemo } from "react";
import type { LightboxImage } from "@/components/lightbox";

interface RichTextWithLightboxProps {
  data: SerializedEditorState;
  inlineImages: LightboxImage[];
  onImageClick: (index: number) => void;
}

export function RichTextWithLightbox({
  data,
  inlineImages,
  onImageClick,
}: RichTextWithLightboxProps) {
  const { srcToIndex, filenameToIndex } = useMemo(() => {
    const srcMap = new Map<string, number>();
    const filenameMap = new Map<string, number>();
    inlineImages.forEach((img, index) => {
      srcMap.set(img.src, index);
      const filename = img.src.split("/").pop();
      if (filename) filenameMap.set(filename, index);
    });
    return { srcToIndex: srcMap, filenameToIndex: filenameMap };
  }, [inlineImages]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const picture = (e.target as HTMLElement).closest("picture");
      const img = picture
        ? picture.querySelector("img")
        : (e.target as HTMLElement).closest("img");

      if (!(img instanceof HTMLImageElement)) return;

      let index: number | undefined;

      // Try the raw src attribute first (relative URL from inlineImages)
      const rawSrc = img.getAttribute("src");
      index = rawSrc ? srcToIndex.get(rawSrc) : undefined;

      // Fall back to the resolved src (absolute URL, try pathname match)
      if (index === undefined) {
        try {
          const imgUrl = new URL(img.src);
          index = srcToIndex.get(imgUrl.pathname);
        } catch {
          // img.src isn't a valid URL, give up
        }
      }

      // Fall back to matching by filename (handles mismatched URL prefixes)
      if (index === undefined) {
        const srcToCheck = rawSrc || img.src;
        const filename = srcToCheck.split("/").pop()?.split("?")[0];
        if (filename) index = filenameToIndex.get(filename);
      }

      if (index !== undefined) {
        onImageClick(index);
      }
    },
    [srcToIndex, filenameToIndex, onImageClick],
  );

  return (
    <div onClick={handleClick}>
      <RichText data={data} />
    </div>
  );
}
