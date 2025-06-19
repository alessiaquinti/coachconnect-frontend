"use client";

import { useEffect, useState } from "react";
import { useAxios } from "@/contexts/AxiosProvider";
import { useNavigate } from "react-router-dom";
import { Text, Flex } from "@radix-ui/themes";
import { Dumbbell, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

import WorkoutForm from "@/components/workout/WorkoutForm";
import ExerciseSelector from "@/components/workout/ExerciseSelector";

export default function WorkoutNew() {
  const axios = useAxios();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsRes, exercisesRes] = await Promise.all([
          axios.get("/customers"),
          axios.get("/exercises"),
        ]);

        setClients(clientsRes.data);
        setExercises(exercisesRes.data);
      } catch (error) {
        setErrorMessage("Errore nel caricamento dei dati");
        toast.error("Errore nel caricamento dei dati");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [axios]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (selectedExercises.length === 0) {
        setErrorMessage("Seleziona almeno un esercizio");
        toast.error("Seleziona almeno un esercizio");
        return;
      }

      const workoutData = {
        titolo: formData.titolo.trim(),
        descrizione: formData.descrizione?.trim() || "",

        esercizi: selectedExercises.map((e) => ({
          esercizioId: e.esercizioId,
          serie: Number(e.serie) || 3,
          ripetizioni: Number(e.ripetizioni) || 10,
          ...(e.peso && { peso: Number(e.peso) }),
        })),

        ...(formData.clientiIds &&
          formData.clientiIds.length > 0 && {
            clientiIds: formData.clientiIds,
            ...(formData.dataConsigliata && {
              dataConsigliata: new Date(formData.dataConsigliata).toISOString(),
            }),
          }),
      };

      const response = await axios.post("/workouts", workoutData);

      const isTemplate =
        !workoutData.clientiIds || workoutData.clientiIds.length === 0;
      toast.success(
        isTemplate
          ? "Template creato con successo! 📝"
          : "Allenamento creato e assegnato! 🎉"
      );

      navigate("/coach/workouts");
    } catch (error) {
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        setErrorMessage(`Errori di validazione: ${validationErrors}`);
        toast.error(`Errori di validazione: ${validationErrors}`);
      } else if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
        toast.error(error.response.data.error);
      } else if (error.message) {
        setErrorMessage(error.message);
        toast.error(error.message);
      } else {
        setErrorMessage("Errore durante la creazione");
        toast.error("Errore durante la creazione");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center py-16">
            <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <Text size="5" color="gray">
              Caricamento...
            </Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sfondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50"></div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <Flex align="center" justify="center" gap="4" className="mb-8">
            <div className="p-4 bg-white/30 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg">
              <Dumbbell className="h-10 w-10 text-blue-600" />
            </div>
          </Flex>
          <Text
            as="h1"
            size="9"
            weight="bold"
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm"
          >
            Crea Nuovo Allenamento
          </Text>
          <Text size="5" color="gray" className="max-w-2xl mx-auto">
            Progetta un allenamento personalizzato per i tuoi clienti
          </Text>
        </div>

        {/* Back Button */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-4 shadow-lg">
          <button
            onClick={() => navigate("/coach/workouts")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna agli Allenamenti
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl shadow-lg">
            <Flex align="center" gap="3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <Text color="red" weight="medium" size="3">
                {errorMessage}
              </Text>
            </Flex>
          </div>
        )}

        {/* Form */}
        <WorkoutForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          clientOptions={clients}
          initialData={{ esercizi: selectedExercises }}
        />

        {/* Exercise Selector */}
        <ExerciseSelector
          selectedExercises={selectedExercises}
          onExercisesChange={setSelectedExercises}
          allExercises={exercises}
        />
      </div>
    </div>
  );
}
