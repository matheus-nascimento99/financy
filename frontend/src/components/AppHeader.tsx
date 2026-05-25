import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/logo.svg'

interface AppHeaderProps {
  userName: string
  /** Quando `null`, nenhum item do menu fica destacado */
  activeNavPath?: string | null
}

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Transações', path: '/transactions' },
  { label: 'Categorias', path: '/categories' },
] as const

export default function AppHeader({ userName, activeNavPath }: AppHeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')

  return (
    <header className="relative flex h-16 items-center justify-between border-b border-border-primary bg-white px-6">
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="shrink-0"
        aria-label="Ir para o dashboard"
      >
        <img src={logo} alt="Financy" className="h-8" />
      </button>

      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
        {navItems.map((item) => {
          const isActive =
            activeNavPath === null
              ? false
              : activeNavPath !== undefined
                ? activeNavPath === item.path
                : location.pathname === item.path
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={
                isActive
                  ? 'text-sm font-bold text-brand-base'
                  : 'text-sm font-normal text-gray-500 transition hover:text-brand-base'
              }
            >
              {item.label}
            </button>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={() => navigate('/profile')}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
        aria-label="Abrir perfil"
      >
        {initials}
      </button>
    </header>
  )
}
