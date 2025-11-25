import { render, screen, fireEvent } from '@testing-library/react';

import { ErrorState } from '@/components/ui/ErrorState';

describe('ErrorState', () => {
  it('renders default title', () => {
    render(<ErrorState />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders default message', () => {
    render(<ErrorState />);
    
    expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<ErrorState title="Connection Failed" />);
    
    expect(screen.getByText('Connection Failed')).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<ErrorState message="Unable to connect to the server" />);
    
    expect(screen.getByText('Unable to connect to the server')).toBeInTheDocument();
  });

  it('renders error icon', () => {
    render(<ErrorState />);
    
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('text-red-500');
  });

  it('renders retry button when retryable and onRetry provided', () => {
    const onRetry = jest.fn();
    render(<ErrorState retryable onRetry={onRetry} />);
    
    const button = screen.getByRole('button', { name: 'Try Again' });
    expect(button).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    render(<ErrorState retryable onRetry={onRetry} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not render retry button when retryable is false', () => {
    const onRetry = jest.fn();
    render(<ErrorState retryable={false} onRetry={onRetry} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not render retry button when onRetry not provided', () => {
    render(<ErrorState retryable />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('has role="alert" for accessibility', () => {
    render(<ErrorState />);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders all custom elements together', () => {
    const onRetry = jest.fn();
    render(
      <ErrorState
        title="Oops!"
        message="Something broke"
        retryable
        onRetry={onRetry}
      />
    );
    
    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Something broke')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
  });
});
