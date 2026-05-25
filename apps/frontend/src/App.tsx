import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import SignUpScreen from './screens/sign-up'
import SignInScreen from './screens/sign-in'
import WelcomeScreen from './screens/welcome'
import DashboardScreen from './screens/dashboard'
import CategoriesScreen from './screens/categories'
import TransactionsScreen from './screens/transactions'
import ProfileScreen from './screens/profile'
import ProtectedRoute from './components/ProtectedRoute'

function AppRoutes() {
  const navigate = useNavigate()

  return (
    <Routes>
      <Route
        path="/sign-in"
        element={<SignInScreen onNavigateToSignUp={() => navigate('/sign-up')} />}
      />
      <Route
        path="/sign-up"
        element={<SignUpScreen onNavigateToLogin={() => navigate('/sign-in')} />}
      />
      <Route path="/dashboard" element={<ProtectedRoute element={<DashboardScreen />} />} />
      <Route path="/transactions" element={<ProtectedRoute element={<TransactionsScreen />} />} />
      <Route path="/categories" element={<ProtectedRoute element={<CategoriesScreen />} />} />
      <Route path="/profile" element={<ProtectedRoute element={<ProfileScreen />} />} />
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route path="/" element={<Navigate to="/sign-in" replace />} />
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
