export function buildImageUrl(
  filename: string | null | undefined,
  folder?: string | null
): string | null {
  if (!filename) return null;
  const f = folder || 'projects';
  return `/api/images/${f}/${filename}`;
}

export function buildImagePath(
  filename: string | null | undefined,
  folder?: string | null
): string | null {
  if (!filename) return null;
  const f = folder || 'projects';
  return `${f}/${filename}`;
}

export function extractLexicalText(node: unknown): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node !== 'object') return '';
  const n = node as Record<string, unknown>;
  if (n.text && typeof n.text === 'string') return n.text;
  if (Array.isArray(n.children)) {
    return n.children.map(extractLexicalText).join(' ');
  }
  if (n.root) return extractLexicalText(n.root);
  return '';
}
