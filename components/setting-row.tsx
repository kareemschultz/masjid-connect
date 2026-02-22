'use client'

import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { IconSquare } from './icon-square'

interface SettingRowProps {
  icon: LucideIcon
  iconColor: string
  label: string
  value?: string
  isLast?: boolean
  onClick?: () => void
  rightElement?: React.ReactNode
  badge?: React.ReactNode
}

export function SettingRow({
  icon,
  iconColor,
  label,
  value,
  isLast,
  onClick,
  rightElement,
  badge,
}: SettingRowProps) {
  const Comp = onClick ? 'button' : 'div'

  return (
    <Comp
      onClick={onClick}
      className={`flex min-h-[52px] w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-white/5 ${
        !isLast ? 'border-b border-gray-800/50' : ''
      }`}
    >
      <IconSquare icon={icon} color={iconColor} />
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      {badge}
      {rightElement}
      {value && (
        <span className="text-sm text-emerald-400">{value}</span>
      )}
      {onClick && !rightElement && (
        <ChevronRight className="h-4 w-4 text-gray-600" />
      )}
    </Comp>
  )
}
