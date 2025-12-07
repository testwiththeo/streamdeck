import Image from 'next/image';

import { cn } from '@/lib/utils/cn';

interface PosterImageProps {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'original';
}

const SIZE_MAP = {
  sm: 'w185',
  md: 'w342',
  lg: 'w500',
  original: 'original',
};

export function PosterImage({
  src,
  alt,
  className,
  priority = false,
  size = 'md',
}: PosterImageProps) {
  const imageUrl = src
    ? `https://image.tmdb.org/t/p/${SIZE_MAP[size]}${src}`
    : '/placeholder-poster.jpg';

  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-zinc-800', className)}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
