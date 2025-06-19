"use client"

import { useState, useEffect } from "react"
import { useAxios } from "@/contexts/AxiosProvider"
import { Text, Flex, Badge, Button } from "@radix-ui/themes"
import { ChevronLeft, ChevronRight, Calendar, CheckCircle, Clock, Dumbbell, Target, RotateCcw } from "lucide-react"
import { toast } from "react-hot-toast"
import usePageTitle from "@/hooks/usePageTitle"

export default function MemberCalendar() {
  usePageTitle("Calendario")
  const axios = useAxios()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkouts()
  }, [currentDate])

  const fetchWorkouts = async () => {
    try {
      const startOfWeek = getStartOfWeek(currentDate)
      const endOfWeek = getEndOfWeek(currentDate)


      const response = await axios.get("/workouts/calendar/client", {
        params: {
          start: startOfWeek.toISOString(),
          end: endOfWeek.toISOString(),
        },
      })

      console.log("📅 Workouts calendario ricevuti:", response.data)
      setWorkouts(response.data)
    } catch (error) {
      toast.error("Errore nel caricamento del calendario")
    } finally {
      setLoading(false)
    }
  }

  const getStartOfWeek = (date) => {
    const start = new Date(date)
    const day = start.getDay()
    const diff = start.getDate() - day + (day === 0 ? -6 : 1) 
    start.setDate(diff)
    start.setHours(0, 0, 0, 0)
    return start
  }

  const getEndOfWeek = (date) => {
    const end = getStartOfWeek(date)
    end.setDate(end.getDate() + 6)
    end.setHours(23, 59, 59, 999)
    return end
  }

  const getDaysOfWeek = () => {
    const start = getStartOfWeek(currentDate)
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      days.push(day)
    }
    return days
  }

  const getWorkoutsForDay = (date) => {
    const dateStr = date.toISOString().split("T")[0]
    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.dataConsigliata || workout.data)
      return workoutDate.toISOString().split("T")[0] === dateStr
    })
  }

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + direction * 7)
    setCurrentDate(newDate)
  }

  const handleCompleteWorkout = async (workoutId) => {
    try {
      await axios.patch(`/workouts/${workoutId}/complete`)
      toast.success("Allenamento completato! 🎉")

      setWorkouts((prev) =>
        prev.map((w) => (w.id === workoutId ? { ...w, completato: true, completatoIl: new Date().toISOString() } : w)),
      )
    } catch (error) {
      toast.error("Errore durante il completamento")
    }
  }

  const days = getDaysOfWeek()
  const dayNames = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-25 to-blue-50"></div>
        <div className="relative z-10 max-w-6xl mx-auto p-6">
          <div className="text-center py-16">
            <div className="h-16 w-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <Text size="5" color="gray">
              Caricamento calendario...
            </Text>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-25 to-blue-50"></div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Flex align="center" justify="center" gap="3" className="mb-6">
            <div className="p-4 bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </Flex>
          <Text
            as="h1"
            size="8"
            weight="bold"
            className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm"
          >
            Calendario Allenamenti
          </Text>
          <Text size="4" color="gray" className="max-w-2xl mx-auto">
            Visualizza i tuoi allenamenti programmati per la settimana
          </Text>
        </div>

        {/* Navigazione settimana */}
        <div className="flex items-center justify-between bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl ring-1 ring-white/20">
          <Button
            onClick={() => navigateWeek(-1)}
            variant="ghost"
            size="3"
            className="p-3 hover:bg-white/20 rounded-xl"
          >
            <ChevronLeft size={20} />
          </Button>

          <div className="text-center">
            <Text size="6" weight="bold" className="text-gray-800">
              {days[0].toLocaleDateString("it-IT", { day: "numeric", month: "long" })} -{" "}
              {days[6].toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
            </Text>
          </div>

          <Button onClick={() => navigateWeek(1)} variant="ghost" size="3" className="p-3 hover:bg-white/20 rounded-xl">
            <ChevronRight size={20} />
          </Button>
        </div>

        {/* Griglia calendario */}
        <div className="grid grid-cols-7 gap-4">
          {days.map((day, index) => {
            const dayWorkouts = getWorkoutsForDay(day)
            const isToday = day.toDateString() === new Date().toDateString()

            return (
              <div
                key={day.toISOString()}
                className={`bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl p-4 min-h-[300px] shadow-xl ring-1 ring-white/20 ${
                  isToday ? "ring-2 ring-purple-500 bg-purple-50/30" : ""
                }`}
              >
                <div className="text-center mb-4">
                  <Text size="2" color="gray" className="block">
                    {dayNames[index]}
                  </Text>
                  <Text size="5" weight="bold" className={`${isToday ? "text-purple-600" : "text-gray-900"}`}>
                    {day.getDate()}
                  </Text>
                </div>

                <div className="space-y-3">
                  {dayWorkouts.map((workout) => (
                    <WorkoutCalendarCard key={workout.id} workout={workout} onComplete={handleCompleteWorkout} />
                  ))}

                  {dayWorkouts.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-8">
                      <Dumbbell size={32} className="mx-auto mb-2 opacity-50" />
                      <Text size="2">Nessun allenamento</Text>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Statistiche settimanali */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl ring-1 ring-white/20 text-center">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <Text size="6" weight="bold" className="block text-blue-600">
              {workouts.length}
            </Text>
            <Text size="3" color="gray">
              Allenamenti questa settimana
            </Text>
          </div>

          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl ring-1 ring-white/20 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <Text size="6" weight="bold" className="block text-green-600">
              {workouts.filter((w) => w.completato).length}
            </Text>
            <Text size="3" color="gray">
              Completati
            </Text>
          </div>

          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl ring-1 ring-white/20 text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-3" />
            <Text size="6" weight="bold" className="block text-orange-600">
              {workouts.filter((w) => !w.completato).length}
            </Text>
            <Text size="3" color="gray">
              Da completare
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

function WorkoutCalendarCard({ workout, onComplete }) {
  const formatTime = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-2xl p-3 shadow-lg">
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Text size="2" weight="bold" className="text-gray-800 line-clamp-1">
            {workout.titolo}
          </Text>
          {workout.completato ? (
            <Badge color="green" variant="soft" size="1">
              <CheckCircle size={10} />
            </Badge>
          ) : (
            <Badge color="orange" variant="soft" size="1">
              <Clock size={10} />
            </Badge>
          )}
        </div>

        {/* Orario */}
        {workout.dataConsigliata && (
          <Text size="1" color="gray">
            {formatTime(workout.dataConsigliata)}
          </Text>
        )}

        {/* Coach */}
        {workout.coach && (
          <Text size="1" color="purple" className="font-medium">
            Coach: {workout.coach.name}
          </Text>
        )}

        {/* Stats mini */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Flex align="center" gap="1">
            <Target size={10} />
            <span>{workout.totalEsercizi || 0}</span>
          </Flex>
          <Flex align="center" gap="1">
            <RotateCcw size={10} />
            <span>{workout.totalSerie || 0}</span>
          </Flex>
        </div>

        {/* Action */}
        {!workout.completato && (
          <Button
            onClick={() => onComplete(workout.id)}
            size="1"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-xs"
          >
            Completa
          </Button>
        )}
      </div>
    </div>
  )
}
