interface DashboardSummaryCardsProps {
  totalBalance: number
  totalIncome: number
  totalExpense: number
}

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function SummaryCard({ title, value, label, badgeClass }: { title: string; value: number; label: string; badgeClass: string }) {
  return (
    <div className="rounded-4xl border border-border-primary bg-white p-6 shadow-sm shadow-slate-200/40">
      <p className="text-sm font-medium text-text-primary">{title}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-semibold text-text-heading">{formatter.format(value)}</p>
          <p className="mt-2 text-sm text-text-primary">{label}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${badgeClass}`}>{title}</span>
      </div>
    </div>
  )
}

export default function DashboardSummaryCards({ totalBalance, totalIncome, totalExpense }: DashboardSummaryCardsProps) {
  return (
    <section className="grid gap-5 lg:grid-cols-3">
      <SummaryCard title="Saldo total" value={totalBalance} label="Balanço entre receitas e despesas" badgeClass="bg-slate-700" />
      <SummaryCard title="Receitas do mês" value={totalIncome} label="Total de entradas" badgeClass="bg-emerald-600" />
      <SummaryCard title="Despesas do mês" value={totalExpense} label="Total de saídas" badgeClass="bg-rose-600" />
    </section>
  )
}
