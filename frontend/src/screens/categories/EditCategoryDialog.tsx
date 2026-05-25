import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { gql, useMutation } from '@apollo/client'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { ICONS, COLOR_OPTIONS } from './constants'

const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: String!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      color
      description
      icon
    }
  }
`

const categorySchema = z.object({
  name: z.string().min(1, 'Título é obrigatório').max(50, 'Máximo 50 caracteres'),
  description: z.string().max(200, 'Máximo 200 caracteres').optional(),
  color: z.string(),
  icon: z.string().optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface Category {
  id: string
  name: string
  color: string
  description?: string
  icon?: string
}

interface EditCategoryDialogProps {
  category: Category
  onClose: () => void
  onSuccess: () => void
}

export default function EditCategoryDialog({
  category,
  onClose,
  onSuccess,
}: EditCategoryDialogProps) {
  const [updateCategory, { loading }] = useMutation(UPDATE_CATEGORY_MUTATION)
  const [showIconPicker, setShowIconPicker] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
      description: category.description || '',
      color: category.color,
      icon: category.icon,
    },
  })

  const selectedColor = watch('color')
  const selectedIcon = watch('icon')

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await updateCategory({
        variables: {
          id: category.id,
          input: {
            name: data.name,
            description: data.description || undefined,
            color: data.color,
            icon: data.icon || undefined,
          },
        },
      })
      onSuccess()
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-screen w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-heading">Editar categoria</h2>
          <button
            onClick={onClose}
            className="text-2xl text-text-primary hover:text-text-heading"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-text-heading">Título</label>
            <Input
              {...register('name')}
              placeholder="Ex. Alimentação"
              size="md"
              error={!!errors.name}
              disabled={loading}
              className="mt-1"
            />
            {errors.name && <p className="mt-1 text-sm text-danger">{errors.name.message}</p>}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-text-heading">
              Descrição <span className="font-normal text-text-primary">(opcional)</span>
            </label>
            <textarea
              {...register('description')}
              placeholder="Descrição da categoria"
              disabled={loading}
              className="mt-1 w-full rounded-lg border border-border-primary px-4 py-2 text-sm text-text-primary placeholder-text-primary/50 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50"
              rows={3}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-danger">{errors.description.message}</p>
            )}
          </div>

          {/* Ícone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-heading">Ícone</label>
            <button
              type="button"
              onClick={() => setShowIconPicker(!showIconPicker)}
              disabled={loading}
              className="w-full rounded-lg border border-border-primary bg-white px-4 py-2 text-sm text-text-heading hover:bg-accent-bg"
            >
              {selectedIcon ? ICONS.find(i => i.id === selectedIcon)?.icon : '🏷️'} Selecionar ícone
            </button>

            {showIconPicker && (
              <div className="mt-3 grid grid-cols-4 gap-2 rounded-lg border border-border-primary bg-slate-50 p-3">
                {ICONS.map((icon) => (
                  <button
                    key={icon.id}
                    type="button"
                    onClick={() => {
                      setValue('icon', icon.id)
                      setShowIconPicker(false)
                    }}
                    className={`rounded p-2 text-2xl transition ${
                      selectedIcon === icon.id
                        ? 'bg-brand-base'
                        : 'hover:bg-white'
                    }`}
                    title={icon.label}
                  >
                    {icon.icon}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cor */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-heading">Cor</label>
            <div className="grid grid-cols-5 gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setValue('color', color.id)}
                  className={`h-10 rounded-lg border-2 transition ${
                    selectedColor === color.id
                      ? 'border-text-heading'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 border-t border-border-primary pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
