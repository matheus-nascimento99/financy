import { Plus } from 'lucide-react'
import { Button, Tag } from '../../components/ui'
import { formatTransactionDate } from '../transactions/utils'

interface TransactionCategory {
  id: string
  name: string
  color: string
}

interface DashboardTransaction {
  id: string
  description: string
  amount: number
  type: string
  date: string
  category: TransactionCategory
}

interface DashboardTransactionsProps {
  transactions: DashboardTransaction[]
  onNewTransaction: () => void
  onViewAll?: () => void
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function getTypeLabel(type: string) {
  return type.toLowerCase() === 'income' ? 'Receita' : 'Despesa'
}

export default function DashboardTransactions({
  transactions,
  onNewTransaction,
  onViewAll,
}: DashboardTransactionsProps) {
  const header = (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold uppercase tracking-wide text-text-heading">Transações recentes</h2>
      {onViewAll ? (
        <button type="button" onClick={onViewAll} className="text-sm text-text-primary transition hover:text-brand-base">
          Ver todas &gt;
        </button>
      ) : (
        <span className="text-sm text-text-primary">Ver todas &gt;</span>
      )}
    </div>
  )

  const newTransactionButton = (
    <div className="mt-6 flex justify-center border-t border-border-primary pt-6">
      <Button
        variant="label"
        size="md"
        onClick={onNewTransaction}
        icon={<Plus className="h-4 w-4" />}
        label="Nova transação"
        className="text-brand-base bg-transparent hover:bg-brand-base/10"
      />
    </div>
  )

  if (!transactions.length) {
    return (
      <section className="rounded-4xl border border-border-primary bg-white p-6 shadow-sm shadow-slate-200/40">
        {header}
        <p className="mt-6 text-sm text-text-primary">Nenhuma transação encontrada.</p>
        {newTransactionButton}
      </section>
    )
  }

  return (
    <section className="rounded-4xl border border-border-primary bg-white p-6 shadow-sm shadow-slate-200/40">
      {header}

      <div className="mt-6 space-y-4">
        {transactions.map((transaction) => {
          const isIncome = transaction.type.toLowerCase() === 'income'
          return (
            <div
              key={transaction.id}
              className="flex flex-col gap-4 rounded-3xl border border-border-primary bg-slate-50 p-5 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex flex-1 flex-col gap-3 md:max-w-xl">
                <p className="text-sm font-semibold text-text-heading">{transaction.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-text-primary">
                  <span>{formatTransactionDate(transaction.date)}</span>
                  <Tag color={isIncome ? 'green' : 'red'} label={getTypeLabel(transaction.type)} />
                  <span
                    className="rounded-full px-3 py-1 text-sm font-medium"
                    style={{ backgroundColor: `${transaction.category.color}20`, color: transaction.category.color }}
                  >
                    {transaction.category.name}
                  </span>
                </div>
              </div>
              <div className={`text-right text-lg font-semibold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isIncome ? '+' : '-'}{currencyFormatter.format(transaction.amount)}
              </div>
            </div>
          )
        })}
      </div>
      {newTransactionButton}
    </section>
  )
}
