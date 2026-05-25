import { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AppHeader from '../../components/AppHeader'
import { formatLongDate } from '../transactions/utils'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      createdAt
    }
  }
`

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      email
    }
  }
`

const profileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Máximo 100 caracteres'),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface UserData {
  me: {
    id: string
    name: string
    email: string
    createdAt: string
  } | null
}

export default function ProfileScreen() {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)

  const { data, loading: queryLoading } = useQuery<UserData>(ME_QUERY)
  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER_MUTATION)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: data?.me?.name || '',
    },
  })

  const onSubmit = async (formData: ProfileFormData) => {
    try {
      await updateUser({
        variables: {
          input: {
            name: formData.name,
          },
        },
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('financy_token')
    navigate('/sign-in')
  }

  if (queryLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <AppHeader userName="Usuário" activeNavPath={null} />
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mx-auto w-full max-w-2xl rounded-4xl border border-border-primary bg-white p-8 shadow-lg shadow-slate-200/50">
            <p className="text-center text-lg text-text-primary">Carregando perfil...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!data?.me) {
    return (
      <main className="min-h-screen bg-slate-50">
        <AppHeader userName="Usuário" activeNavPath={null} />
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mx-auto w-full max-w-2xl rounded-4xl border border-border-primary bg-white p-8 shadow-lg shadow-slate-200/50">
            <h1 className="text-xl font-semibold text-text-heading">Erro ao carregar perfil</h1>
            <p className="mt-4 text-sm text-text-primary">Não foi possível obter os dados do usuário.</p>
          </div>
        </div>
      </main>
    )
  }

  const { name, email, createdAt } = data.me
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')

  const joinDate = formatLongDate(createdAt)

  return (
    <main className="min-h-screen bg-slate-50">
      <AppHeader userName={name} activeNavPath={null} />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-text-heading">Meu Perfil</h1>
          <p className="mt-2 text-sm text-text-primary">Gerencie suas informações pessoais</p>
        </div>

        {/* Profile Card */}
        <div className="rounded-4xl border border-border-primary bg-white p-8 shadow-lg shadow-slate-200/50">
          {/* Avatar & Basic Info */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-base text-4xl font-semibold text-white">
              {initials}
            </div>
            <h2 className="text-2xl font-semibold text-text-heading">{name}</h2>
            <p className="mt-2 text-sm text-text-primary">{email}</p>
            <p className="mt-4 text-xs text-text-primary">Membro desde {joinDate}</p>
          </div>

          <hr className="my-8 border-border-primary" />

          {/* Edit Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            {/* Name Field */}
            <div className="w-full">
              <label className="block text-sm font-medium text-text-heading">Nome</label>
              <Input
                {...register('name')}
                placeholder="Seu nome completo"
                disabled={!isEditing || updateLoading}
                error={!!errors.name}
                className="mt-2"
                size="lg"
              />
              {errors.name && <p className="mt-1 text-sm text-danger">{errors.name.message}</p>}
            </div>

            {/* Email Field (Read-only) */}
            <div className="w-full">
              <label className="block text-sm font-medium text-text-heading">Email</label>
              <Input
                value={email}
                disabled
                className="mt-2"
                size="lg"
              />
              <p className="mt-1 text-xs text-text-primary">O email não pode ser alterado</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 border-t border-border-primary pt-8">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                    disabled={updateLoading}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={updateLoading}
                    className="flex-1"
                  >
                    {updateLoading ? 'Salvando...' : 'Salvar'}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  className="w-full"
                >
                  Editar Perfil
                </Button>
              )}
            </div>
          </form>

          <hr className="my-8 border-border-primary" />

          {/* Logout Section */}
          <div className="space-y-4">
            <p className="text-sm text-text-primary">Deseja sair da aplicação?</p>
            <Button variant="danger" onClick={handleLogout} className="w-full">
              Sair da Conta
            </Button>
          </div>
        </div>
        </div>
      </div>
    </main>
  )
}
