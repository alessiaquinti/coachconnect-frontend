
import { Text, Flex } from "@radix-ui/themes"
import { Activity, Target, Weight, RotateCcw, Dumbbell } from "lucide-react"

export default function WorkoutExercisesList({ exercises = [] }) {
  return (
    <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
      <Flex direction="column" gap="6">
        <Flex align="center" gap="3">
          <div className="p-3 bg-green-100/80 backdrop-blur-sm border border-green-200/50 rounded-xl shadow-lg">
            <Dumbbell className="h-6 w-6 text-green-600" />
          </div>
          <Text size="6" weight="bold" className="text-gray-800">
            Esercizi ({exercises.length})
          </Text>
        </Flex>

        {exercises.length > 0 ? (
          <div className="space-y-4">
            {exercises.map((exercise, idx) => (
              <ExerciseCard key={exercise.id || idx} exercise={exercise} index={idx + 1} />
            ))}
          </div>
        ) : (
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-8 shadow-lg text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <Text color="gray" size="4">
              Nessun esercizio assegnato
            </Text>
          </div>
        )}
      </Flex>
    </div>
  )
}

function ExerciseCard({ exercise, index }) {
  return (
    <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <Flex direction="column" gap="4">
        <Flex align="center" gap="3">
          <div className="w-8 h-8 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-full flex items-center justify-center">
            <Text size="2" weight="bold" className="text-blue-600">
              {index}
            </Text>
          </div>
          <Text size="4" weight="bold" className="text-gray-800">
            {exercise.esercizio?.nome || exercise.nome || "Esercizio"}
          </Text>
        </Flex>

        {exercise.esercizio?.descrizione && (
          <Text size="3" color="gray" className="ml-11">
            {exercise.esercizio.descrizione}
          </Text>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-11">
          <div className="flex items-center gap-2 p-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-lg">
            <RotateCcw className="h-4 w-4 text-blue-600" />
            <div>
              <Text size="1" color="gray" className="block">
                Serie
              </Text>
              <Text size="3" weight="bold" className="text-gray-800">
                {exercise.serie || 0}
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-lg">
            <Target className="h-4 w-4 text-green-600" />
            <div>
              <Text size="1" color="gray" className="block">
                Ripetizioni
              </Text>
              <Text size="3" weight="bold" className="text-gray-800">
                {exercise.ripetizioni || 0}
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-lg">
            <Weight className="h-4 w-4 text-purple-600" />
            <div>
              <Text size="1" color="gray" className="block">
                Peso
              </Text>
              <Text size="3" weight="bold" className="text-gray-800">
                {exercise.peso || 0} kg
              </Text>
            </div>
          </div>
        </div>
      </Flex>
    </div>
  )
}
