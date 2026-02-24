import type { ReactNode } from 'react'
import { ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react'

interface SettingGroupProps {
  label: string
  accentColor?: string
  children: ReactNode
  isCollapsible?: boolean
  isExpanded?: boolean
  onToggle?: () => void
  icon?: LucideIcon
}

export function SettingGroup({ 
  label, 
  accentColor = 'bg-emerald-500', 
  children,
  isCollapsible = false,
  isExpanded = true,
  onToggle,
  icon: Icon
}: SettingGroupProps) {
  const Header = isCollapsible ? 'button' : 'div'
  
  return (
    <div className="animate-fade-up">
      <Header 
        onClick={isCollapsible ? onToggle : undefined}
        className={`mb-2 flex w-full items-center gap-2 px-1 text-left outline-none ${isCollapsible ? 'active:opacity-70' : ''}`}
      >
        <div className={`h-4 w-1 rounded-full ${accentColor}`} />
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        <span className="flex-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
        {isCollapsible && (
          isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/60" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/60" />
        )}
      </Header>
      <div className={`overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 ${isCollapsible && !isExpanded ? 'max-h-0 border-transparent opacity-0' : 'max-h-[2000px] opacity-100'}`}>
        {children}
      </div>
    </div>
  )
}

