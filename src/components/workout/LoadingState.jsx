"use client"

import { Text } from "@radix-ui/themes"
import { Loader2 } from "lucide-react"

export default function LoadingState({ message = "Caricamento..." }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50"></div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-purple-200/10 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-pink-200/10 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-16 shadow-2xl ring-1 ring-white/20 text-center">
          <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <Text size="5" color="gray">
            {message}
          </Text>
        </div>
      </div>
    </div>
  )
}
