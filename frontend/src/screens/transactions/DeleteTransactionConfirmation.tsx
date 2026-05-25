import { Button } from '../../components/ui/button'

interface DeleteTransactionConfirmationProps {
  description: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function DeleteTransactionConfirmation({
  description,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteTransactionConfirmationProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-text-heading">Excluir transação</h2>
        <p className="mt-4 text-sm text-text-primary">
          Tem certeza que deseja excluir a transação <strong>{description}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className="mt-6 flex gap-3">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading} className="flex-1">
            Cancelar
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm} disabled={loading} className="flex-1">
            {loading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </div>
    </div>
  )
}
