
import { useState, useEffect } from "react"
import { Text, Flex, Badge } from "@radix-ui/themes"
import { Target, RotateCcw, Weight, CheckCircle2 } from "lucide-react"

export default function ExerciseSelector({
  selectedExercises = [],
  onExercisesChange,
  allExercises = [],
  isLoading = false,
}) {
  const [exercises, setExercises] = useState([])

  useEffect(() => {
    const exercisesWithData = allExercises.map((ex) => {
      const existing = selectedExercises.find((sel) => sel.esercizioId === ex.id)
      return {
        ...ex,
        checked: !!existing,
        serie: existing?.serie || "",
        ripetizioni: existing?.ripetizioni || "",
        peso: existing?.peso || "",
      }
    })
    setExercises(exercisesWithData)
  }, [allExercises, selectedExercises])

  const updateExercise = (index, field, value) => {
    const updated = [...exercises]
    updated[index] = { ...updated[index], [field]: value }
    setExercises(updated)

    const selectedData = updated
      .filter((ex) => ex.checked)
      .map((ex) => ({
        esercizioId: ex.id,
        serie: ex.serie,
        ripetizioni: ex.ripetizioni,
        peso: ex.peso,
      }))

    onExercisesChange(selectedData)
  }

  const selectedCount = exercises.filter((ex) => ex.checked).length

  if (isLoading) {
    return (
      <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
        <div className="text-center py-16">
          <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <Text size="5" color="gray">
            Caricamento esercizi...
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
      <Flex direction="column" gap="6">
        <Flex align="center" justify="between" className="pb-4 border-b border-white/30">
          <Flex align="center" gap="3">
            <div className="p-3 bg-green-100/80 backdrop-blur-sm border border-green-200/50 rounded-xl shadow-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <Flex align="center" gap="3">
                <Text size="6" weight="bold" className="text-gray-800 drop-shadow-sm">
                  Esercizi
                </Text>
                {selectedCount > 0 && <Badge color="green">{selectedCount}</Badge>}
              </Flex>
              <Text size="3" color="gray">
                Seleziona gli esercizi e configura serie, ripetizioni e peso
              </Text>
            </div>
          </Flex>
        </Flex>

        {selectedCount > 0 && (
          <div className="p-4 bg-green-100/80 backdrop-blur-sm border border-green-200/50 rounded-xl shadow-lg">
            <Flex align="center" gap="3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <Badge color="green" size="2">
                {selectedCount} esercizi selezionati
              </Badge>
            </Flex>
          </div>
        )}

        {exercises.length === 0 ? (
          <div className="text-center py-16">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <Text size="5" color="gray">
              Nessun esercizio disponibile
            </Text>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto pr-4 space-y-4">
            {exercises.map((esercizio, index) => (
              <div
                key={esercizio.id}
                className={`p-6 transition-all duration-300 border-2 rounded-xl shadow-lg ${
                  esercizio.checked
                    ? "bg-blue-100/60 backdrop-blur-sm border-blue-200/50 shadow-md"
                    : "bg-white/20 backdrop-blur-sm border-white/40 hover:bg-white/30 hover:shadow-xl"
                }`}
              >
                <Flex direction="column" gap="4">
                  <Flex align="center" justify="between">
                    <Flex align="center" gap="4">
                      <input
                        type="checkbox"
                        id={`esercizio-${esercizio.id}`}
                        checked={esercizio.checked}
                        onChange={(e) => updateExercise(index, "checked", e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <Text
                        size="5"
                        weight="bold"
                        className={`cursor-pointer transition-colors ${
                          esercizio.checked ? "text-blue-700" : "text-gray-700"
                        }`}
                        onClick={() => updateExercise(index, "checked", !esercizio.checked)}
                      >
                        {esercizio.nome}
                      </Text>
                    </Flex>
                    {esercizio.checked && (
                      <Badge color="blue" variant="soft">
                        Selezionato
                      </Badge>
                    )}
                  </Flex>

                  {esercizio.checked && (
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-blue-200/50">
                      <div className="space-y-3">
                        <Flex align="center" gap="2">
                          <RotateCcw className="h-4 w-4 text-gray-600" />
                          <Text size="2" weight="medium" color="gray">
                            Serie
                          </Text>
                        </Flex>
                        <input
                          type="number"
                          placeholder="3"
                          value={esercizio.serie}
                          onChange={(e) => updateExercise(index, "serie", e.target.value)}
                          className="w-full h-11 px-3 text-center text-base font-semibold bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60 focus:bg-white/25 transition-all duration-200 shadow-lg"
                          min="1"
                          max="10"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <Flex align="center" gap="2">
                          <Target className="h-4 w-4 text-gray-600" />
                          <Text size="2" weight="medium" color="gray">
                            Ripetizioni
                          </Text>
                        </Flex>
                        <input
                          type="number"
                          placeholder="12"
                          value={esercizio.ripetizioni}
                          onChange={(e) => updateExercise(index, "ripetizioni", e.target.value)}
                          className="w-full h-11 px-3 text-center text-base font-semibold bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60 focus:bg-white/25 transition-all duration-200 shadow-lg"
                          min="1"
                          max="50"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <Flex align="center" gap="2">
                          <Weight className="h-4 w-4 text-gray-600" />
                          <Text size="2" weight="medium" color="gray">
                            Peso (kg)
                          </Text>
                        </Flex>
                        <input
                          type="number"
                          placeholder="20"
                          value={esercizio.peso}
                          onChange={(e) => updateExercise(index, "peso", e.target.value)}
                          className="w-full h-11 px-3 text-center text-base font-semibold bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60 focus:bg-white/25 transition-all duration-200 shadow-lg"
                          min="0"
                          step="0.5"
                        />
                      </div>
                    </div>
                  )}
                </Flex>
              </div>
            ))}
          </div>
        )}
      </Flex>
    </div>
  )
}
