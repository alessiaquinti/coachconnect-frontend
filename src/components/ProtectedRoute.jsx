import { useUser } from '@/contexts/UserProvider'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useUser()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white/50 backdrop-blur">
        <p className="text-gray-600 font-medium animate-pulse">Caricamento in corso...</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return children
}


