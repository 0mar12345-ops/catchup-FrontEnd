import { statusConfig } from '@/lib/constants'

interface StatusBadgeProps {
  status: keyof typeof statusConfig
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status]
  
  if (!config) return null

  return (
    <div
      className={`inline-flex items-center rounded-full font-medium ${
        size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      }`}
      style={{
        backgroundColor: config.bg,
        color: config.color,
      }}
    >
      <span className="sr-only">{config.label}</span>
      {config.label}
    </div>
  )
}
