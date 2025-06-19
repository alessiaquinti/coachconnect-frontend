import { useEffect, useState } from "react";
import { useAxios } from "@/contexts/AxiosProvider";
import { useNavigate, useParams } from "react-router-dom";
import { Text, Flex } from "@radix-ui/themes";
import { Dumbbell, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import ExerciseSelector from "@/components/workout/ExerciseSelector";

export default function TemplateDuplicate() {
  const axios = useAxios();
  const navigate = useNavigate();
  const { id } = useParams();

  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [templateRes, eserciziRes] = await Promise.all([
          axios.get(`/workouts/templates/${id}`),
          axios.get("/exercises"),
        ]);

        const template = templateRes.data;
        setTitolo(template.titolo);
        setDescrizione(template.descrizione || "");
        setSelectedExercises(
          template.esercizi.map((ex) => ({
            esercizioId: ex.esercizioId || ex.esercizio?.id,
            serie: ex.serie,
            ripetizioni: ex.ripetizioni,
            peso: ex.peso || undefined,
          }))
        );
        setAllExercises(eserciziRes.data);
      } catch (error) {
        setErrorMessage("Errore nel caricamento del template");
        toast.error("Errore nel caricamento del template");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage("");

    if (selectedExercises.length === 0) {
      setErrorMessage("Seleziona almeno un esercizio");
      toast.error("Seleziona almeno un esercizio");
      setIsLoading(false);
      return;
    }

    try {
      const workoutData = {
        titolo: titolo.trim(),
        descrizione: descrizione.trim(),
        esercizi: selectedExercises.map((e) => ({
          esercizioId: e.esercizioId,
          serie: Number(e.serie),
          ripetizioni: Number(e.ripetizioni),
          ...(e.peso && { peso: Number(e.peso) }),
        })),
      };

      const response = await axios.post("/workouts/templates", workoutData);
      toast.success("Template duplicato correttamente!");
      navigate("/coach/templates");
    } catch (error) {
      toast.error("Errore durante la duplicazione");
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
              Caricamento template...
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
            Duplica Template Allenamento
          </Text>
          <Text size="5" color="gray" className="max-w-2xl mx-auto">
            Modifica i dettagli prima di salvare la copia del template
          </Text>
        </div>

        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-4 shadow-lg">
          <button
            onClick={() => navigate("/coach/templates")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna ai Template
          </button>
        </div>

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

        <div className="space-y-4">
          <input
            type="text"
            value={titolo}
            onChange={(e) => setTitolo(e.target.value)}
            placeholder="Titolo"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <textarea
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            placeholder="Descrizione"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[100px]"
          />
        </div>

        <ExerciseSelector
          selectedExercises={selectedExercises}
          onExercisesChange={setSelectedExercises}
          allExercises={allExercises}
        />

        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {isLoading ? "Salvataggio..." : "Salva Template Duplicato"}
          </button>
        </div>
      </div>
    </div>
  );
}
