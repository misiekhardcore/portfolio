import Image from 'next/image';

type ProjectImageProps = {
  path: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  className?: string;
};

export function ProjectImage({
  path,
  alt,
  width,
  height,
  priority,
  fill,
  sizes,
  className,
}: ProjectImageProps) {
  const src = `/api/images/${path}`;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      fill={fill}
      sizes={sizes}
      className={className}
    />
  );
}
