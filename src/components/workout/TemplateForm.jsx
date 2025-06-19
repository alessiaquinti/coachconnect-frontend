
import { useState } from "react"
import { Text, Flex, Button } from "@radix-ui/themes"
import { FileText, Target, Save, Loader2, LayoutTemplate } from "lucide-react"

export default function TemplateForm({ onSubmit, isLoading = false, initialData = {} }) {
  const [formData, setFormData] = useState({
    titolo: initialData.titolo || "",
    descrizione: initialData.descrizione || "",
    ...initialData,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
        <Flex direction="column" gap="6">
          <Flex align="center" gap="3" className="pb-4 border-b border-white/30">
            <div className="p-3 bg-purple-100/80 backdrop-blur-sm border border-purple-200/50 rounded-xl shadow-lg">
              <LayoutTemplate className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <Text size="6" weight="bold" className="text-gray-800">
                Informazioni Template
              </Text>
              <Text size="3" color="gray">
                Dettagli del template riutilizzabile
              </Text>
            </div>
          </Flex>

          <div className="space-y-6">
            <Flex direction="column" gap="3">
              <Flex align="center" gap="2">
                <Target className="h-4 w-4 text-purple-600" />
                <Text weight="bold" size="3" className="text-gray-700">
                  Nome Template *
                </Text>
              </Flex>
              <input
                className="w-full h-12 px-4 text-base bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:border-purple-400/60 focus:bg-white/25 transition-all duration-200 shadow-lg"
                placeholder="es. Upper Body Intensivo, Cardio HIIT, Forza Gambe..."
                value={formData.titolo}
                onChange={(e) => handleInputChange("titolo", e.target.value)}
                required
                minLength={3}
              />
            </Flex>

            <Flex direction="column" gap="3">
              <Flex align="center" gap="2">
                <FileText className="h-4 w-4 text-purple-600" />
                <Text weight="bold" size="3" className="text-gray-700">
                  Descrizione
                </Text>
              </Flex>
              <textarea
                placeholder="Descrivi gli obiettivi del template, le indicazioni generali e i benefici..."
                value={formData.descrizione}
                onChange={(e) => handleInputChange("descrizione", e.target.value)}
                rows={5}
                className="w-full text-base bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:border-purple-400/60 focus:bg-white/25 transition-all duration-200 shadow-lg resize-none p-4"
              />
            </Flex>
          </div>
        </Flex>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-8">
        <Button
          type="submit"
          disabled={isLoading || !formData.titolo.trim()}
          size="4"
          className="w-full max-w-md h-16 text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-xl border border-purple-300/50"
        >
          <Flex align="center" gap="3">
            {isLoading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <Text>Creazione...</Text>
              </>
            ) : (
              <>
                <Save className="h-6 w-6" />
                <Text>Crea Template</Text>
              </>
            )}
          </Flex>
        </Button>
      </div>
    </form>
  )
}
