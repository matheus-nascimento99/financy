import type { ComponentProps } from 'react'
import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

type SelectSize = 'sm' | 'md' | 'lg'
type SelectState = 'empty' | 'active' | 'filled' | 'error' | 'disabled'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<ComponentProps<'select'>, 'size'> {
  size?: SelectSize
  state?: SelectState
  error?: boolean
  options: SelectOption[]
  placeholder?: string
}

const sizeStyles: Record<SelectSize, string> = {
  sm: 'px-3 py-2 text-sm h-8',
  md: 'px-4 py-2 text-base h-10',
  lg: 'px-4 py-3 text-lg h-12',
}

const stateStyles: Record<SelectState, string> = {
  empty: 'border border-border-primary bg-bg-primary text-text-primary',
  active: 'border-2 border-accent-primary bg-bg-primary text-text-heading focus:outline-none',
  filled: 'border border-accent-border bg-accent-bg text-text-heading',
  error: 'border-2 border-danger bg-red-50 text-danger focus:outline-none',
  disabled: 'border border-border-primary bg-code-bg text-text-primary/50 cursor-not-allowed',
}

const baseStyles = 'rounded-lg font-sans transition-all duration-200 focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50 appearance-none bg-no-repeat'

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      size = 'md',
      state = 'empty',
      error = false,
      disabled = false,
      options,
      placeholder,
      className,
      ...props
    },
    ref
  ) => {
    const currentState = error ? 'error' : disabled ? 'disabled' : state
    const styles = twMerge(
      baseStyles,
      sizeStyles[size],
      stateStyles[currentState],
      'pr-8',
      className
    )

    return (
      <select
        ref={ref}
        disabled={disabled}
        className={styles}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }
)

Select.displayName = 'Select'
