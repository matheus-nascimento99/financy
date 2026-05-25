import type { ReactNode } from 'react'
import { ArrowUpDown, Tag, Utensils } from 'lucide-react'

interface CategoriesSummaryCardsProps {
  totalCategories: number
  totalTransactions: number
  mostUsedCategory: { name: string } | null
}

interface SummaryCardProps {
  icon: ReactNode
  iconClassName: string
  value: ReactNode
  label: string
}

function SummaryCard({ icon, iconClassName, value, label }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-border-primary bg-white p-6 shadow-sm shadow-slate-200/40">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-3xl font-semibold text-text-heading">{value}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-text-primary">
            {label}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CategoriesSummaryCards({
  totalCategories,
  totalTransactions,
  mostUsedCategory,
}: CategoriesSummaryCardsProps) {
  const mostUsedValue = mostUsedCategory?.name ?? '—'

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <SummaryCard
        icon={<Tag className="h-6 w-6 text-gray-700" strokeWidth={1.75} />}
        iconClassName="bg-gray-100"
        value={totalCategories}
        label="Total de categorias"
      />
      <SummaryCard
        icon={<ArrowUpDown className="h-6 w-6 text-purple-base" strokeWidth={1.75} />}
        iconClassName="bg-purple-light"
        value={totalTransactions}
        label="Total de transações"
      />
      <SummaryCard
        icon={<Utensils className="h-6 w-6 text-blue-base" strokeWidth={1.75} />}
        iconClassName="bg-blue-light"
        value={mostUsedValue}
        label="Categoria mais utilizada"
      />
    </section>
  )
}
