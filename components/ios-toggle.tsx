'use client'

interface IOSToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export function IOSToggle({ checked, onChange, disabled }: IOSToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-emerald-500' : 'bg-gray-600'
      } ${disabled ? 'opacity-50' : ''}`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
