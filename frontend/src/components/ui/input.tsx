import type { ComponentProps } from 'react'
import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

type InputSize = 'sm' | 'md' | 'lg'
type InputState = 'empty' | 'active' | 'filled' | 'error' | 'disabled'

interface InputProps extends Omit<ComponentProps<'input'>, 'size'> {
  size?: InputSize
  state?: InputState
  error?: boolean
  label?: string
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'px-3 py-2 text-sm h-8',
  md: 'px-4 py-2 text-base h-10',
  lg: 'px-4 py-3 text-lg h-12',
}

const stateStyles: Record<InputState, string> = {
  empty: 'border border-border-primary bg-bg-primary text-text-primary placeholder-text-primary/50',
  active: 'border-2 border-accent-primary bg-bg-primary text-text-heading focus:outline-none',
  filled: 'border border-accent-border bg-accent-bg text-text-heading',
  error: 'border-2 border-danger bg-red-50 text-danger focus:outline-none',
  disabled: 'border border-border-primary bg-code-bg text-text-primary/50 cursor-not-allowed',
}

const baseStyles =
  'w-full rounded-lg font-sans transition-all duration-200 focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      state = 'empty',
      error = false,
      disabled = false,
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
      className
    )

    return (
      <input
        ref={ref}
        disabled={disabled}
        className={styles}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
