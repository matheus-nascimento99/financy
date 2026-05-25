import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { gql, useMutation } from '@apollo/client'
import { ArrowDown, ArrowUp, X } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import CurrencyAmountInput from './CurrencyAmountInput'
import { dateInputToISO, formatAmountFromNumber, parseAmountInput, toDateInputValue } from './utils'

const UPDATE_TRANSACTION_MUTATION = gql`
  mutation UpdateTransaction($id: String!, $input: UpdateTransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      id
    }
  }
`

const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória').max(100, 'Máximo 100 caracteres'),
  date: z.string().min(1, 'Data é obrigatória'),
  amount: z.string().refine((value) => parseAmountInput(value) > 0, 'Valor é obrigatório'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface CategoryOption {
  id: string
  name: string
}

interface Transaction {
  id: string
  description: string
  amount: number
  type: string
  date: string
  category: { id: string }
}

interface EditTransactionDialogProps {
  transaction: Transaction
  categories: CategoryOption[]
  onClose: () => void
  onSuccess: () => void
}

export default function EditTransactionDialog({
  transaction,
  categories,
  onClose,
  onSuccess,
}: EditTransactionDialogProps) {
  const initialType = transaction.type.toLowerCase() === 'income' ? 'income' : 'expense'
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>(initialType)
  const [updateTransaction, { loading }] = useMutation(UPDATE_TRANSACTION_MUTATION)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: transaction.description,
      date: toDateInputValue(transaction.date),
      amount: formatAmountFromNumber(transaction.amount),
      categoryId: transaction.category.id,
    },
  })

  const amountValue = watch('amount')

  const onSubmit = async (data: TransactionFormData) => {
    const amount = parseAmountInput(data.amount)
    if (amount <= 0) return

    try {
      await updateTransaction({
        variables: {
          id: transaction.id,
          input: {
            description: data.description,
            amount,
            type: transactionType,
            date: dateInputToISO(data.date),
            categoryId: data.categoryId,
          },
        },
      })
      onSuccess()
    } catch (error) {
      console.error('Error updating transaction:', error)
    }
  }

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-heading">Editar transação</h2>
            <p className="mt-1 text-sm text-text-primary">Atualize os dados da transação</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-text-primary transition hover:bg-code-bg hover:text-text-heading"
            disabled={loading}
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTransactionType('expense')}
              disabled={loading}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 transition ${
                transactionType === 'expense'
                  ? 'border-red-base bg-red-light/30'
                  : 'border-border-primary bg-white hover:border-border-primary/80'
              }`}
            >
              <ArrowDown className={`h-5 w-5 ${transactionType === 'expense' ? 'text-red' : 'text-text-primary'}`} />
              <span className={`text-sm font-medium ${transactionType === 'expense' ? 'text-red' : 'text-text-primary'}`}>
                Despesa
              </span>
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('income')}
              disabled={loading}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 transition ${
                transactionType === 'income'
                  ? 'border-green-base bg-green-light/30'
                  : 'border-border-primary bg-white hover:border-border-primary/80'
              }`}
            >
              <ArrowUp className={`h-5 w-5 ${transactionType === 'income' ? 'text-green' : 'text-text-primary'}`} />
              <span className={`text-sm font-medium ${transactionType === 'income' ? 'text-green' : 'text-text-primary'}`}>
                Receita
              </span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-heading">Descrição</label>
            <Input
              {...register('description')}
              placeholder="Ex. Almoço no restaurante"
              size="md"
              error={!!errors.description}
              disabled={loading}
              className="mt-1 w-full"
            />
            {errors.description && <p className="mt-1 text-sm text-danger">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-heading">Data</label>
              <Input
                {...register('date')}
                type="date"
                size="md"
                error={!!errors.date}
                disabled={loading}
                className="mt-1 w-full"
              />
              {errors.date && <p className="mt-1 text-sm text-danger">{errors.date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-heading">Valor</label>
              <CurrencyAmountInput
                value={amountValue}
                onChange={(value) => setValue('amount', value, { shouldValidate: true })}
                error={!!errors.amount}
                disabled={loading}
              />
              {errors.amount && <p className="mt-1 text-sm text-danger">{errors.amount.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-heading">Categoria</label>
            <Select
              {...register('categoryId')}
              options={categoryOptions}
              placeholder="Selecione"
              size="md"
              error={!!errors.categoryId}
              disabled={loading}
              className="mt-1 w-full"
            />
            {errors.categoryId && <p className="mt-1 text-sm text-danger">{errors.categoryId.message}</p>}
          </div>

          <Button type="submit" variant="primary" disabled={loading} className="w-full" size="lg">
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
