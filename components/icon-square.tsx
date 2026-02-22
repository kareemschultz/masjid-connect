import type { LucideIcon } from 'lucide-react'

interface IconSquareProps {
  icon: LucideIcon
  color: string
  size?: 'sm' | 'md'
}

export function IconSquare({ icon: Icon, color, size = 'md' }: IconSquareProps) {
  const sizes = {
    sm: 'h-8 w-8 rounded-lg',
    md: 'h-9 w-9 rounded-xl',
  }
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-[18px] w-[18px]',
  }

  return (
    <div className={`flex items-center justify-center ${sizes[size]} ${color}`}>
      <Icon className={`${iconSizes[size]} text-white`} />
    </div>
  )
}
