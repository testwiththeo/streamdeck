import { render, screen } from '@testing-library/react';

import { Skeleton, PosterSkeleton, CarouselSkeleton } from '@/components/ui/Skeleton';

describe('Skeleton', () => {
  it('renders with aria-hidden', () => {
    render(<Skeleton />);
    
    const skeleton = document.querySelector('[aria-hidden="true"]');
    expect(skeleton).toBeInTheDocument();
  });

  it('has animation classes', () => {
    render(<Skeleton />);
    
    const skeleton = document.querySelector('[aria-hidden="true"]');
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('applies custom className', () => {
    render(<Skeleton className="h-10 w-full" />);
    
    const skeleton = document.querySelector('[aria-hidden="true"]');
    expect(skeleton).toHaveClass('h-10', 'w-full');
  });

  it('has base styling', () => {
    render(<Skeleton />);
    
    const skeleton = document.querySelector('[aria-hidden="true"]');
    expect(skeleton).toHaveClass('rounded-md', 'bg-zinc-800');
  });
});

describe('PosterSkeleton', () => {
  it('renders multiple skeleton elements', () => {
    const { container } = render(<PosterSkeleton />);
    
    const skeletons = container.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBe(3);
  });

  it('renders poster aspect ratio skeleton', () => {
    const { container } = render(<PosterSkeleton />);
    
    const poster = container.querySelector('.aspect-\\[2\\/3\\]');
    expect(poster).toBeInTheDocument();
  });

  it('renders title and subtitle skeletons', () => {
    const { container } = render(<PosterSkeleton />);
    
    expect(container.querySelector('.h-4')).toBeInTheDocument();
    expect(container.querySelector('.h-3')).toBeInTheDocument();
  });
});

describe('CarouselSkeleton', () => {
  it('renders heading skeleton', () => {
    const { container } = render(<CarouselSkeleton />);
    
    const heading = container.querySelector('.h-6');
    expect(heading).toBeInTheDocument();
  });

  it('renders 6 poster skeletons', () => {
    const { container } = render(<CarouselSkeleton />);
    
    const posterContainers = container.querySelectorAll('.space-y-2');
    expect(posterContainers.length).toBe(6);
  });

  it('has flex container for posters', () => {
    const { container } = render(<CarouselSkeleton />);
    
    const flexContainer = container.querySelector('.flex.gap-4');
    expect(flexContainer).toBeInTheDocument();
  });
});
