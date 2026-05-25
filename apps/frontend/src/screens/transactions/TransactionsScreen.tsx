import { useEffect, useMemo, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { ChevronLeft, ChevronRight, Pencil, Search, Trash2 } from 'lucide-react'
import AppHeader from '../../components/AppHeader'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Tag } from '../../components/ui/tag'
import { Type } from '../../components/ui/type'
import { ICON_MAP } from '../categories/constants'
import CreateTransactionDialog from './CreateTransactionDialog'
import EditTransactionDialog from './EditTransactionDialog'
import DeleteTransactionConfirmation from './DeleteTransactionConfirmation'
import {
  formatCurrency,
  formatTransactionDate,
  getCategoryTagColor,
  getCurrentPeriod,
  getPeriodOptions,
} from './utils'

const PAGE_SIZE = 10

const ME_QUERY = gql`
  query MeForTransactions {
    me {
      id
      name
    }
  }
`

const CATEGORIES_QUERY = gql`
  query CategoriesForTransactions {
    categories {
      id
      name
      color
      icon
    }
  }
`

const TRANSACTIONS_PAGINATED_QUERY = gql`
  query TransactionsPaginated($filter: TransactionsFilterInput, $page: Int, $pageSize: Int) {
    transactionsPaginated(filter: $filter, page: $page, pageSize: $pageSize) {
      items {
        id
        description
        amount
        type
        date
        category {
          id
          name
          color
          icon
        }
      }
      total
      page
      pageSize
      totalPages
    }
  }
`

const DELETE_TRANSACTION_MUTATION = gql`
  mutation DeleteTransaction($id: String!) {
    deleteTransaction(id: $id)
  }
`

interface Category {
  id: string
  name: string
  color: string
  icon?: string
}

interface Transaction {
  id: string
  description: string
  amount: number
  type: string
  date: string
  category: Category
}

