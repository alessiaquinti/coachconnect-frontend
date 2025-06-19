"use client";

import { useState, useEffect } from "react";
import { useAxios } from "@/contexts/AxiosProvider";
import { Text, Flex, Badge, Button } from "@radix-ui/themes";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Dumbbell,
} from "lucide-react";
import { toast } from "react-hot-toast";
import usePageTitle from "@/hooks/usePageTitle";

export default function WorkoutCalendar() {
  usePageTitle("Calendario");
  const axios = useAxios();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, [currentDate]);

  const fetchWorkouts = async () => {
    try {
      const startOfWeek = getStartOfWeek(currentDate);
      const endOfWeek = getEndOfWeek(currentDate);

      const response = await axios.get("/workouts/calendar", {
        params: {
          start: startOfWeek.toISOString(),
          end: endOfWeek.toISOString(),
        },
      });

      setWorkouts(response.data);
    } catch (error) {
      toast.error("Errore nel caricamento del calendario");
    } finally {
      setLoading(false);
    }
  };

  const getStartOfWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getEndOfWeek = (date) => {
    const end = getStartOfWeek(date);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  const getDaysOfWeek = () => {
    const start = getStartOfWeek(currentDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getWorkoutsForDay = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.dataConsigliata || workout.data);
      return workoutDate.toISOString().split("T")[0] === dateStr;
    });
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const days = getDaysOfWeek();
  const dayNames = [
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
    "Domenica",
  ];
  const dayNamesShort = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  const dayGroups = [
    [days[0], days[1], days[2]],
    [days[3], days[4], days[5]],
    [days[6]],
  ];

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
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-25 to-blue-50"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 grid">
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
            Visualizza e gestisci gli allenamenti programmati per i tuoi clienti
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
              {days[0].toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
              })}{" "}
              -{" "}
              {days[6].toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </div>

          <Button
            onClick={() => navigateWeek(1)}
            variant="ghost"
            size="3"
            className="p-3 hover:bg-white/20 rounded-xl"
          >
            <ChevronRight size={20} />
          </Button>
        </div>

        <div className="space-y-4">
          {dayGroups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className={`grid gap-4 ${
                group.length === 3
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 md:grid-cols-1"
              }`}
            >
              {group.map((day, dayIndex) => {
                const globalDayIndex =
                  groupIndex === 2 ? 6 : groupIndex * 3 + dayIndex;
                const dayWorkouts = getWorkoutsForDay(day);
                const isToday =
                  day.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={day.toISOString()}
                    className={`bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl p-4 shadow-xl ring-1 ring-white/20 transition-all duration-300 hover:shadow-2xl ${
                      isToday ? "ring-2 ring-purple-500 bg-purple-50/30" : ""
                    } ${group.length === 1 ? "max-w-md mx-auto" : ""}`}
                  >
                    {/* Header del giorno */}
                    <div className="text-center mb-3 pb-2 border-b border-white/30">
                      <Text size="2" color="gray" className="block">
                        {dayNamesShort[globalDayIndex]}
                      </Text>
                      <Text
                        size="5"
                        weight="bold"
                        className={`${
                          isToday ? "text-purple-600" : "text-gray-900"
                        }`}
                      >
                        {day.getDate()}
                      </Text>
                    </div>

                    {/* Allenamenti del giorno */}
                    <div className="space-y-3 min-h-[120px]">
                      {dayWorkouts.length > 0 ? (
                        dayWorkouts.map((workout) => (
                          <CoachWorkoutCalendarCard
                            key={workout.id}
                            workout={workout}
                          />
                        ))
                      ) : (
                        <div className="text-center text-gray-400 py-8">
                          <Dumbbell
                            size={24}
                            className="mx-auto mb-2 opacity-50"
                          />
                          <Text size="2" color="gray">
                            Nessun allenamento
                          </Text>
                        </div>
                      )}
                    </div>

                    {/* Stats del giorno */}
                    {dayWorkouts.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-white/30">
                        <div className="grid grid-cols-4 gap-1 text-center">
                          <div>
                            <Text
                              size="2"
                              weight="bold"
                              className="block text-blue-600"
                            >
                              {dayWorkouts.length}
                            </Text>
                            <Calendar className="h-3 w-3 mx-auto text-gray-500" />
                          </div>
                          <div>
                            <Text
                              size="2"
                              weight="bold"
                              className="block text-green-600"
                            >
                              {dayWorkouts.reduce(
                                (acc, w) => acc + w.completati,
                                0
                              )}
                            </Text>
                            <CheckCircle className="h-3 w-3 mx-auto text-gray-500" />
                          </div>
                          <div>
                            <Text
                              size="2"
                              weight="bold"
                              className="block text-orange-600"
                            >
                              {dayWorkouts.reduce(
                                (acc, w) => acc + w.inCorso,
                                0
                              )}
                            </Text>
                            <Clock className="h-3 w-3 mx-auto text-gray-500" />
                          </div>
                          <div>
                            <Text
                              size="2"
                              weight="bold"
                              className="block text-purple-600"
                            >
                              {
                                new Set(
                                  dayWorkouts.flatMap((w) =>
                                    w.clienti.map((c) => c.id)
                                  )
                                ).size
                              }
                            </Text>
                            <Users className="h-3 w-3 mx-auto text-gray-500" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Statistiche settimanali */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              {workouts.reduce((acc, w) => acc + w.completati, 0)}
            </Text>
            <Text size="3" color="gray">
              Completati
            </Text>
          </div>

          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl ring-1 ring-white/20 text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-3" />
            <Text size="6" weight="bold" className="block text-orange-600">
              {workouts.reduce((acc, w) => acc + w.inCorso, 0)}
            </Text>
            <Text size="3" color="gray">
              In corso
            </Text>
          </div>

          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl ring-1 ring-white/20 text-center">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <Text size="6" weight="bold" className="block text-purple-600">
              {
                new Set(workouts.flatMap((w) => w.clienti.map((c) => c.id)))
                  .size
              }
            </Text>
            <Text size="3" color="gray">
              Clienti attivi
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoachWorkoutCalendarCard({ workout }) {
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/50">
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <Text
            size="3"
            weight="bold"
            className="text-gray-800 flex-1 line-clamp-1"
          >
            {workout.titolo}
          </Text>
          <Badge
            color="blue"
            variant="soft"
            size="1"
            className="bg-blue-100/80 backdrop-blur-sm ml-2"
          >
            Template
          </Badge>
        </div>

        {/* Orario */}
        {workout.dataConsigliata && (
          <Flex align="center" gap="1">
            <Clock className="h-3 w-3 text-gray-500" />
            <Text size="1" color="gray">
              {formatTime(workout.dataConsigliata)}
            </Text>
          </Flex>
        )}

        {/* Clienti */}
        <div className="space-y-1">
          <Text
            size="1"
            weight="medium"
            color="gray"
            className="flex items-center gap-1"
          >
            <Users className="h-3 w-3" />
            Clienti ({workout.clienti.length}):
          </Text>
          <div className="space-y-1 max-h-16 overflow-y-auto">
            {workout.clienti.slice(0, 2).map((cliente) => (
              <div
                key={cliente.id}
                className="flex items-center justify-between bg-white/30 backdrop-blur-sm rounded-lg p-1"
              >
                <Text size="1" className="text-gray-700 flex-1 line-clamp-1">
                  {cliente.nome}
                </Text>
                {cliente.completato ? (
                  <Badge
                    color="green"
                    variant="soft"
                    size="1"
                    className="bg-green-100/80 backdrop-blur-sm"
                  >
                    <CheckCircle size={8} />
                  </Badge>
                ) : (
                  <Badge
                    color="orange"
                    variant="soft"
                    size="1"
                    className="bg-orange-100/80 backdrop-blur-sm"
                  >
                    <Clock size={8} />
                  </Badge>
                )}
              </div>
            ))}
            {workout.clienti.length > 2 && (
              <Text size="1" color="gray" className="text-center py-1">
                +{workout.clienti.length - 2} altri
              </Text>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-1 pt-2 border-t border-white/30 text-center">
          <div>
            <Text size="2" weight="bold" className="block text-blue-600">
              {workout.totalAssegnazioni}
            </Text>
            <Text size="1" color="gray">
              Assegn.
            </Text>
          </div>
          <div>
            <Text size="2" weight="bold" className="block text-green-600">
              {workout.completati}
            </Text>
            <Text size="1" color="gray">
              Compl.
            </Text>
          </div>
          <div>
            <Text size="2" weight="bold" className="block text-orange-600">
              {workout.inCorso}
            </Text>
            <Text size="1" color="gray">
              In corso
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
