
import { useUser } from "../contexts/UserProvider"
import Sidebar from "./Sidebar"
import SidebarMember from "./SidebarMember"
import { Outlet } from "react-router-dom"
import { useState } from "react"

export default function Layout() {
  const { user } = useUser()
  const [pageTitle, setPageTitle] = useState("")

  if (!user) return null

  return user.role === "coach" ? (
    <Sidebar pageTitle={pageTitle}>
      <Outlet context={setPageTitle} />
    </Sidebar>
  ) : (
    <SidebarMember pageTitle={pageTitle}>
      <Outlet context={setPageTitle} />
    </SidebarMember>
  )
}
