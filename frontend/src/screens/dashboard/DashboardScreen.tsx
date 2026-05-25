import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'
import DashboardHeader from './DashboardHeader'
import DashboardSummaryCards from './DashboardSummaryCards'
import DashboardTransactions from './DashboardTransactions'
import DashboardCategories from './DashboardCategories'
import CreateTransactionDialog from '../transactions/CreateTransactionDialog'
import { parseTransactionDate } from '../transactions/utils'

const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      transactions {
        id
        description
        amount
        type
        date
        category {
          id
          name
          color
        }
      }
      categories {
        id
        name
        color
      }
    }
  }
`

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

interface DashboardCategory {
  id: string
  name: string
  color: string
}

interface MeData {
  me: {
    id: string
    name: string
    email: string
    transactions: DashboardTransaction[]
    categories: DashboardCategory[]
  } | null
}

export default function DashboardScreen() {
  const navigate = useNavigate()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { data, loading, error, refetch } = useQuery<MeData>(ME_QUERY)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-7xl rounded-4xl border border-border-primary bg-white p-8 shadow-lg shadow-slate-200/50">
          <p className="text-center text-lg text-text-primary">Carregando painel...</p>
        </div>
      </div>
    )
  }

  if (error || !data?.me) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-7xl rounded-4xl border border-border-primary bg-white p-8 shadow-lg shadow-slate-200/50">
          <h1 className="text-xl font-semibold text-text-heading">Erro ao carregar o dashboard</h1>
          <p className="mt-4 text-sm text-text-primary">
            {error?.message ?? 'Não foi possível obter os dados do usuário.'}
          </p>
        </div>
      </div>
    )
  }

  const { name, transactions, categories } = data.me
  const sortedTransactions = [...transactions].sort(
    (a, b) => parseTransactionDate(b.date).getTime() - parseTransactionDate(a.date).getTime(),
  )

  const totalIncome = transactions
    .filter((transaction) => transaction.type.toLowerCase() === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const totalExpense = transactions
    .filter((transaction) => transaction.type.toLowerCase() !== 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const totalBalance = totalIncome - totalExpense

  const categoriesWithStats = categories.map((category) => {
    const categoryTransactions = transactions.filter(
      (transaction) => transaction.category.id === category.id,
    )
    return {
      ...category,
      total: categoryTransactions.reduce((sum, transaction) => sum + transaction.amount, 0),
      items: categoryTransactions.length,
    }
  })

  return (
    <main className="min-h-screen bg-slate-50">
      <AppHeader userName={name} />
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8">
        <DashboardHeader userName={name} />
        <DashboardSummaryCards
          totalBalance={totalBalance}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
        />

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <DashboardTransactions
            transactions={sortedTransactions.slice(0, 5)}
            onNewTransaction={() => setShowCreateDialog(true)}
            onViewAll={() => navigate('/transactions')}
          />
          <DashboardCategories
            categories={categoriesWithStats}
            onManage={() => navigate('/categories')}
          />
        </div>
      </div>

      {showCreateDialog && (
        <CreateTransactionDialog
          categories={categories}
          onClose={() => setShowCreateDialog(false)}
          onSuccess={async () => {
            setShowCreateDialog(false)
            await refetch()
          }}
        />
      )}
    </main>
  )
}
