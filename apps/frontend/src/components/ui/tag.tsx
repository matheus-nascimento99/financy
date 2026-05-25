import type { ComponentProps } from 'react'
import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export type TagColor = 'blue' | 'purple' | 'red' | 'orange' | 'yellow' | 'green'

interface TagProps extends ComponentProps<'div'> {
  color?: TagColor
  label: string
}

const colorStyles: Record<TagColor, string> = {
  blue: 'bg-blue/10 text-blue',
  purple: 'bg-purple/10 text-purple',
  red: 'bg-red/10 text-red',
  orange: 'bg-orange/10 text-orange',
  yellow: 'bg-yellow/10 text-yellow',
  green: 'bg-green/10 text-green',
}

const baseStyles = 'inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium'

export const Tag = forwardRef<HTMLDivElement, TagProps>(
  ({ color = 'blue', label, className, ...props }, ref) => {
    const styles = twMerge(baseStyles, colorStyles[color], className)

    return (
      <div ref={ref} className={styles} {...props}>
        {label}
      </div>
    )
  }
)

Tag.displayName = 'Tag'
