import { useEffect, useState } from "react";
import { useAxios } from "@/contexts/AxiosProvider";
import { useNavigate } from "react-router-dom";
import { Text, Flex, Button, Badge } from "@radix-ui/themes";

import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Target,
  Dumbbell,
  Heart,
  Zap,
  Activity,
  Eye,
  ImageIcon,
  AlertCircle,
  Grid3X3,
  List,
  MoreVertical,
} from "lucide-react";
import ExerciseModal from "@/components/ExerciseModal.jsx";
import usePageTitle from "@/hooks/usePageTitle";

export default function ExerciseLibrary() {
  usePageTitle("Esercizi");
  const axios = useAxios();
  const navigate = useNavigate();
  const [esercizi, setEsercizi] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [exerciseUsageCount, setExerciseUsageCount] = useState(0);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    return `http://localhost:3000${imageUrl}`;
  };

  const loadEsercizi = () => {
    setIsLoading(true);
    axios
      .get("/exercises")
      .then((res) => {
        setEsercizi(res.data);
        setError(null);
      })
      .catch((err) => {
        setError("Errore nel caricamento degli esercizi");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadEsercizi();
  }, [axios]);

  const deleteExercise = async (id) => {
    setDeleteLoading(id);
    try {
      await axios.delete(`/exercises/${id}`);
      setEsercizi((prev) => prev.filter((e) => e.id !== id));
      setError(null);
    } catch (err) {
      setError("Errore durante l'eliminazione");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/coach/exercises/${id}/edit`);
  };

  const handleView = (exercise) => {
    setSelectedExercise(exercise);
  };

  const categories = [
    "all",
    ...new Set(esercizi.map((e) => e.categoria).filter(Boolean)),
  ];

  // Filter exercises
  const filteredEsercizi = esercizi.filter((esercizio) => {
    const matchesSearch =
      esercizio.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      esercizio.descrizione?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      esercizio.categoria?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || esercizio.categoria === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (categoria) => {
    switch (categoria?.toLowerCase()) {
      case "petto":
      case "chest":
        return Heart;
      case "gambe":
      case "legs":
        return Zap;
      case "schiena":
      case "back":
        return Activity;
      case "braccia":
      case "arms":
        return Dumbbell;
      default:
        return Target;
    }
  };

  const getCategoryColor = (categoria) => {
    switch (categoria?.toLowerCase()) {
      case "petto":
      case "chest":
        return "red";
      case "gambe":
      case "legs":
        return "blue";
      case "schiena":
      case "back":
        return "green";
      case "braccia":
      case "arms":
        return "purple";
      default:
        return "gray";
    }
  };

  const checkAndHandleDelete = async (exercise) => {
    try {
      const res = await axios.get(`/exercises/${exercise.id}/usage`);
      if (res.data.isUsed) {
        setExerciseToDelete(exercise);
        setExerciseUsageCount(res.data.count);
        setShowDeleteModal(true);
      } else {
        await deleteExercise(exercise.id);
      }
    } catch (err) {
      setError("Errore nel controllo dell'esercizio");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50"></div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-200/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-blue-200/10 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-10 w-20 h-20 bg-purple-200/10 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 grid">
          <Flex align="center" justify="center" gap="3" className="mb-6">
            <div className="p-4 bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg">
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </Flex>
          <Text
            as="h1"
            size="8"
            weight="bold"
            className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm"
          >
            Libreria Esercizi
          </Text>
          <Text size="4" color="gray" className="max-w-2xl mx-auto">
            Gestisci la tua collezione di esercizi con categorie, descrizioni e
            immagini
          </Text>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4 shadow-lg">
            <Flex align="center" gap="3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <Text color="red" weight="medium" size="3">
                {error}
              </Text>
            </Flex>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl ring-1 ring-white/20">
          <Flex direction="column" gap="4">
            {/* Top Row */}
            <Flex
              align="center"
              justify="between"
              gap="4"
              className="flex-wrap"
            >
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cerca esercizi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 text-base bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/60 focus:border-green-400/60 focus:bg-white/25 transition-all duration-200 shadow-lg"
                  />
                </div>
              </div>

              <Flex align="center" gap="3">
                {/* View Mode Toggle */}
                <Flex
                  align="center"
                  gap="1"
                  className="bg-gray-100/80 backdrop-blur-sm rounded-lg p-1 border border-gray-200/50"
                >
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-green-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-green-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </Flex>

                <Button
                  size="3"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg border border-green-300/50"
                  onClick={() => navigate("/coach/exercises/new")}
                >
                  <Plus className="h-5 w-5" />
                  Nuovo Esercizio
                </Button>
              </Flex>
            </Flex>

            {/* Categories Filter */}
            <div className="space-y-3">
              <Flex align="center" gap="2">
                <Filter className="h-4 w-4 text-gray-600" />
                <Text size="3" weight="medium" color="gray">
                  Filtra per categoria:
                </Text>
              </Flex>
              <Flex gap="2" className="flex-wrap">
                {categories.map((categoria) => {
                  const IconComponent =
                    categoria === "all" ? Target : getCategoryIcon(categoria);
                  const isActive = selectedCategory === categoria;
                  return (
                    <button
                      key={categoria}
                      onClick={() => setSelectedCategory(categoria)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                        isActive
                          ? "bg-green-100/80 border-green-300/50 text-green-700 backdrop-blur-sm shadow-lg"
                          : "bg-white/20 border-white/40 text-gray-600 hover:border-white/60 hover:bg-white/30 backdrop-blur-sm shadow-md"
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <Text size="2" weight="medium">
                        {categoria === "all" ? "Tutte" : categoria}
                      </Text>
                    </button>
                  );
                })}
              </Flex>
            </div>

            {/* Stats */}
            <Flex
              align="center"
              justify="between"
              className="pt-4 border-t border-white/30"
            >
              <Flex align="center" gap="6">
                <div className="text-center">
                  <Text size="4" weight="bold" className="block text-green-600">
                    {filteredEsercizi.length}
                  </Text>
                  <Text size="2" color="gray">
                    {filteredEsercizi.length === 1 ? "Esercizio" : "Esercizi"}
                  </Text>
                </div>
                <div className="text-center">
                  <Text size="4" weight="bold" className="block text-blue-600">
                    {categories.length - 1}
                  </Text>
                  <Text size="2" color="gray">
                    Categorie
                  </Text>
                </div>
              </Flex>
            </Flex>
          </Flex>
        </div>

        {/* Exercises List */}
        <div className="space-y-6">
          {isLoading ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl ring-1 ring-white/20 animate-pulse"
                >
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-200/50 rounded"></div>
                    <div className="h-4 bg-gray-200/50 rounded w-3/4"></div>
                    <div className="h-20 bg-gray-200/50 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEsercizi.length === 0 ? (
            <div className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl p-16 shadow-2xl ring-1 ring-white/20 text-center">
              <div className="space-y-6">
                <div className="p-6 bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 rounded-full w-fit mx-auto">
                  <BookOpen className="h-16 w-16 text-gray-400" />
                </div>
                <div>
                  <Text
                    size="6"
                    weight="bold"
                    color="gray"
                    className="block mb-2"
                  >
                    {searchTerm || selectedCategory !== "all"
                      ? "Nessun risultato trovato"
                      : "Nessun esercizio disponibile"}
                  </Text>
                  <Text size="4" color="gray">
                    {searchTerm || selectedCategory !== "all"
                      ? "Prova a modificare i filtri di ricerca"
                      : "Inizia creando il tuo primo esercizio"}
                  </Text>
                </div>
                {!searchTerm && selectedCategory === "all" && (
                  <Button
                    size="3"
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 border border-green-300/50"
                    onClick={() => navigate("/coach/exercises/new")}
                  >
                    <Plus className="h-5 w-5" />
                    Crea il tuo primo esercizio
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredEsercizi.map((esercizio) => {
                const CategoryIcon = getCategoryIcon(esercizio.categoria);
                const categoryColor = getCategoryColor(esercizio.categoria);
                const imageUrl = getImageUrl(esercizio.immagineUrl);

                return (
                  <div
                    key={esercizio.id}
                    className={`bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl ring-1 ring-white/20 hover:shadow-2xl transition-all duration-300 hover:border-green-200/50 group cursor-pointer ${
                      viewMode === "grid" ? "p-6" : "p-4"
                    }`}
                    onClick={() => handleView(esercizio)}
                  >
                    <Flex
                      direction={viewMode === "grid" ? "column" : "row"}
                      gap="4"
                    >
                      {imageUrl && (
                        <div
                          className={`relative overflow-hidden rounded-lg bg-gray-100 flex-shrink-0 ${
                            viewMode === "grid" ? "w-full h-48" : "w-24 h-24"
                          }`}
                        >
                          <img
                            src={imageUrl || "/placeholder.svg"}
                            alt={esercizio.nome}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          {/* Fallback */}
                          <div
                            className="absolute inset-0 flex items-center justify-center bg-gray-200"
                            style={{ display: "none" }}
                          >
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                        </div>
                      )}

                      {/* Content */}
                      <Flex direction="column" gap="3" className="flex-1">
                        {/* Header */}
                        <Flex align="center" justify="between">
                          <div className="flex-1">
                            <Text
                              size={viewMode === "grid" ? "5" : "4"}
                              weight="bold"
                              className="block mb-1 group-hover:text-green-600 transition-colors text-gray-800"
                            >
                              {esercizio.nome}
                            </Text>
                            {esercizio.categoria && (
                              <Badge
                                color={categoryColor}
                                variant="soft"
                                size="1"
                                className="bg-white/30 backdrop-blur-sm"
                              >
                                <CategoryIcon className="h-3 w-3 mr-1" />
                                {esercizio.categoria}
                              </Badge>
                            )}
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-5 w-5 text-gray-400" />
                          </div>
                        </Flex>

                        {/* Description */}
                        {esercizio.descrizione && (
                          <Text
                            size="3"
                            color="gray"
                            className={
                              viewMode === "grid"
                                ? "line-clamp-3"
                                : "line-clamp-2"
                            }
                          >
                            {esercizio.descrizione}
                          </Text>
                        )}

                        {!imageUrl && viewMode === "grid" && (
                          <div className="w-full h-32 bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <Text size="2" color="gray">
                                Nessuna immagine
                              </Text>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <Flex gap="2" className="pt-2 border-t border-white/30">
                          <Button
                            size="2"
                            variant="soft"
                            className="flex-1 bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(esercizio);
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
                              e.stopPropagation();
                              handleEdit(esercizio.id);
                            }}
                          >
                            <Edit3 className="h-4 w-4" />
                            Modifica
                          </Button>
                          <Button
                            size="2"
                            variant="soft"
                            color="red"
                            disabled={deleteLoading === esercizio.id}
                            className="bg-red-100/80 backdrop-blur-sm border border-red-200/50 hover:bg-red-200/80"
                            onClick={(e) => {
                              e.stopPropagation();
                              checkAndHandleDelete(esercizio);
                            }}
                          >
                            {deleteLoading === esercizio.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </Flex>
                      </Flex>
                    </Flex>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* modal exercise detail */}
        {selectedExercise && (
          <ExerciseModal
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
          />
        )}

        {showDeleteModal && exerciseToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl w-full max-w-md border border-white/40 ring-1 ring-white/20">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Conferma eliminazione
              </h2>
              <p className="text-gray-700 mb-4">
                L'esercizio <strong>{exerciseToDelete.nome}</strong> è associato
                a <strong>{exerciseUsageCount}</strong> allenamento
                {exerciseUsageCount > 1 ? "i" : ""}.<br />
                Vuoi davvero eliminarlo? Le associazioni verranno rimosse.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setExerciseToDelete(null);
                  }}
                  className="btn-gray"
                >
                  Annulla
                </button>
                <button
                  onClick={async () => {
                    await deleteExercise(exerciseToDelete.id);
                    setShowDeleteModal(false);
                    setExerciseToDelete(null);
                  }}
                  className="btn-blue bg-red-500/80 hover:bg-red-600/80 border-red-300/50"
                >
                  Elimina comunque
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
