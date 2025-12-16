import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center" role="status">
      {icon && <div className="mb-4 text-text-muted">{icon}</div>}
      <h2 className="mb-2 text-lg font-semibold text-text-primary">{title}</h2>
      {description && <p className="max-w-sm text-sm text-text-tertiary">{description}</p>}
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}
