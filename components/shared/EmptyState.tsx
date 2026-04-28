import { Button } from './Button'

interface EmptyStateProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ReactNode
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && <div className="mb-4 text-4xl opacity-50">{icon}</div>}
      <h3 className="heading-sm mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="primary" size="md">
          {action.label}
        </Button>
      )}
    </div>
  )
}
