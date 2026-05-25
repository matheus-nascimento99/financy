interface DashboardCategoryProps {
  id: string
  name: string
  color: string
  total: number
  items: number
}

interface DashboardCategoriesProps {
  categories: DashboardCategoryProps[]
  onManage?: () => void
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export default function DashboardCategories({ categories, onManage }: DashboardCategoriesProps) {
  const manageButton = onManage ? (
    <button type="button" onClick={onManage} className="text-sm font-medium text-brand-base transition hover:opacity-80">
      Gerenciar
    </button>
  ) : (
    <span className="text-sm font-medium text-brand-base">Gerenciar</span>
  )
  if (!categories.length) {
    return (
      <section className="rounded-4xl border border-border-primary bg-white p-6 shadow-sm shadow-slate-200/40">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-heading">Categorias</h2>
          {manageButton}
        </div>
        <p className="mt-6 text-sm text-text-primary">Nenhuma categoria criada ainda.</p>
      </section>
    )
  }

  return (
    <section className="rounded-4xl border border-border-primary bg-white p-6 shadow-sm shadow-slate-200/40">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-heading">Categorias</h2>
        {manageButton}
      </div>

      <div className="mt-6 space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between gap-4 rounded-3xl border border-border-primary bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
                style={{ backgroundColor: `${category.color}22`, color: category.color }}
              >
                {category.name.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <p className="font-semibold text-text-heading">{category.name}</p>
                <p className="text-sm text-text-primary">{category.items} itens</p>
              </div>
            </div>
            <p className="text-right text-base font-semibold text-text-heading">{currencyFormatter.format(category.total)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
