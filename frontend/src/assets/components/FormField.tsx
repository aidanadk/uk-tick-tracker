import type { ReactNode } from 'react'

type FormFieldProps = {
  id: string
  label: string
  hint?: string
  error?: string
  children: ReactNode
}

export default function FormField({
  id,
  label,
  hint,
  error,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-title block text-base font-semibold"
      >
        {label}
      </label>

      {hint && (
        <p id={`${id}-hint`} className="text-text mt-1 text-sm">
          {hint}
        </p>
      )}

      <div className="mt-2">{children}</div>

      {error && (
        <p
          id={`${id}-error`}
          className="mt-2 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  )
}