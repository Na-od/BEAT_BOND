import React from 'react'
import { Check } from 'lucide-react'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  className?: string
}

export function Checkbox({ checked, onChange, label, className = '' }: CheckboxProps) {
  return (
    <label className={`flex items-center space-x-2 cursor-pointer ${className}`}>
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
        checked 
          ? 'bg-primary-600 border-primary-600' 
          : 'border-neutral-300 hover:border-primary-400'
      }`}>
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
      <span className="text-sm text-neutral-700">{label}</span>
    </label>
  )
}