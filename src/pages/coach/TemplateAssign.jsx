
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, Users, Send, ArrowLeft, CheckCircle, AlertCircle, FileIcon as FileTemplate } from "lucide-react"
import { Text, Flex } from "@radix-ui/themes"
import toast from "react-hot-toast"
import { useAxios } from "@/contexts/AxiosProvider"
import usePageTitle from "@/hooks/usePageTitle"

export default function TemplateAssign() {
  usePageTitle("Assegna Template")
  const { templateId } = useParams()
  const navigate = useNavigate()
  const axios = useAxios() 

  const [template, setTemplate] = useState(null)
  const [clienti, setClienti] = useState([])
  const [selectedClienti, setSelectedClienti] = useState([])
  const [dataAllenamento, setDataAllenamento] = useState("")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadData()
  }, [templateId])

  const loadData = async () => {
    try {
      setErrorMessage("")

      const [templateResponse, clientiResponse] = await Promise.all([
        axios.get(`/workouts/templates/${templateId}`),
        axios.get("/customers"),
      ])

      

      setTemplate(templateResponse.data)
      setClienti(clientiResponse.data)

      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setDataAllenamento(tomorrow.toISOString().split("T")[0])
    } catch (error) {
      setErrorMessage("Errore nel caricamento dei dati")
      toast.error("Errore nel caricamento")
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async () => {
   

    setErrorMessage("")

    if (selectedClienti.length === 0) {
      setErrorMessage("Seleziona almeno un cliente")
      toast.error("Seleziona almeno un cliente")
      return
    }

    if (!dataAllenamento) {
      setErrorMessage("Seleziona una data")
      toast.error("Seleziona una data")
      return
    }

    setAssigning(true)

    try {
      const payload = {
        clientiIds: selectedClienti,
        dataAllenamento,
        note: note || null,
      }

      

      const response = await axios.post(`/workouts/templates/${templateId}/assign`, payload)

      toast.success(`Template assegnato a ${selectedClienti.length} clienti!`)

      setTimeout(() => {
        navigate("/coach/workouts", {
          state: {
            refresh: true,
            
          },
        })
      }, 1500)
    } catch (error) {

      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error)
        toast.error(error.response.data.error)
      } else {
        setErrorMessage("Errore nell'assegnazione del template")
        toast.error("Errore nell'assegnazione")
      }
    } finally {
      setAssigning(false)
    }
  }

  const toggleCliente = (clienteId) => {
    setSelectedClienti((prev) => {
      const newSelection = prev.includes(clienteId) ? prev.filter((id) => id !== clienteId) : [...prev, clienteId]
      return newSelection
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50 flex items-center justify-center">
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl">
          <Flex align="center" gap="3">
            <div className="p-3 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-full shadow-lg">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <Text color="blue" size="5" weight="bold">
              Caricamento...
            </Text>
          </Flex>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50"></div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 grid">
          <Flex align="center" justify="center" gap="4" className="mb-8">
            <div className="p-4 bg-white/30 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg">
              <Send className="h-10 w-10 text-blue-600" />
            </div>
          </Flex>
          <Text
            as="h1"
            size="9"
            weight="bold"
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm"
          >
            Assegna Template
          </Text>
          <Text size="5" color="gray" className="max-w-2xl mx-auto">
            Assegna questo template ai tuoi clienti
          </Text>
        </div>

        {/* Back Button */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-4 shadow-lg">
          <button
            onClick={() => navigate("/coach/templates")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna ai Template
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4 shadow-lg">
            <Flex align="center" gap="3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <Text color="red" weight="medium" size="3">
                {errorMessage}
              </Text>
            </Flex>
          </div>
        )}

        {/* Template Info */}
        {template && (
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
            <Flex align="center" gap="3" className="pb-4 border-b border-white/30 mb-6">
              <div className="p-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl shadow-lg">
                <FileTemplate className="h-6 w-6 text-blue-600" />
              </div>
              <div className="grid">
                <Text size="6" weight="bold" className="text-gray-800">
                  Template Selezionato
                </Text>
                <Text size="3" color="gray">
                  Informazioni del template da assegnare
                </Text>
              </div>
            </Flex>

            <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-lg">
              <Text size="5" weight="bold" className="block mb-3 text-gray-800">
                 {template.titolo}
              </Text>
              {template.descrizione && (
                <Text size="3" color="gray" className="block mb-4">
                  {template.descrizione}
                </Text>
              )}
              <Flex align="center" gap="4">
                <div className="bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-lg px-3 py-1">
                  <Text size="2" weight="medium" className="text-blue-700">
                    {template.esercizi?.length || 0} esercizi
                  </Text>
                </div>
                {template.utilizzi !== undefined && (
                  <div className="bg-green-100/80 backdrop-blur-sm border border-green-200/50 rounded-lg px-3 py-1">
                    <Text size="2" weight="medium" className="text-green-700">
                       {template.utilizzi} utilizzi
                    </Text>
                  </div>
                )}
              </Flex>
            </div>
          </div>
        )}

        {/* Form Assegnazione */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
          <Flex align="center" gap="3" className="pb-4 border-b border-white/30 mb-6">
            <div className="p-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="grid">
              <Text size="6" weight="bold" className="text-gray-800">
                Dettagli Assegnazione
              </Text>
              <Text size="3" color="gray">
                Configura data, clienti e note
              </Text>
            </div>
          </Flex>

          <div className="space-y-8">
            {/* Data Allenamento */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                <Flex align="center" gap="2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Data Allenamento *
                </Flex>
              </label>
              <input
                type="date"
                value={dataAllenamento}
                onChange={(e) => {
                  setDataAllenamento(e.target.value)
                }}
                className="w-full h-12 px-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60 focus:bg-white/60 transition-all duration-200 shadow-lg"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Selezione Clienti */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                <Flex align="center" gap="2">
                  <Users className="h-4 w-4 text-purple-600" />
                  Seleziona Clienti ({selectedClienti.length} selezionati) *
                </Flex>
              </label>

              {clienti.length === 0 ? (
                <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl p-8 text-center shadow-lg">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 rounded-full w-fit mx-auto">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <Text size="4" color="gray">
                      Nessun cliente trovato
                    </Text>
                    <button
                      onClick={() => navigate("/coach/customers")}
                      className="px-4 py-2 bg-blue-500/80 hover:bg-blue-600/80 backdrop-blur-sm border border-blue-300/50 text-white rounded-xl transition-all duration-200 shadow-lg"
                    >
                      Vai ai Clienti
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {clienti.map((cliente) => (
                      <div
                        key={cliente.id}
                        onClick={() => toggleCliente(cliente.userId)}
                        className={`p-4 bg-white/50 backdrop-blur-sm border rounded-xl cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg ${
                          selectedClienti.includes(cliente.userId)
                            ? "border-blue-400/60 bg-blue-50/50 ring-2 ring-blue-300/50"
                            : "border-white/40 hover:border-blue-300/40"
                        }`}
                      >
                        <Flex align="center" gap="3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              selectedClienti.includes(cliente.userId)
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300 bg-white/50"
                            }`}
                          >
                            {selectedClienti.includes(cliente.userId) && <CheckCircle className="h-3 w-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <Text size="3" weight="medium" className="text-gray-800">
                              {cliente.user?.name || "Nome non disponibile"}
                            </Text>
                            <Text size="2" color="gray">
                              {cliente.user?.email || "Email non disponibile"}
                            </Text>
                          </div>
                        </Flex>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Note */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                <Flex align="center" gap="2">
                  <FileTemplate className="h-4 w-4 text-green-600" />
                  Note (opzionale)
                </Flex>
              </label>
              <textarea
                value={note}
                onChange={(e) => {
                  setNote(e.target.value)
                }}
                placeholder="Aggiungi note per i clienti..."
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60 focus:bg-white/60 transition-all duration-200 shadow-lg resize-none"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl ring-1 ring-white/20">
          <Flex gap="4" justify="center" className="flex-wrap">
            <button
              onClick={() => navigate("/coach/templates")}
              disabled={assigning}
              className="min-w-32 h-14 px-6 bg-white/50 hover:bg-white/70 backdrop-blur-sm border border-white/50 text-gray-700 rounded-2xl font-medium shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <Text size="4" weight="medium">
                Annulla
              </Text>
            </button>

            <button
              onClick={() => {
                handleAssign()
              }}
              disabled={assigning || selectedClienti.length === 0 || !dataAllenamento}
              className="min-w-48 h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {assigning ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  <Text size="4" weight="bold">
                    Assegnando...
                  </Text>
                </>
              ) : (
                <>
                  <Send className="h-6 w-6" />
                  <Text size="4" weight="bold">
                    Assegna Template
                  </Text>
                </>
              )}
            </button>
          </Flex>
        </div>
      </div>
    </div>
  )
}
