import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@radix-ui/themes/styles.css"
import { Theme } from "@radix-ui/themes"
import "./App.css"
import App from "./App.jsx"
import { BrowserRouter } from "react-router-dom"
import AxiosProvider from "./contexts/AxiosProvider.jsx"
import UserProvider from "./contexts/UserProvider.jsx"
import { SocketProvider } from "./contexts/SocketProvider.jsx"
import { Toaster } from "react-hot-toast"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AxiosProvider>
        <UserProvider>
          {/* SocketProvider DEVE essere dentro UserProvider */}
          <SocketProvider>
            <Theme appearance="light" accentColor="blue">
              <App />
              <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            </Theme>
          </SocketProvider>
        </UserProvider>
      </AxiosProvider>
    </BrowserRouter>
  </StrictMode>,
)
