import type { ReactNode } from 'react'

interface SettingGroupProps {
  label: string
  accentColor?: string
  children: ReactNode
}

export function SettingGroup({ label, accentColor = 'bg-emerald-500', children }: SettingGroupProps) {
  return (
    <div className="animate-fade-up">
      <div className="mb-2 flex items-center gap-2 px-1">
        <div className={`h-4 w-1 rounded-full ${accentColor}`} />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
        {children}
      </div>
    </div>
  )
}
