import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input, Button } from '../../components/ui'
import logo from '../../assets/logo.svg'

const signInSchema = z.object({
  email: z.string().email('E-mail inválido').transform((value) => value.trim()),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

type SignInFormData = z.infer<typeof signInSchema>

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

interface LoginResponse {
  login: {
    token: string
    user: {
      id: string
      name: string
      email: string
    }
  }
}

interface LoginVariables {
  input: {
    email: string
    password: string
  }
}

interface SignInScreenProps {
  onNavigateToSignUp?: () => void
}

export default function SignInScreen({ onNavigateToSignUp }: SignInScreenProps) {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  const [login, { loading }] = useMutation<LoginResponse, LoginVariables>(LOGIN_MUTATION)

  const onSubmit = async (data: SignInFormData) => {
    setErrorMessage(null)
    setSuccess(false)

    try {
      const result = await login({
        variables: {
          input: {
            email: data.email,
            password: data.password,
          },
        },
      })

      const token = result.data?.login.token
      if (!token) {
        throw new Error('Não foi possível autenticar.')
      }

      localStorage.setItem('financy_token', token)
      setSuccess(true)
      reset()
      navigate('/dashboard')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao entrar.'
      setErrorMessage(message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 flex-col gap-8">
      <img src={logo} alt="Financy logo" className="object-contain" />
      <div className="w-full max-w-md rounded-4xl bg-white border border-border-primary p-8 shadow-lg shadow-slate-200/50">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-text-heading">Fazer login</h1>
          <p className="text-sm text-text-primary mb-2">Entre na sua conta para continuar</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="mb-2 block text-sm font-medium text-text-heading">E-mail</label>
            <Input
              placeholder="mail@exemplo.com"
              {...register('email')}
              size="md"
              className="w-full"
              name="email"
              type="email"
              autoComplete="email"
            />
            {errors.email ? (
              <p className="mt-2 text-xs text-danger">{errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-heading">Senha</label>
            <Input
              placeholder="Digite sua senha"
              {...register('password')}
              size="md"
              className="w-full"
              name="password"
              type="password"
              autoComplete="current-password"
            />
            {errors.password ? (
              <p className="mt-2 text-xs text-danger">{errors.password.message}</p>
            ) : (
              <p className="mt-2 text-xs text-text-primary">A senha deve ter no mínimo 8 caracteres</p>
            )}
          </div>

          {errorMessage ? (
            <p className="text-sm text-danger">{errorMessage}</p>
          ) : success ? (
            <p className="text-sm text-emerald-600">Login efetuado com sucesso!</p>
          ) : null}

          <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 border-t border-border-primary pt-6 text-center text-sm text-text-primary">
          <p>Ainda não tem uma conta?</p>
          <button
            type="button"
            onClick={onNavigateToSignUp}
            className="mt-3 text-brand-base font-semibold hover:opacity-90"
          >
            Criar conta
          </button>
        </div>
      </div>
    </div>
  )
}
