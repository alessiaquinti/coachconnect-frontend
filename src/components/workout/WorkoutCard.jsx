
import { useState } from "react"
import { Text, Flex, Badge, Button } from "@radix-ui/themes"
import { Calendar, User, Eye, Edit3, Trash2, Copy, MoreVertical } from "lucide-react"

export default function WorkoutCard({ workout, onView, onEdit, onDelete, onDuplicate, isDeleting = false }) {
  const [showDropdown, setShowDropdown] = useState(false)

  const formatDate = (dateString) => {
    if (!dateString) return "Template"
    const date = new Date(dateString)
    return date.toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getWorkoutStats = () => {
    const exerciseCount = workout.esercizi?.length || 0
    const totalSets = workout.esercizi?.reduce((acc, ex) => acc + (ex.serie || 0), 0) || 0
    return { exerciseCount, totalSets }
  }

  const stats = getWorkoutStats()

  const handleDropdownClick = (e, action) => {
    e.stopPropagation()
    setShowDropdown(false)
    action()
  }

  return (
    <div
      className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl ring-1 ring-white/20 hover:shadow-2xl transition-all duration-300 hover:border-blue-200/50 group cursor-pointer relative"
      onClick={() => onView(workout.id)}
    >
      {/* Dropdown Menu */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowDropdown(!showDropdown)
          }}
          className="p-2 rounded-lg bg-white/30 backdrop-blur-sm border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
        >
          <MoreVertical className="h-4 w-4 text-gray-600" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl shadow-2xl ring-1 ring-white/20 py-2 z-20">
            <button
              onClick={(e) => handleDropdownClick(e, () => onView(workout.id))}
              className="w-full px-4 py-2 text-left hover:bg-white/50 transition-colors flex items-center gap-2 text-gray-700"
            >
              <Eye className="h-4 w-4" />
              Visualizza
            </button>
            <button
              onClick={(e) => handleDropdownClick(e, () => onEdit(workout.id))}
              className="w-full px-4 py-2 text-left hover:bg-white/50 transition-colors flex items-center gap-2 text-gray-700"
            >
              <Edit3 className="h-4 w-4" />
              Modifica
            </button>
            <button
              onClick={(e) => handleDropdownClick(e, () => onDuplicate(workout.id))}
              className="w-full px-4 py-2 text-left hover:bg-white/50 transition-colors flex items-center gap-2 text-gray-700"
            >
              <Copy className="h-4 w-4" />
              Duplica
            </button>
            <div className="border-t border-gray-200/50 my-1"></div>
            <button
              onClick={(e) => handleDropdownClick(e, () => onDelete(workout.id))}
              disabled={isDeleting}
              className="w-full px-4 py-2 text-left hover:bg-red-50/50 transition-colors flex items-center gap-2 text-red-600 disabled:opacity-50"
            >
              {isDeleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Elimina
            </button>
          </div>
        )}
      </div>

      <Flex direction="column" gap="4">
        {/* Header */}
        <div>
          <Text
            size="5"
            weight="bold"
            className="block mb-2 group-hover:text-blue-600 transition-colors text-gray-800 pr-8"
          >
            {workout.nome || workout.titolo || "Allenamento"}
          </Text>
          <Flex align="center" gap="2" className="mb-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Text size="2" color="gray">
              {formatDate(workout.dataAllenamento || workout.data)}
            </Text>
            {workout.status && (
              <Badge
                color={workout.status === "programmato" ? "green" : workout.status === "template" ? "blue" : "gray"}
                variant="soft"
                size="1"
              >
                {workout.status}
              </Badge>
            )}
          </Flex>
        </div>

        {/* Description */}
        {workout.descrizione && (
          <Text size="3" color="gray" className="line-clamp-2">
            {workout.descrizione}
          </Text>
        )}

        {/* Stats */}
        <Flex gap="4" className="pt-2 border-t border-white/30">
          <div className="text-center">
            <Text size="3" weight="bold" className="block text-blue-600">
              {stats.exerciseCount}
            </Text>
            <Text size="1" color="gray">
              Esercizi
            </Text>
          </div>
          <div className="text-center">
            <Text size="3" weight="bold" className="block text-purple-600">
              {stats.totalSets}
            </Text>
            <Text size="1" color="gray">
              Serie Tot.
            </Text>
          </div>
        </Flex>

        {/* Client */}
        {workout.cliente && (
          <div>
            <Text size="2" color="gray" className="mb-2 flex items-center gap-1">
              <User className="h-3 w-3" />
              Assegnato a:
            </Text>
            <Badge
              color="purple"
              variant="soft"
              size="1"
              className="bg-purple-100/80 backdrop-blur-sm border border-purple-200/50"
            >
              {workout.cliente.user?.name || "Cliente"}
            </Badge>
          </div>
        )}

        {/* Actions */}
        <Flex gap="2" className="pt-2 border-t border-white/30">
          <Button
            size="2"
            variant="soft"
            className="flex-1 bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40"
            onClick={(e) => {
              e.stopPropagation()
              onView(workout.id)
            }}
          >
            <Eye className="h-4 w-4" />
            Visualizza
          </Button>
          <Button
            size="2"
            variant="soft"
            className="bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(workout.id)
            }}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </Flex>
      </Flex>
    </div>
  )
}
