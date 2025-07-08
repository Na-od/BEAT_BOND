import React from 'react'

interface SliderProps {
  value: number[]
  onChange: (value: number[]) => void
  min: number
  max: number
  step: number
  className?: string
}

export function Slider({ value, onChange, min, max, step, className = '' }: SliderProps) {
  const handleChange = (index: number, newValue: number) => {
    const newValues = [...value]
    newValues[index] = newValue
    onChange(newValues)
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex space-x-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => handleChange(0, parseFloat(e.target.value))}
          className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={(e) => handleChange(1, parseFloat(e.target.value))}
          className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
      </div>
    </div>
  )
}