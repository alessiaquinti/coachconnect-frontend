
import { Text, Flex, Heading, Badge } from "@radix-ui/themes"
import { X, Dumbbell, Tag, FileText } from "lucide-react"

export default function ExerciseModal({ exercise, onClose }) {
  if (!exercise) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl w-full max-w-2xl border border-white/40 ring-1 ring-white/20 max-h-[90vh] overflow-y-auto">
        {/* Header con pulsante chiudi */}
        <Flex align="center" justify="between" className="mb-6">
          <Flex align="center" gap="3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <div>
              <Heading size="6" className="text-gray-800 drop-shadow-sm">
                {exercise.nome}
              </Heading>
              <Text size="3" color="gray">
                Dettagli Esercizio
              </Text>
            </div>
          </Flex>
          <button
            onClick={onClose}
            className="p-2 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl hover:bg-white/40 transition-all duration-200 cursor-pointer shadow-lg"
            style={{ pointerEvents: "auto" }}
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </Flex>

        <div className="space-y-6">
          {/* Immagine esercizio */}
          {exercise.immagineUrl && (
            <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4 shadow-lg">
              <img
                src={exercise.immagineUrl || "/placeholder.svg"}
                alt={exercise.nome}
                className="rounded-xl w-full h-64 object-cover shadow-lg"
              />
            </div>
          )}

          {/* Categoria */}
          {exercise.categoria && (
            <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4 shadow-lg">
              <Flex align="center" gap="2" className="mb-2">
                <Tag className="h-4 w-4 text-blue-600" />
                <Text size="2" weight="bold" color="gray">
                  CATEGORIA
                </Text>
              </Flex>
              <Badge color="blue" variant="soft" size="2" className="bg-blue-100/80 backdrop-blur-sm">
                {exercise.categoria}
              </Badge>
            </div>
          )}

          {/* Descrizione */}
          {exercise.descrizione && (
            <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4 shadow-lg">
              <Flex align="center" gap="2" className="mb-3">
                <FileText className="h-4 w-4 text-purple-600" />
                <Text size="2" weight="bold" color="gray">
                  DESCRIZIONE
                </Text>
              </Flex>
              <Text size="3" className="text-gray-700 leading-relaxed">
                {exercise.descrizione}
              </Text>
            </div>
          )}

          {/* Informazioni aggiuntive se disponibili */}
          {(exercise.muscoli || exercise.difficolta || exercise.attrezzatura) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exercise.muscoli && (
                <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4 text-center shadow-lg">
                  <Text size="2" weight="bold" color="gray" className="block mb-2">
                    MUSCOLI
                  </Text>
                  <Text size="3" weight="bold" className="text-green-600">
                    {exercise.muscoli}
                  </Text>
                </div>
              )}

              {exercise.difficolta && (
                <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4 text-center shadow-lg">
                  <Text size="2" weight="bold" color="gray" className="block mb-2">
                    DIFFICOLTÀ
                  </Text>
                  <Text size="3" weight="bold" className="text-orange-600">
                    {exercise.difficolta}
                  </Text>
                </div>
              )}

              {exercise.attrezzatura && (
                <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4 text-center shadow-lg">
                  <Text size="2" weight="bold" color="gray" className="block mb-2">
                    ATTREZZATURA
                  </Text>
                  <Text size="3" weight="bold" className="text-purple-600">
                    {exercise.attrezzatura}
                  </Text>
                </div>
              )}
            </div>
          )}

          {/* Pulsante chiudi in fondo */}
          <Flex justify="end" className="pt-4 border-t border-white/30">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border border-blue-300/50 text-white rounded-xl cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              style={{ pointerEvents: "auto" }}
            >
              Chiudi
            </button>
          </Flex>
        </div>
      </div>
    </div>
  )
}
