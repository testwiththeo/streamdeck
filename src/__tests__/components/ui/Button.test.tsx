import { render, screen, fireEvent } from '@testing-library/react';

import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not fire onClick when disabled', () => {
    const onClick = jest.fn();
    render(<Button disabled onClick={onClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  describe('variants', () => {
    it('renders primary variant by default', () => {
      render(<Button>Primary</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-brand');
    });

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-surface-2/80');
    });

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-text-secondary');
    });

    it('renders danger variant', () => {
      render(<Button variant="danger">Danger</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-error');
    });
  });

  describe('sizes', () => {
    it('renders medium size by default', () => {
      render(<Button>Medium</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'px-4');
    });

    it('renders small size', () => {
      render(<Button size="sm">Small</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8', 'px-3');
    });

    it('renders large size', () => {
      render(<Button size="lg">Large</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12', 'px-6');
    });
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = jest.fn();
    render(<Button ref={ref}>Ref</Button>);
    
    expect(ref).toHaveBeenCalled();
  });

  it('passes through native button attributes', () => {
    render(<Button type="submit" form="my-form">Submit</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('form', 'my-form');
  });

  it('has focus styles', () => {
    render(<Button>Focus</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
  });
});
