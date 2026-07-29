import Image from 'next/image'

interface ProjectImageProps {
  src?: string | null
  alt?: string | null
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  sizes?: string
  className?: string
}

export function ProjectImage({
  src,
  alt = '',
  width,
  height,
  fill,
  priority,
  sizes,
  className,
}: ProjectImageProps) {
  if (!src) {
    if (fill) {
      return <div className={`bg-wood-200 ${className ?? ''}`} />
    }
    return (
      <div
        className={`bg-wood-200 ${className ?? ''}`}
        style={{ width: width ?? 400, height: height ?? 300 }}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt ?? ''}
      width={!fill ? (width ?? 1200) : undefined}
      height={!fill ? (height ?? 900) : undefined}
      fill={fill}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      sizes={sizes}
      className={className}
    />
  )
}
