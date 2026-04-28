import React, { useEffect, useRef } from 'react'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  id?: string
  indeterminate?: boolean
}

export function Checkbox({ label, id, indeterminate, ...props }: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random()}`
  const checkboxRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate ?? false
    }
  }, [indeterminate])

  return (
    <div className="flex items-center gap-2">
      <input
        ref={checkboxRef}
        type="checkbox"
        id={checkboxId}
        className="w-4 h-4 rounded border-border bg-input cursor-pointer accent-primary"
        {...props}
      />
      {label && (
        <label htmlFor={checkboxId} className="text-sm font-medium text-foreground cursor-pointer">
          {label}
        </label>
      )}
    </div>
  )
}