interface TransactionsPaginatedData {
  transactionsPaginated: {
    items: Transaction[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

type DialogState = 'none' | 'create' | 'edit' | 'delete'

const TYPE_FILTER_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'income', label: 'Entrada' },
  { value: 'expense', label: 'Saída' },
]

export default function TransactionsScreen() {
  const currentPeriod = getCurrentPeriod()
  const periodOptions = useMemo(() => getPeriodOptions(12), [])

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState(currentPeriod.value)
  const [dialogState, setDialogState] = useState<DialogState>('none')
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const { data: meData, loading: meLoading } = useQuery(ME_QUERY)
  const { data: categoriesData } = useQuery(CATEGORIES_QUERY)

  const selectedPeriod = periodOptions.find((option) => option.value === periodFilter) ?? {
    month: currentPeriod.month,
    year: currentPeriod.year,
  }

  const filter = useMemo(
    () => ({
      search: search || undefined,
      type: typeFilter,
      categoryId: categoryFilter,
      month: selectedPeriod.month,
      year: selectedPeriod.year,
    }),
    [search, typeFilter, categoryFilter, selectedPeriod.month, selectedPeriod.year],
  )

  const { data, loading, error, refetch } = useQuery<TransactionsPaginatedData>(
    TRANSACTIONS_PAGINATED_QUERY,
    {
      variables: { filter, page, pageSize: PAGE_SIZE },
    },
  )

  const [deleteTransaction, { loading: deleteLoading }] = useMutation(DELETE_TRANSACTION_MUTATION)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchInput])

  useEffect(() => {
    setPage(1)
  }, [typeFilter, categoryFilter, periodFilter])

  const handleCreateClick = () => {
    setSelectedTransaction(null)
    setDialogState('create')
  }

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setDialogState('edit')
  }

  const handleDeleteClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setDialogState('delete')
  }

  const handleCloseDialog = () => {
    setDialogState('none')
    setSelectedTransaction(null)
  }

  const handleTransactionSuccess = async () => {
    setDialogState('none')
    setSelectedTransaction(null)
    await refetch()
  }

  const handleConfirmDelete = async () => {
    if (!selectedTransaction) return

    try {
      await deleteTransaction({ variables: { id: selectedTransaction.id } })
      handleCloseDialog()
      await refetch()
    } catch (err) {
      console.error('Error deleting transaction:', err)
    }
  }

  const categories = categoriesData?.categories ?? []
  const paginated = data?.transactionsPaginated
  const transactions = paginated?.items ?? []
  const total = paginated?.total ?? 0
  const totalPages = paginated?.totalPages ?? 1
  const currentPage = paginated?.page ?? page

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, total)

  const categoryFilterOptions = [
    { value: 'all', label: 'Todas' },
    ...categories.map((category: Category) => ({ value: category.id, label: category.name })),
  ]

  const periodSelectOptions = [
    ...periodOptions.map((option) => ({ value: option.value, label: option.label })),
  ]

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  const userName = meData?.me?.name ?? 'Usuário'

  if (meLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <AppHeader userName={userName} />
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="rounded-4xl border border-border-primary bg-white p-8 shadow-lg shadow-slate-200/50">
            <p className="text-center text-lg text-text-primary">Carregando transações...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <AppHeader userName={userName} />
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8">

        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-text-heading">Transações</h1>
            <p className="mt-2 text-sm text-text-primary">Gerencie todas as suas transações financeiras</p>
          </div>
          <Button variant="primary" onClick={handleCreateClick} size="lg">
            + Nova transação
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border-primary bg-white p-4 shadow-md shadow-slate-200/50 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-heading">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-primary" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Buscar por descrição"
                size="md"
                className="w-full pl-9"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-heading">Tipo</label>
            <Select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              options={TYPE_FILTER_OPTIONS}
              size="md"
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-heading">Categoria</label>
            <Select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              options={categoryFilterOptions}
              size="md"
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-heading">Período</label>
            <Select
              value={periodFilter}
              onChange={(event) => setPeriodFilter(event.target.value)}
              options={periodSelectOptions}
              size="md"
              className="w-full"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border-primary bg-white shadow-lg shadow-slate-200/50">
          {loading ? (
            <p className="p-8 text-center text-text-primary">Carregando transações...</p>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-text-primary">{error.message}</p>
              <Button onClick={() => refetch()} variant="primary" className="mt-4">
                Tentar novamente
              </Button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-lg font-medium text-text-heading">Nenhuma transação encontrada</p>
              <p className="mt-2 text-sm text-text-primary">
                Ajuste os filtros ou crie uma nova transação para começar.
              </p>
              <Button onClick={handleCreateClick} variant="primary" className="mt-6">
                + Nova transação
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border-primary bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-text-primary">
                    <th className="px-6 py-4">Descrição</th>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Valor</th>
                    <th className="px-6 py-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => {
                    const isIncome = transaction.type.toLowerCase() === 'income'
                    return (
                      <tr
                        key={transaction.id}
                        className="border-b border-border-primary last:border-b-0 hover:bg-slate-50/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-code-bg text-lg">
                              {transaction.category.icon && ICON_MAP[transaction.category.icon]}
                            </span>
                            <span className="font-medium text-text-heading">{transaction.description}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-text-primary">{formatTransactionDate(transaction.date)}</td>
                        <td className="px-6 py-4">
                          <Tag
                            color={getCategoryTagColor(transaction.category.color)}
                            label={transaction.category.name}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Type type={isIncome ? 'entrada' : 'saida'} />
                        </td>
                        <td className={`px-6 py-4 font-semibold ${isIncome ? 'text-green' : 'text-red'}`}>
                          {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="icon"
                              size="sm"
                              onClick={() => handleDeleteClick(transaction)}
                              className="text-red hover:bg-red-light/50"
                              icon={<Trash2 className="h-4 w-4" />}
                              aria-label="Excluir transação"
                            />
                            <Button
                              variant="icon"
                              size="sm"
                              onClick={() => handleEditClick(transaction)}
                              icon={<Pencil className="h-4 w-4" />}
                              aria-label="Editar transação"
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && total > 0 && (
            <div className="flex flex-col items-center justify-between gap-4 border-t border-border-primary px-6 py-4 text-sm text-text-primary sm:flex-row">
              <p>
                {rangeStart} a {rangeEnd} | {total} resultados
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="icon"
                  size="md"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  icon={<ChevronLeft className="h-4 w-4" />}
                  aria-label="Página anterior"
                />
                {pageNumbers.map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant="pagination"
                    size="md"
                    number={pageNumber}
                    isActive={pageNumber === currentPage}
                    onClick={() => setPage(pageNumber)}
                  />
                ))}
                <Button
                  variant="icon"
                  size="md"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  icon={<ChevronRight className="h-4 w-4" />}
                  aria-label="Próxima página"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {dialogState === 'create' && (
        <CreateTransactionDialog
          categories={categories}
          onClose={handleCloseDialog}
          onSuccess={handleTransactionSuccess}
        />
      )}

      {dialogState === 'edit' && selectedTransaction && (
        <EditTransactionDialog
          transaction={selectedTransaction}
          categories={categories}
          onClose={handleCloseDialog}
          onSuccess={handleTransactionSuccess}
        />
      )}

      {dialogState === 'delete' && selectedTransaction && (
        <DeleteTransactionConfirmation
          description={selectedTransaction.description}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseDialog}
          loading={deleteLoading}
        />
      )}
    </main>
  )
}
