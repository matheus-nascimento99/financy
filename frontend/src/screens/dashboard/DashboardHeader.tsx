interface DashboardHeaderProps {
  userName: string
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="rounded-4xl border border-border-primary bg-white p-6 shadow-lg shadow-slate-200/50">
      <h1 className="text-2xl font-semibold text-text-heading">Olá, {userName}</h1>
      <p className="mt-2 text-sm text-text-primary">
        Aqui estão as suas finanças recentes e o desempenho das suas categorias.
      </p>
    </div>
  )
}
