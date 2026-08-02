import { buildImageUrl } from '@/lib/image-url';
import type { LightboxImage } from '@/components/lightbox';

export function extractLexicalUploads(node: unknown): LightboxImage[] {
  if (!node) return [];
  if (typeof node !== 'object') return [];

  const results: LightboxImage[] = [];

  if (Array.isArray(node)) {
    for (const item of node) {
      results.push(...extractLexicalUploads(item));
    }
    return results;
  }

  const n = node as Record<string, unknown>;

  // Check if this is an upload node
  if (n.type === 'upload') {
    const fields = n.fields as Record<string, unknown> | undefined;
    const value = n.value;

    // Determine filename, folder, and mimeType from populated value
    let filename: string | null = null;
    let folder: string | null = null;
    let mimeType = '';

    if (typeof value === 'object' && value !== null) {
      const media = value as Record<string, unknown>;
      mimeType = typeof media.mimeType === 'string' ? media.mimeType : '';
      filename = typeof media.filename === 'string' ? media.filename : null;
      folder = typeof media.folder === 'string' ? media.folder : null;
    }

    // Allow non-image uploads to pass (PDFs etc. may have thumbnails);
    // skip only when mimeType is explicitly non-empty and non-image
    if (mimeType && !mimeType.startsWith('image/')) {
      // not an image, skip but continue recursion
      // (don't push to results)
    } else if (filename) {
      const alt =
        (fields?.alt as string) ||
        (typeof value === 'object' && value !== null
          ? ((value as Record<string, unknown>).alt as string)
          : undefined) ||
        filename ||
        'Image';
      const src = buildImageUrl(filename, folder);
      if (src) {
        results.push({ src, alt, caption: null });
      }
    }
  }

  // Recurse into children, root, and any array properties
  if (n.root) results.push(...extractLexicalUploads(n.root));
  if (Array.isArray(n.children)) results.push(...extractLexicalUploads(n.children));

  return results;
}
