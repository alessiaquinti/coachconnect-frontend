import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAxios } from "@/contexts/AxiosProvider";
import { Text, Flex } from "@radix-ui/themes";
import { Dumbbell, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import ExerciseSelector from "@/components/workout/ExerciseSelector";
import usePageTitle from "@/hooks/usePageTitle";

export default function TemplateEdit() {
  usePageTitle("Duplica Template");
  const { id } = useParams();
  const axios = useAxios();
  const navigate = useNavigate();

  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templateRes, exercisesRes] = await Promise.all([
          axios.get(`/workouts/templates/${id}`),
          axios.get("/exercises"),
        ]);

        const template = templateRes.data;
        setTitolo(template.titolo);
        setDescrizione(template.descrizione || "");
        setSelectedExercises(
          template.esercizi.map((e) => ({
            esercizioId: e.esercizioId || e.esercizio?.id,
            nome: e.esercizio?.nome || e.nome,
            serie: e.serie,
            ripetizioni: e.ripetizioni,
            peso: e.peso,
          }))
        );
        setAllExercises(exercisesRes.data);
      } catch (error) {
        setErrorMessage("Errore nel caricamento del template");
        toast.error("Errore nel caricamento del template");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [axios, id]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage("");

    if (!titolo.trim()) {
      setErrorMessage("Il titolo è obbligatorio");
      toast.error("Il titolo è obbligatorio");
      setIsLoading(false);
      return;
    }

    if (selectedExercises.length === 0) {
      setErrorMessage("Seleziona almeno un esercizio");
      toast.error("Seleziona almeno un esercizio");
      setIsLoading(false);
      return;
    }

    try {
      const updatedData = {
        titolo: titolo.trim(),
        descrizione: descrizione.trim(),
        esercizi: selectedExercises.map((e) => ({
          esercizioId: e.esercizioId,
          serie: Number(e.serie),
          ripetizioni: Number(e.ripetizioni),
          ...(e.peso && { peso: Number(e.peso) }),
        })),
      };

      await axios.put(`/workouts/templates/${id}`, updatedData);

      toast.success("Template aggiornato con successo!");
      navigate("/coach/templates");
    } catch (error) {
      toast.error("Errore durante il salvataggio");
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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50"></div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 grid">
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
            Duplica Template
          </Text>
          <Text size="5" color="gray" className="max-w-2xl mx-auto">
            Modifica e aggiorna questo template di allenamento
          </Text>
        </div>

        {/* Back */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-4 shadow-lg">
          <button
            onClick={() => navigate("/coach/templates")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna ai Template
          </button>
        </div>

        {/* Error */}
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

        {/* Campi titolo e descrizione */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Titolo
            </label>
            <input
              type="text"
              value={titolo}
              onChange={(e) => setTitolo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Descrizione
            </label>
            <textarea
              value={descrizione}
              onChange={(e) => setDescrizione(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Exercise Selector */}
        <ExerciseSelector
          selectedExercises={selectedExercises}
          onExercisesChange={setSelectedExercises}
          allExercises={allExercises}
        />

        {/* Submit */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            {isLoading ? "Salvataggio in corso..." : "Salva modifiche"}
          </button>
        </div>
      </div>
    </div>
  );
}
