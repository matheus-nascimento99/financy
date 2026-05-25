import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  element: React.ReactElement
}

export default function ProtectedRoute({ element }: ProtectedRouteProps) {
  const token = localStorage.getItem('financy_token')

  if (!token) {
    return <Navigate to="/sign-in" replace />
  }

  return element
}
