import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Save,
  FileIcon as FileTemplate,
  Target,
  Dumbbell,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Text, Flex } from "@radix-ui/themes";
import toast from "react-hot-toast";
import ExerciseSelector from "@/components/workout/ExerciseSelector";
import { useAxios } from "@/contexts/AxiosProvider";
import usePageTitle from "@/hooks/usePageTitle";

export default function TemplateNew() {
  usePageTitle("Nuovo Template");
  const navigate = useNavigate();
  const axios = useAxios();
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    titolo: "",
    descrizione: "",
    esercizi: [],
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get("/exercises");
      setExercises(response.data);
    } catch (error) {
      toast.error("Errore nel caricamento degli esercizi");

      setExercises([
        { id: "1", nome: "Panca Piana", categoria: "Petto" },
        { id: "2", nome: "Squat", categoria: "Gambe" },
        { id: "3", nome: "Stacchi", categoria: "Schiena" },
        { id: "4", nome: "Trazioni", categoria: "Schiena" },
        { id: "5", nome: "Military Press", categoria: "Spalle" },
        { id: "6", nome: "Curl Bicipiti", categoria: "Braccia" },
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.titolo.trim()) {
      setErrorMessage("Il titolo è obbligatorio");
      toast.error("Il titolo è obbligatorio");
      return;
    }

    if (formData.esercizi.length === 0) {
      setErrorMessage("Seleziona almeno un esercizio");
      toast.error("Seleziona almeno un esercizio");
      return;
    }

    setLoading(true);

    try {
      const templateData = {
        titolo: formData.titolo.trim(),
        descrizione: formData.descrizione.trim(),
        esercizi: formData.esercizi.map((e) => ({
          esercizioId: e.esercizioId,
          serie: Number(e.serie),
          ripetizioni: Number(e.ripetizioni),
          ...(e.peso && { peso: Number(e.peso) }),
        })),
      };

      await axios.post("/workouts/templates", templateData);

      toast.success("Template creato con successo! 🎉");
      navigate("/coach/templates");
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setErrorMessage("Errore nella creazione del template");
        toast.error("Errore nella creazione del template");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50"></div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 grid">
          <Flex align="center" justify="center" gap="4" className="mb-8">
            <div className="p-4 bg-white/30 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg">
              <FileTemplate className="h-10 w-10 text-blue-600" />
            </div>
          </Flex>
          <Text
            as="h1"
            size="9"
            weight="bold"
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm"
          >
            Nuovo Template
          </Text>
          <Text size="5" color="gray" className="max-w-2xl mx-auto">
            Crea un template riutilizzabile per i tuoi allenamenti
          </Text>
        </div>

        {/* Back Button */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-4 shadow-lg">
          <button
            onClick={() => navigate("/coach/templates")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna ai Template
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4 shadow-lg">
            <Flex align="center" gap="3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <Text color="red" weight="medium" size="3">
                {errorMessage}
              </Text>
            </Flex>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informazioni base */}
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
            <Flex direction="column" gap="6">
              <Flex
                align="center"
                gap="3"
                className="pb-4 border-b border-white/30"
              >
                <div className="p-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl shadow-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <Text size="6" weight="bold" className="text-gray-800">
                    Informazioni Template
                  </Text>
                  <Text size="3" color="gray">
                    Dettagli principali del template
                  </Text>
                </div>
              </Flex>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <Flex align="center" gap="2">
                      <FileTemplate className="h-4 w-4 text-blue-600" />
                      Titolo Template *
                    </Flex>
                  </label>
                  <input
                    type="text"
                    value={formData.titolo}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        titolo: e.target.value,
                      }))
                    }
                    className="w-full h-12 px-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60 focus:bg-white/60 transition-all duration-200 shadow-lg"
                    placeholder="es. Allenamento Petto e Tricipiti"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <Flex align="center" gap="2">
                      <Target className="h-4 w-4 text-blue-600" />
                      Descrizione
                    </Flex>
                  </label>
                  <textarea
                    value={formData.descrizione}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        descrizione: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60 focus:bg-white/60 transition-all duration-200 shadow-lg resize-none"
                    placeholder="Descrizione del template..."
                    rows="4"
                  />
                </div>
              </div>
            </Flex>
          </div>

          {/* Esercizi */}
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
            <Flex direction="column" gap="6">
              <Flex
                align="center"
                gap="3"
                className="pb-4 border-b border-white/30"
              >
                <div className="p-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl shadow-lg">
                  <Dumbbell className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <Text size="6" weight="bold" className="text-gray-800">
                    Esercizi
                  </Text>
                  <Text size="3" color="gray">
                    {formData.esercizi.length} esercizi aggiunti
                  </Text>
                </div>
              </Flex>

              {/* Exercise Selector */}
              <ExerciseSelector
                selectedExercises={formData.esercizi}
                onExercisesChange={(exercises) =>
                  setFormData((prev) => ({ ...prev, esercizi: exercises }))
                }
                allExercises={exercises}
              />
            </Flex>
          </div>

          {/* Actions */}
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl ring-1 ring-white/20">
            <Flex gap="4" justify="center" className="flex-wrap">
              <button
                type="submit"
                disabled={
                  loading ||
                  !formData.titolo.trim() ||
                  formData.esercizi.length === 0
                }
                className="min-w-48 h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    <Text size="4" weight="bold">
                      Creazione in corso...
                    </Text>
                  </>
                ) : (
                  <>
                    <Save className="h-6 w-6" />
                    <Text size="4" weight="bold">
                      Crea Template
                    </Text>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/coach/templates")}
                disabled={loading}
                className="min-w-32 h-14 px-6 bg-white/50 hover:bg-white/70 backdrop-blur-sm border border-white/50 text-gray-700 rounded-2xl font-medium shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <X className="h-5 w-5" />
                <Text size="4" weight="medium">
                  Annulla
                </Text>
              </button>
            </Flex>
          </div>
        </form>
      </div>
    </div>
  );
}
