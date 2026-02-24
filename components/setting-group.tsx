import type { ReactNode } from 'react'
import { ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react'

interface SettingGroupProps {
  label: string
  accentColor?: string
  gradientFrom?: string
  gradientTo?: string
  children: ReactNode
  isCollapsible?: boolean
  isExpanded?: boolean
  onToggle?: () => void
  icon?: LucideIcon
}

export function SettingGroup({ 
  label, 
  accentColor = 'bg-emerald-500',
  gradientFrom = 'from-emerald-600/20',
  gradientTo = 'to-emerald-600/10',
  children,
  isCollapsible = false,
  isExpanded = true,
  onToggle,
  icon: Icon
}: SettingGroupProps) {
  const Header = isCollapsible ? 'button' : 'div'
  
  return (
    <div className="animate-fade-up">
      {isCollapsible && !isExpanded ? (
        <Header 
          onClick={onToggle}
          className={`group mb-3 flex w-full items-center gap-4 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} p-4 border border-white/5 text-left outline-none transition-all active:scale-[0.98]`}
        >
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentColor}/20`}>
            {Icon && <Icon className="h-5 w-5 text-foreground/80" />}
          </div>
          <span className="flex-1 text-sm font-bold text-foreground/90">{label}</span>
          <ChevronDown className="h-5 w-5 text-foreground/40 transition-transform group-active:scale-90" />
        </Header>
      ) : (
        <>
          <Header 
            onClick={isCollapsible ? onToggle : undefined}
            className={`mb-2 flex w-full items-center gap-2 px-1 text-left outline-none ${isCollapsible ? 'active:opacity-70' : ''}`}
          >
            <div className={`h-4 w-1 rounded-full ${accentColor}`} />
            {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
            <span className="flex-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
            {isCollapsible && <ChevronUp className="h-4 w-4 text-muted-foreground/60" />}
          </Header>
          <div className={`overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 ${isCollapsible && !isExpanded ? 'max-h-0 border-transparent opacity-0' : 'max-h-[2000px] opacity-100'}`}>
            {children}
          </div>
        </>
      )}
    </div>
  )
}

