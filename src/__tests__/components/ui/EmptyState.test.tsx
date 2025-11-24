import { render, screen, fireEvent } from '@testing-library/react';

import { EmptyState } from '@/components/ui/EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No items found" />);
    
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <EmptyState 
        title="Empty" 
        description="Try adding some items" 
      />
    );
    
    expect(screen.getByText('Try adding some items')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<EmptyState title="Empty" />);
    
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <EmptyState 
        title="Empty" 
        icon={<span data-testid="custom-icon">📭</span>} 
      />
    );
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders action button when provided', () => {
    const onClick = jest.fn();
    render(
      <EmptyState 
        title="Empty" 
        action={{ label: 'Add Item', onClick }} 
      />
    );
    
    const button = screen.getByRole('button', { name: 'Add Item' });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when action button is clicked', () => {
    const onClick = jest.fn();
    render(
      <EmptyState 
        title="Empty" 
        action={{ label: 'Add Item', onClick }} 
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: 'Add Item' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not render action button when not provided', () => {
    render(<EmptyState title="Empty" />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('has role="status" for accessibility', () => {
    render(<EmptyState title="Empty" />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders all elements together', () => {
    const onClick = jest.fn();
    render(
      <EmptyState
        title="No Movies"
        description="Your watchlist is empty"
        icon={<span data-testid="icon">🎬</span>}
        action={{ label: 'Browse Movies', onClick }}
      />
    );
    
    expect(screen.getByText('No Movies')).toBeInTheDocument();
    expect(screen.getByText('Your watchlist is empty')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Browse Movies' })).toBeInTheDocument();
  });
});
