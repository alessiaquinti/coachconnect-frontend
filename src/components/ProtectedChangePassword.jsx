import { useUser } from "@/contexts/UserProvider"
import { Navigate } from "react-router-dom"

export default function ProtectedChangePassword({ children }) {
  const { user, loading } = useUser()

  if (loading) return null

  if (!user) return <Navigate to="/login" />

  if (user.mustChangePassword !== true) {
    return <Navigate to="/" />
  }

  return children
}
