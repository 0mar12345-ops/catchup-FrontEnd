interface AvatarProps {
  initials: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
  bgColor?: string
}

export function Avatar({ initials, name, size = 'md', bgColor = '#3D3580' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full text-white font-semibold flex-shrink-0`}
      style={{ backgroundColor: bgColor }}
      title={name}
    >
      {initials}
    </div>
  )
}
