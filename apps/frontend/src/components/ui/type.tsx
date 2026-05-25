import type { ComponentProps, ReactNode } from 'react'
import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { ArrowDown, ArrowUp } from 'lucide-react'

type TransactionType = 'entrada' | 'saida'

interface TypeProps extends ComponentProps<'div'> {
  type: TransactionType
  label?: string
  icon?: ReactNode
}

const typeStyles: Record<TransactionType, { text: string; icon: ReactNode }> = {
  entrada: {
    text: 'text-green',
    icon: <ArrowUp className="h-4 w-4" />,
  },
  saida: {
    text: 'text-red',
    icon: <ArrowDown className="h-4 w-4" />,
  },
}

const baseStyles = 'inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full'

export const Type = forwardRef<HTMLDivElement, TypeProps>(
  (
    { type, label, icon, className, ...props },
    ref
  ) => {
    const styles = typeStyles[type]
    const finalIcon = icon || styles.icon

    const mergedClasses = twMerge(
      baseStyles,
      styles.text,
      className
    )

    return (
      <div ref={ref} className={mergedClasses} {...props}>
        {finalIcon}
        {label || (type === 'entrada' ? 'Entrada' : 'Saída')}
      </div>
    )
  }
)

Type.displayName = 'Type'
