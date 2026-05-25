import { Button } from '../../components/ui/button'

interface Category {
  id: string
  name: string
  color: string
  transactions: Array<{ id: string }>
}

interface DeleteCategoryConfirmationProps {
  category: Category
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteCategoryConfirmation({
  category,
  onConfirm,
  onCancel,
}: DeleteCategoryConfirmationProps) {
  const transactionCount = category.transactions.length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text-heading">Deletar categoria?</h2>
        </div>

        {/* Content */}
        <div className="mb-6 space-y-4">
          <p className="text-sm text-text-primary">
            Você tem certeza de que deseja deletar a categoria{' '}
            <strong className="text-text-heading">"{category.name}"</strong>?
          </p>

          {transactionCount > 0 && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-medium text-orange-900">
                ⚠️ Aviso: Esta categoria tem {transactionCount} transação{transactionCount !== 1 ? 's' : ''}
              </p>
              <p className="mt-2 text-xs text-orange-800">
                Deletar esta categoria também deletará todas as transações associadas a ela. Esta ação não pode ser desfeita.
              </p>
            </div>
          )}

          {transactionCount === 0 && (
            <p className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-xs text-blue-900">
              ℹ️ Esta categoria não tem transações associadas e pode ser deletada com segurança.
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            className="flex-1"
          >
            Deletar
          </Button>
        </div>
      </div>
    </div>
  )
}
