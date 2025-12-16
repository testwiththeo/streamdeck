import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-shimmer rounded-xl', className)}
      aria-hidden="true"
    />
  );
}

export function PosterSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="mt-2 h-4 w-3/4 rounded-lg" />
      <Skeleton className="mt-1 h-3 w-1/2 rounded-lg" />
    </div>
  );
}

export function CarouselSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-40 rounded" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-[160px] flex-none">
            <PosterSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}