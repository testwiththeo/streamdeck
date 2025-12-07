import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  retryable?: boolean;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  retryable = true,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center" role="alert">
      <svg
        className="mb-4 h-16 w-16 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <h2 className="mb-2 text-lg font-semibold text-white">{title}</h2>
      <p className="max-w-sm text-sm text-zinc-400">{message}</p>
      {retryable && onRetry && (
        <Button variant="primary" size="sm" onClick={onRetry} className="mt-4">
          Try Again
        </Button>
      )}
    </div>
  );
}
