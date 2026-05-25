import { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import AppHeader from '../../components/AppHeader'
import { Button } from '../../components/ui/button'
import CreateCategoryDialog from './CreateCategoryDialog'
import EditCategoryDialog from './EditCategoryDialog'
import DeleteCategoryConfirmation from './DeleteCategoryConfirmation'
import CategoriesSummaryCards from './CategoriesSummaryCards'
import { ICON_MAP, COLORS } from './constants'

const ME_QUERY = gql`
  query MeForCategories {
    me {
      id
      name
    }
  }
`

const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      id
      name
      color
      description
      icon
      createdAt
      transactions {
        id
      }
    }
  }
`

const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id)
  }
`

interface Category {
  id: string
  name: string
  color: string
  description?: string
  icon?: string
  createdAt: string
  transactions: Array<{ id: string }>
}

interface CategoriesData {
  categories: Category[]
}

type DialogState = 'none' | 'create' | 'edit' | 'delete'

export default function CategoriesScreen() {
  const [dialogState, setDialogState] = useState<DialogState>('none')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const { data: meData, loading: meLoading } = useQuery(ME_QUERY)
  const { data, loading, error, refetch } = useQuery<CategoriesData>(CATEGORIES_QUERY)
  const [deleteCategory] = useMutation(DELETE_CATEGORY_MUTATION)

  const handleCreateClick = () => {
    setSelectedCategory(null)
    setDialogState('create')
  }

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category)
    setDialogState('edit')
  }

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category)
    setDialogState('delete')
  }

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return

    try {
      await deleteCategory({ variables: { id: selectedCategory.id } })
      setDialogState('none')
      setSelectedCategory(null)
      await refetch()
    } catch (err) {
      console.error('Error deleting category:', err)
    }
  }

  const handleCloseDialog = () => {
    setDialogState('none')
    setSelectedCategory(null)
  }

  const handleCategorySuccess = () => {
    setDialogState('none')
    setSelectedCategory(null)
    refetch()
  }

  const userName = meData?.me?.name ?? 'Usuário'

  if (meLoading || loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <AppHeader userName={userName} />
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="rounded-4xl border border-border-primary bg-white p-8 shadow-lg shadow-slate-200/50">
            <p className="text-center text-lg text-text-primary">Carregando categorias...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50">
        <AppHeader userName={userName} />
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="rounded-4xl border border-border-primary bg-white p-8 shadow-lg shadow-slate-200/50">
            <h1 className="text-xl font-semibold text-text-heading">Erro ao carregar categorias</h1>
            <p className="mt-4 text-sm text-text-primary">{error?.message ?? 'Não foi possível obter as categorias.'}</p>
            <Button onClick={() => refetch()} variant="primary" className="mt-4">
              Tentar novamente
            </Button>
          </div>
        </div>
      </main>
    )
  }

  const categories = data?.categories ?? []

  const totalTransactions = categories.reduce(
    (sum, category) => sum + category.transactions.length,
    0,
  )

  const mostUsedCategory =
    categories.length === 0
      ? null
      : categories.reduce((top, category) =>
          category.transactions.length > top.transactions.length ? category : top,
        )

  return (
    <main className="min-h-screen bg-slate-50">
      <AppHeader userName={userName} />
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8">

        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-text-heading">Categorias</h1>
            <p className="mt-2 text-sm text-text-primary">Organize suas transações por categorias</p>
          </div>
          <Button variant="primary" onClick={handleCreateClick} size="lg">
            + Nova categoria
          </Button>
        </div>

        <CategoriesSummaryCards
          totalCategories={categories.length}
          totalTransactions={totalTransactions}
          mostUsedCategory={
            mostUsedCategory && mostUsedCategory.transactions.length > 0
              ? { name: mostUsedCategory.name }
              : null
          }
        />

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="rounded-4xl border border-border-primary bg-white p-12 shadow-lg shadow-slate-200/50">
            <div className="text-center">
              <p className="text-lg font-medium text-text-heading">Nenhuma categoria criada</p>
              <p className="mt-2 text-sm text-text-primary">Crie sua primeira categoria para organizar suas transações</p>
              <Button onClick={handleCreateClick} variant="primary" className="mt-6">
                Criar primeira categoria
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-2xl border border-border-primary bg-white p-4 shadow-md shadow-slate-200/50 transition hover:shadow-lg"
              >
                {/* Category Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-lg text-xl"
                      style={{ backgroundColor: COLORS[category.color] || category.color }}
                    >
                      {category.icon && ICON_MAP[category.icon]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-heading">{category.name}</h3>
                      <p className="text-xs text-text-primary">{category.transactions.length} transações</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {category.description && (
                  <p className="mb-4 text-sm text-text-primary">{category.description}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2 border-t border-border-primary pt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditClick(category)}
                    className="flex-1"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(category)}
                    className="flex-1"
                  >
                    Deletar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      {dialogState === 'create' && (
        <CreateCategoryDialog onClose={handleCloseDialog} onSuccess={handleCategorySuccess} />
      )}

      {dialogState === 'edit' && selectedCategory && (
        <EditCategoryDialog
          category={selectedCategory}
          onClose={handleCloseDialog}
          onSuccess={handleCategorySuccess}
        />
      )}

      {dialogState === 'delete' && selectedCategory && (
        <DeleteCategoryConfirmation
          category={selectedCategory}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseDialog}
        />
      )}
    </main>
  )
}
