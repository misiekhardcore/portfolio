import { type ReactNode } from 'react'

interface LexicalNode {
  type: string
  children?: LexicalNode[]
  text?: string
  format?: number
}

interface RichTextProps {
  content?: { root: LexicalNode } | null
}

function renderNode(node: LexicalNode, key: number): ReactNode {
  if (node.type === 'paragraph') {
    return (
      <p key={key} className="mb-4 last:mb-0">
        {node.children?.map((child, i) => renderNode(child, i))}
      </p>
    )
  }
  if (node.type === 'text') {
    const text = node.text ?? ''
    const isBold = (node.format ?? 0) & 1
    if (isBold) return <strong key={key}>{text}</strong>
    return <>{text}</>
  }
  return null
}

export function RichText({ content }: RichTextProps) {
  if (!content?.root?.children) return null
  return <div>{content.root.children.map((node, i) => renderNode(node, i))}</div>
}
