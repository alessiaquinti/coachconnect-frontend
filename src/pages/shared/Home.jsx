import { useUser } from "@/contexts/UserProvider"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const { user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/login")
    } else if (user.role === "coach") {
      navigate("/coach")
    } else if (user.role === "cliente") {
      navigate("/member")
    }
  }, [user])

  return null 
}
