"use client";

import { useEffect, useState } from "react";
import { useAxios } from "@/contexts/AxiosProvider";
import { Text, Flex, Badge, Button } from "@radix-ui/themes";
import {
  Dumbbell,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  Weight,
  RotateCcw,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";
import usePageTitle from "@/hooks/usePageTitle";

export default function MemberWorkouts() {
  usePageTitle("Dettagli Workout");
  const axios = useAxios();
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completingWorkout, setCompletingWorkout] = useState(null);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const response = await axios.get("/workouts/client/my");
      setWorkouts(response.data);
    } catch (error) {
      toast.error("Errore nel caricamento degli allenamenti");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteWorkout = async (workoutId) => {
    setCompletingWorkout(workoutId);
    try {
      await axios.patch(`/workouts/${workoutId}/complete`);
      toast.success("Allenamento completato! ");

      setWorkouts((prev) =>
        prev.map((w) =>
          w.allenamento.id === workoutId
            ? { ...w, completato: true, completatoIl: new Date().toISOString() }
            : w
        )
      );
    } catch (error) {
      toast.error("Errore durante il completamento");
    } finally {
      setCompletingWorkout(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Template";
    const date = new Date(dateString);
    return date.toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-25 to-blue-50"></div>
        <div className="relative z-10 max-w-6xl mx-auto p-6">
          <div className="text-center py-16">
            <div className="h-16 w-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <Text size="5" color="gray">
              Caricamento allenamenti...
            </Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sfondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-25 to-blue-50"></div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 grid">
          <Flex align="center" justify="center" gap="3" className="mb-6">
            <div className="p-4 bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg">
              <Dumbbell className="h-8 w-8 text-purple-600" />
            </div>
          </Flex>
          <Text
            as="h1"
            size="8"
            weight="bold"
            className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm"
          >
            I Miei Allenamenti
          </Text>
          <Text size="4" color="gray" className="max-w-2xl mx-auto">
            Visualizza e completa gli allenamenti assegnati dal tuo coach
          </Text>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl ring-1 ring-white/20 text-center">
            <Text size="6" weight="bold" className="block text-purple-600">
              {workouts.length}
            </Text>
            <Text size="3" color="gray">
              Totali
            </Text>
          </div>
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl ring-1 ring-white/20 text-center">
            <Text size="6" weight="bold" className="block text-green-600">
              {workouts.filter((w) => w.completato).length}
            </Text>
            <Text size="3" color="gray">
              Completati
            </Text>
          </div>
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl ring-1 ring-white/20 text-center">
            <Text size="6" weight="bold" className="block text-orange-600">
              {workouts.filter((w) => !w.completato).length}
            </Text>
            <Text size="3" color="gray">
              Da completare
            </Text>
          </div>
        </div>

        {/* Workouts List */}
        {workouts.length === 0 ? (
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-16 shadow-2xl ring-1 ring-white/20 text-center">
            <Dumbbell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <Text size="6" weight="bold" color="gray" className="block mb-2">
              Nessun allenamento assegnato
            </Text>
            <Text size="4" color="gray">
              Il tuo coach non ti ha ancora assegnato allenamenti
            </Text>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {workouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onComplete={handleCompleteWorkout}
                isCompleting={completingWorkout === workout.allenamento.id}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WorkoutCard({ workout, onComplete, isCompleting, formatDate }) {
  const { allenamento, completato, completatoIl } = workout;
  const exerciseCount = allenamento.esercizi?.length || 0;
  const totalSets =
    allenamento.esercizi?.reduce((acc, ex) => acc + (ex.serie || 0), 0) || 0;

  return (
    <div className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl ring-1 ring-white/20 hover:shadow-2xl transition-all duration-300">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex align="center" justify="between">
          <div className="flex-1">
            <Text size="5" weight="bold" className="block mb-2 text-gray-800">
              {allenamento.titolo}
            </Text>
            <Flex align="center" gap="2" className="mb-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Text size="2" color="gray">
                {formatDate(allenamento.data)}
              </Text>
              {completato ? (
                <Badge color="green" variant="soft" size="1">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Completato
                </Badge>
              ) : (
                <Badge color="orange" variant="soft" size="1">
                  <Clock className="h-3 w-3 mr-1" />
                  Da completare
                </Badge>
              )}
            </Flex>
          </div>
        </Flex>

        {/* Description */}
        {allenamento.descrizione && (
          <Text size="3" color="gray" className="line-clamp-2">
            {allenamento.descrizione}
          </Text>
        )}

        {/* Coach */}
        {allenamento.User && (
          <Flex align="center" gap="2">
            <User className="h-4 w-4 text-purple-600" />
            <Text size="2" color="gray">
              Coach:{" "}
              <span className="font-medium text-purple-600">
                {allenamento.User.name}
              </span>
            </Text>
          </Flex>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-lg">
            <Text size="3" weight="bold" className="block text-blue-600">
              {exerciseCount}
            </Text>
            <Text size="1" color="gray">
              Esercizi
            </Text>
          </div>
          <div className="text-center p-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-lg">
            <Text size="3" weight="bold" className="block text-purple-600">
              {totalSets}
            </Text>
            <Text size="1" color="gray">
              Serie Tot.
            </Text>
          </div>
        </div>

        {/* Exercises Preview */}
        {allenamento.esercizi && allenamento.esercizi.length > 0 && (
          <div className="space-y-2">
            <Text size="3" weight="medium" className="text-gray-700">
              Esercizi:
            </Text>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {allenamento.esercizi.slice(0, 3).map((ex, idx) => (
                <div
                  key={ex.id}
                  className="flex items-center gap-3 p-2 bg-white/20 rounded-lg"
                >
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Text size="1" weight="bold" className="text-blue-600">
                      {idx + 1}
                    </Text>
                  </div>
                  <div className="flex-1">
                    <Text size="2" weight="medium" className="text-gray-700">
                      {ex.esercizio?.nome || "Esercizio"}
                    </Text>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Flex align="center" gap="1">
                      <RotateCcw className="h-3 w-3" />
                      <span>{ex.serie}</span>
                    </Flex>
                    <Flex align="center" gap="1">
                      <Target className="h-3 w-3" />
                      <span>{ex.ripetizioni}</span>
                    </Flex>
                    {ex.peso && (
                      <Flex align="center" gap="1">
                        <Weight className="h-3 w-3" />
                        <span>{ex.peso}kg</span>
                      </Flex>
                    )}
                  </div>
                </div>
              ))}
              {allenamento.esercizi.length > 3 && (
                <Text size="2" color="gray" className="text-center">
                  +{allenamento.esercizi.length - 3} altri esercizi
                </Text>
              )}
            </div>
          </div>
        )}

        {/* Completion Info */}
        {completato && completatoIl && (
          <div className="p-3 bg-green-100/80 backdrop-blur-sm border border-green-200/50 rounded-xl">
            <Flex align="center" gap="2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <Text size="2" color="green">
                Completato il {formatDate(completatoIl)}
              </Text>
            </Flex>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 border-t border-white/30">
          {!completato ? (
            <Button
              onClick={() => onComplete(allenamento.id)}
              disabled={isCompleting}
              size="3"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg"
            >
              <Flex align="center" gap="2">
                {isCompleting ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                {isCompleting ? "Completamento..." : "Segna come completato"}
              </Flex>
            </Button>
          ) : (
            <div className="text-center py-2">
              <Text size="3" color="green" weight="medium">
                Allenamento completato!
              </Text>
            </div>
          )}
        </div>
      </Flex>
    </div>
  );
}
