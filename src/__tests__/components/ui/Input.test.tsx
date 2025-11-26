import { render, screen, fireEvent } from '@testing-library/react';

import { Input } from '@/components/ui/Input';

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />);
    
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const onChange = jest.fn();
    render(<Input onChange={onChange} placeholder="Enter text" />);
    
    fireEvent.change(screen.getByPlaceholderText('Enter text'), {
      target: { value: 'new value' },
    });
    
    expect(onChange).toHaveBeenCalled();
  });

  it('renders with icon', () => {
    render(<Input icon={<span data-testid="icon">🔍</span>} placeholder="Search" />);
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('adjusts padding when icon is present', () => {
    render(<Input icon={<span>🔍</span>} placeholder="Search" />);
    
    const input = screen.getByPlaceholderText('Search');
    expect(input).toHaveClass('pl-10');
  });

  it('does not add icon padding when no icon', () => {
    render(<Input placeholder="No icon" />);
    
    const input = screen.getByPlaceholderText('No icon');
    expect(input).not.toHaveClass('pl-10');
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" placeholder="Custom" />);
    
    const input = screen.getByPlaceholderText('Custom');
    expect(input).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = jest.fn();
    render(<Input ref={ref} placeholder="Ref" />);
    
    expect(ref).toHaveBeenCalled();
  });

  it('passes through native input attributes', () => {
    render(<Input type="email" name="email" autoComplete="email" placeholder="Email" />);
    
    const input = screen.getByPlaceholderText('Email');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('autoComplete', 'email');
  });

  it('can be controlled', () => {
    const { rerender } = render(<Input value="initial" placeholder="Controlled" readOnly />);
    
    expect(screen.getByPlaceholderText('Controlled')).toHaveValue('initial');
    
    rerender(<Input value="updated" placeholder="Controlled" readOnly />);
    expect(screen.getByPlaceholderText('Controlled')).toHaveValue('updated');
  });

  it('has focus styles', () => {
    render(<Input placeholder="Focus" />);
    
    const input = screen.getByPlaceholderText('Focus');
    expect(input).toHaveClass('focus:border-red-500', 'focus:ring-1');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled" />);
    
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
  });

  it('renders icon in correct position', () => {
    const { container } = render(
      <Input icon={<span data-testid="icon">🔍</span>} placeholder="Search" />
    );
    
    const iconWrapper = container.querySelector('.absolute');
    expect(iconWrapper).toHaveClass('left-3', 'top-1/2', '-translate-y-1/2');
  });
});
