import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui'

export default function WelcomeScreen() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-4xl bg-white border border-border-primary p-8 shadow-lg shadow-slate-200/50 text-center">
        <h1 className="text-2xl font-semibold text-text-heading mb-4">Bem-vindo ao Financy</h1>
        <p className="text-sm text-text-primary mb-6">
          Você está autenticado e pronto para começar a controlar suas finanças.
        </p>
        <Button type="button" variant="primary" size="md" className="w-full" onClick={() => navigate('/sign-in')}>
          Voltar para login
        </Button>
      </div>
    </div>
  )
}
