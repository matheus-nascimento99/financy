import type { ComponentProps, ReactNode } from 'react'
import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'icon' | 'label' | 'pagination' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<ComponentProps<'button'>, 'size'> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  label?: string
  isActive?: boolean
  number?: number | string
  underline?: boolean
}

interface LinkProps extends ComponentProps<'a'> {
  variant?: 'link'
  size?: ButtonSize
  underline?: boolean
}

// Base styles
const baseStyles = 'font-sans font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-base disabled:cursor-not-allowed'

// Variant styles
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-base text-white hover:bg-brand-base/90 active:bg-brand-base/80 disabled:bg-brand-base/50 inline-flex items-center justify-center rounded-lg',
  secondary: 'bg-secondary text-white hover:bg-secondary/90 active:bg-secondary/80 disabled:bg-secondary/50 inline-flex items-center justify-center rounded-lg',
  danger: 'bg-danger text-white hover:bg-danger/90 active:bg-danger/80 disabled:bg-danger/50 inline-flex items-center justify-center rounded-lg',
  icon: 'text-text-heading hover:bg-accent-bg hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center rounded-lg',
  label: 'bg-brand-base text-white hover:bg-brand-base/90 active:bg-brand-base/80 disabled:bg-brand-base/50 inline-flex items-center justify-center gap-2 rounded-lg',
  pagination: 'inline-flex items-center justify-center rounded-lg font-medium border transition-all duration-200',
  link: 'text-brand-base hover:opacity-80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-base rounded inline-block',
}

// Size styles
const sizeStyles: Record<ButtonSize, Record<ButtonVariant, string>> = {
  sm: {
    primary: 'px-3 py-2 text-sm h-8',
    secondary: 'px-3 py-2 text-sm h-8',
    danger: 'px-3 py-2 text-sm h-8',
    icon: 'p-2 w-8 h-8',
    label: 'px-3 py-2 text-sm gap-2',
    pagination: 'w-10 h-10',
    link: 'text-sm',
  },
  md: {
    primary: 'px-4 py-2 text-base h-10',
    secondary: 'px-4 py-2 text-base h-10',
    danger: 'px-4 py-2 text-base h-10',
    icon: 'p-2.5 w-10 h-10',
    label: 'px-4 py-2 text-base gap-2',
    pagination: 'w-10 h-10',
    link: 'text-base',
  },
  lg: {
    primary: 'px-6 py-3 text-lg h-12',
    secondary: 'px-6 py-3 text-lg h-12',
    danger: 'px-6 py-3 text-lg h-12',
    icon: 'p-3 w-12 h-12',
    label: 'px-6 py-3 text-lg gap-2',
    pagination: 'w-10 h-10',
    link: 'text-lg',
  },
}

// Pagination specific styles
const paginationStyles = {
  inactive: 'bg-bg-primary text-text-primary border border-border-primary hover:bg-code-bg hover:text-text-heading',
  active: 'bg-brand-base text-white hover:bg-brand-base/90',
  disabled: 'bg-code-bg text-text-primary/50 cursor-not-allowed border border-border-primary',
}

// Link underline styles
const linkUnderlineStyles = {
  with: 'underline hover:no-underline',
  without: 'hover:underline',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      label,
      isActive = false,
      disabled = false,
      number,
      underline = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Handle pagination button styling
    if (variant === 'pagination') {
      let paginationClass = ''
      if (disabled) {
        paginationClass = paginationStyles.disabled
      } else if (isActive) {
        paginationClass = paginationStyles.active
      } else {
        paginationClass = paginationStyles.inactive
      }

      const styles = twMerge(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size][variant],
        paginationClass,
        className
      )

      return (
        <button
          ref={ref}
          disabled={disabled}
          className={styles}
          {...props}
        >
          {number}
        </button>
      )
    }

    // Handle icon button
    if (variant === 'icon') {
      const styles = twMerge(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size][variant],
        className
      )

      return (
        <button
          ref={ref}
          disabled={disabled}
          className={styles}
          {...props}
        >
          {icon}
        </button>
      )
    }

    // Handle label button (icon + text)
    if (variant === 'label') {
      const styles = twMerge(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size][variant],
        className
      )

      return (
        <button
          ref={ref}
          disabled={disabled}
          className={styles}
          {...props}
        >
          {icon}
          {label || children}
        </button>
      )
    }

    // Handle link variant as a styled button
    if (variant === 'link') {
      const underlineClass = underline ? linkUnderlineStyles.with : linkUnderlineStyles.without
      const styles = twMerge(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size][variant],
        underlineClass,
        className
      )

      return (
        <button
          ref={ref}
          disabled={disabled}
          className={styles}
          {...props}
        >
          {children}
        </button>
      )
    }

    // Handle regular button (primary, secondary, danger)
    const styles = twMerge(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size][variant],
      className
    )

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={styles}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

// Link component using Button with link variant
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ underline = true, className, ...props }, ref) => {
    const underlineClass = underline ? linkUnderlineStyles.with : linkUnderlineStyles.without
    const styles = twMerge(
      'text-brand-base transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-base rounded inline-block',
      underlineClass,
      className
    )

    return <a ref={ref} className={styles} {...props} />
  }
)

Link.displayName = 'Link'
