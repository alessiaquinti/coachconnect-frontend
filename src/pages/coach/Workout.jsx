import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAxios } from "@/contexts/AxiosProvider";
import { Text, Flex, Badge } from "@radix-ui/themes";
import {
  Search,
  Grid3X3,
  List,
  Eye,
  Archive,
  ArchiveRestore,
  Users,
  CheckCircle,
  Dumbbell,
  AlertCircle,
  Plus,
  Calendar,
  Target,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import usePageTitle from "@/hooks/usePageTitle";

export default function Workout() {
  usePageTitle("Allenamenti");
  const axios = useAxios();
  const navigate = useNavigate();
  const location = useLocation();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("active");
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    fetchWorkouts();

    if (location.state?.message) {
      toast.success(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("/workouts/calendar");

      let workoutArray = [];

      if (Array.isArray(response.data)) {
        workoutArray = response.data;
      } else if (typeof response.data === "object" && response.data !== null) {
        Object.keys(response.data).forEach((dateKey) => {
          if (Array.isArray(response.data[dateKey])) {
            workoutArray.push(...response.data[dateKey]);
          }
        });
      }

      const workoutsWithArchive = workoutArray.map((workout) => ({
        ...workout,
        archived: workout.completato || false,
      }));

      setWorkouts(workoutsWithArchive);
    } catch (error) {
      setError("Errore nel caricamento degli allenamenti");

      if (error.response?.status === 401) {
        toast.error("Sessione scaduta, effettua nuovamente il login");
      } else if (error.response?.status === 403) {
        toast.error("Non hai i permessi per visualizzare gli allenamenti");
      } else {
        toast.error("Errore nel caricamento workout dal backend");
      }

      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (workoutId) => {
    if (!confirm("Sei sicuro di voler eliminare questo allenamento?")) return;

    try {
      await axios.delete(`/workouts/${workoutId}`);
      setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
      toast.success("Allenamento eliminato!");
    } catch (error) {
      if (error.response?.status === 404) {
        setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
        toast.success("Allenamento rimosso dalla lista");
      } else {
        toast.error("Errore durante l'eliminazione");
      }
    }
  };

  const handleView = (workout) => {
    navigate(`/coach/workout/${workout.id}`);
  };

  const filteredWorkouts = workouts.filter((workout) => {
    const matchesSearch =
      workout.titolo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.descrizione?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.clienti?.some((cliente) =>
        cliente.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTab =
      activeTab === "active" ? !workout.archived : workout.archived;

    return matchesSearch && matchesTab;
  });

  // Statistiche
  const safeWorkouts = Array.isArray(workouts) ? workouts : [];
  const completedWorkouts = safeWorkouts.filter((w) => w.completato);
  const inProgressWorkouts = safeWorkouts.filter(
    (w) => !w.completato && !w.archived
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50 flex items-center justify-center">
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl">
          <Flex align="center" gap="3">
            <div className="p-3 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-full shadow-lg">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <Text color="blue" size="5" weight="bold">
              Caricamento allenamenti...
            </Text>
          </Flex>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50 flex items-center justify-center">
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-16 shadow-2xl ring-1 ring-white/20 text-center">
          <div className="space-y-6">
            <div className="p-6 bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-full w-fit mx-auto">
              <AlertCircle className="h-16 w-16 text-red-600" />
            </div>
            <div>
              <Text size="6" weight="bold" color="red" className="block mb-2">
                Errore nel caricamento
              </Text>
              <Text size="4" color="gray" className="mb-6">
                {error}
              </Text>
            </div>
            <button
              onClick={fetchWorkouts}
              className="px-6 py-3 bg-blue-500/80 hover:bg-blue-600/80 backdrop-blur-sm border border-blue-300/50 text-white rounded-xl transition-all duration-200 shadow-lg"
            >
              Riprova
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50"
      style={{
        position: "relative",
        isolation: "isolate",
      }}
    >
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 grid">
          <Flex align="center" justify="center" gap="3" className="mb-6">
            <div className="p-4 bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg">
              <Dumbbell className="h-8 w-8 text-blue-600" />
            </div>
          </Flex>
          <Text
            as="h1"
            size="8"
            weight="bold"
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm"
          >
            Gestione Allenamenti
          </Text>
          <Text size="4" color="gray" className="max-w-2xl mx-auto">
            Visualizza e gestisci tutti gli allenamenti assegnati ai tuoi
            clienti ({safeWorkouts.length} totali)
          </Text>
        </div>

        {/* Actions */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl ring-1 ring-white/20">
          <Flex gap="4" justify="center" className="flex-wrap">
            <Link
              to="/coach/templates/new"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl shadow-lg border border-green-300/50 cursor-pointer transition-all duration-200 flex items-center gap-2 text-sm font-medium"
              style={{ pointerEvents: "auto" }}
            >
              <Plus className="h-5 w-5" />
              Nuovo Template
            </Link>
            <Link
              to="/coach/templates"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg border border-blue-300/50 cursor-pointer transition-all duration-200 flex items-center gap-2 text-sm font-medium"
              style={{ pointerEvents: "auto" }}
            >
              <Calendar className="h-5 w-5" />
              Vai ai Template
            </Link>
          </Flex>
        </div>

        {/* Tabs e Controls */}
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
                    placeholder="Cerca allenamenti per titolo, descrizione o cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 text-base bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60 focus:bg-white/25 transition-all duration-200 shadow-lg"
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
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    style={{ pointerEvents: "auto" }}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    style={{ pointerEvents: "auto" }}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </Flex>
              </Flex>
            </Flex>

            {/* Stats */}
            <Flex
              align="center"
              justify="between"
              className="pt-4 border-t border-white/30"
            >
              <Flex align="center" gap="6">
                <div className="text-center">
                  <Text size="4" weight="bold" className="block text-blue-600">
                    {filteredWorkouts.length}
                  </Text>
                  <Text size="2" color="gray">
                    Filtro
                  </Text>
                </div>
                <div className="text-center">
                  <Text size="4" weight="bold" className="block text-green-600">
                    {completedWorkouts.length}
                  </Text>
                  <Text size="2" color="gray">
                    Completati
                  </Text>
                </div>
                <div className="text-center">
                  <Text
                    size="4"
                    weight="bold"
                    className="block text-orange-600"
                  >
                    {inProgressWorkouts.length}
                  </Text>
                  <Text size="2" color="gray">
                    In Corso
                  </Text>
                </div>
                <div className="text-center">
                  <Text
                    size="4"
                    weight="bold"
                    className="block text-purple-600"
                  >
                    {safeWorkouts.length}
                  </Text>
                  <Text size="2" color="gray">
                    Totali
                  </Text>
                </div>
              </Flex>
            </Flex>
          </Flex>
        </div>

        {/* Workouts List */}
        <div className="space-y-6">
          {filteredWorkouts.length === 0 ? (
            <div className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl p-16 shadow-2xl ring-1 ring-white/20 text-center">
              <div className="space-y-6">
                <div className="p-6 bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 rounded-full w-fit mx-auto">
                  {activeTab === "active" ? (
                    <Dumbbell className="h-16 w-16 text-gray-400" />
                  ) : (
                    <Archive className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                <div>
                  <Text
                    size="6"
                    weight="bold"
                    color="gray"
                    className="block mb-2"
                  >
                    {searchTerm
                      ? "Nessun allenamento trovato"
                      : activeTab === "active"
                      ? "Nessun allenamento attivo"
                      : "Nessun allenamento archiviato"}
                  </Text>
                  <Text size="4" color="gray">
                    {searchTerm
                      ? "Prova a modificare i termini di ricerca"
                      : activeTab === "active"
                      ? "Gli allenamenti assegnati appariranno qui"
                      : "Gli allenamenti completati vengono archiviati automaticamente"}
                  </Text>
                </div>
                {!searchTerm && activeTab === "active" && (
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Link
                      to="/coach/templates"
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl shadow-lg border border-green-300/50 cursor-pointer transition-all duration-200 inline-flex items-center gap-2"
                      style={{ pointerEvents: "auto" }}
                    >
                      <Calendar className="h-5 w-5" />
                      Vai ai Template
                    </Link>
                    <Link
                      to="/coach/templates/new"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg border border-blue-300/50 cursor-pointer transition-all duration-200 inline-flex items-center gap-2"
                      style={{ pointerEvents: "auto" }}
                    >
                      <Plus className="h-5 w-5" />
                      Crea Template
                    </Link>
                  </div>
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
              {filteredWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onView={handleView}
                  onDelete={deleteWorkout}
                  viewMode={viewMode}
                  isArchived={activeTab === "archived"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkoutCard({
  workout,
  onView,
  onArchive,
  onDelete,
  viewMode,
  isArchived,
}) {
  const getWorkoutStats = () => {
    const clientCount =
      workout.clienti?.length || workout.totalAssegnazioni || 0;
    const exerciseCount = workout.esercizi?.length || 0;
    const completedClients =
      workout.completati ||
      workout.clienti?.filter((c) => c.completato)?.length ||
      0;
    return { clientCount, exerciseCount, completedClients };
  };

  const stats = getWorkoutStats();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const workoutTitle = workout.titolo || workout.name || "Senza titolo";
  const workoutDescription = workout.descrizione || workout.description;

  return (
    <div
      className={`bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl ring-1 ring-white/20 hover:shadow-2xl transition-all duration-300 hover:border-blue-200/50 group cursor-pointer relative ${
        viewMode === "grid" ? "p-6" : "p-4"
      }`}
      onClick={() => onView(workout)}
      style={{ pointerEvents: "auto" }}
    >
      <Flex direction={viewMode === "grid" ? "column" : "row"} gap="4">
        {/* Icon */}
        <div
          className={`flex-shrink-0 ${viewMode === "grid" ? "mx-auto" : ""}`}
        >
          <div
            className={`${
              workout.completato
                ? "bg-gradient-to-r from-green-500 to-blue-600"
                : "bg-gradient-to-r from-blue-500 to-purple-600"
            } rounded-full flex items-center justify-center shadow-lg ${
              viewMode === "grid" ? "w-16 h-16" : "w-12 h-12"
            }`}
          >
            <Dumbbell
              className={`text-white ${
                viewMode === "grid" ? "h-8 w-8" : "h-6 w-6"
              }`}
            />
          </div>
        </div>

        {/* Content */}
        <Flex direction="column" gap="3" className="flex-1">
          {/* Header */}
          <div className={viewMode === "grid" ? "text-center" : ""}>
            <Text
              size={viewMode === "grid" ? "5" : "4"}
              weight="bold"
              className="block mb-1 group-hover:text-purple-600 transition-colors text-gray-800 pr-8"
            >
              {workoutTitle}
            </Text>
            <Flex
              align="center"
              gap="2"
              justify={viewMode === "grid" ? "center" : "start"}
            >
              <Badge
                color="blue"
                variant="soft"
                size="1"
                className="bg-blue-100/80 backdrop-blur-sm"
              >
                Allenamento
              </Badge>
              {workout.completato ? (
                <Badge
                  color="green"
                  variant="soft"
                  size="1"
                  className="bg-green-100/80 backdrop-blur-sm"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completato
                </Badge>
              ) : (
                <Badge
                  color="orange"
                  variant="soft"
                  size="1"
                  className="bg-orange-100/80 backdrop-blur-sm"
                >
                  In Corso
                </Badge>
              )}
              {(workout.data || workout.dataConsigliata) && (
                <Badge
                  color="purple"
                  variant="soft"
                  size="1"
                  className="bg-purple-100/80 backdrop-blur-sm"
                >
                  {formatDate(workout.data || workout.dataConsigliata)}
                </Badge>
              )}
            </Flex>
          </div>

          {/* Description */}
          {workoutDescription && (
            <Text
              size="3"
              color="gray"
              className={
                viewMode === "grid"
                  ? "line-clamp-2 text-center"
                  : "line-clamp-1"
              }
            >
              {workoutDescription}
            </Text>
          )}

          {/* Stats */}
          <Flex
            gap="4"
            justify={viewMode === "grid" ? "center" : "start"}
            className="pt-2 border-t border-white/30"
          >
            <div className="text-center">
              <Text size="3" weight="bold" className="block text-blue-600">
                {stats.clientCount}
              </Text>
              <Text size="1" color="gray">
                Clienti
              </Text>
            </div>
            <div className="text-center">
              <Text size="3" weight="bold" className="block text-purple-600">
                {stats.exerciseCount}
              </Text>
              <Text size="1" color="gray">
                Esercizi
              </Text>
            </div>
            <div className="text-center">
              <Text size="3" weight="bold" className="block text-green-600">
                {stats.completedClients}
              </Text>
              <Text size="1" color="gray">
                Completati
              </Text>
            </div>
          </Flex>

          {/* Esercizi Preview */}
          {workout.esercizi && workout.esercizi.length > 0 && (
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/40">
              <Text
                size="2"
                weight="medium"
                color="gray"
                className="mb-2 flex items-center gap-1"
              >
                <Target className="h-3 w-3" />
                Esercizi:
              </Text>
              <div className="space-y-1">
                {workout.esercizi.slice(0, 3).map((ex, idx) => (
                  <Text key={idx} size="1" color="gray" className="block">
                    • {ex.esercizio?.nome || ex.nome} ({ex.serie}×
                    {ex.ripetizioni})
                  </Text>
                ))}
                {workout.esercizi.length > 3 && (
                  <Text size="1" color="gray">
                    +{workout.esercizi.length - 3} altri...
                  </Text>
                )}
              </div>
            </div>
          )}

          {/* Clienti Preview */}
          {workout.clienti && workout.clienti.length > 0 && (
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/40">
              <Text
                size="2"
                weight="medium"
                color="gray"
                className="mb-2 flex items-center gap-1"
              >
                <Users className="h-3 w-3" />
                Clienti:
              </Text>
              <div className="space-y-1">
                {workout.clienti.slice(0, 3).map((cliente, idx) => (
                  <Flex key={idx} align="center" justify="between">
                    <Text size="1" color="gray" className="block">
                      • {cliente.user?.name || cliente.nome}
                    </Text>
                    {cliente.completato && (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    )}
                  </Flex>
                ))}
                {workout.clienti.length > 3 && (
                  <Text size="1" color="gray">
                    +{workout.clienti.length - 3} altri...
                  </Text>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <Flex
            gap="2"
            className="pt-2 border-t border-white/30"
            justify={viewMode === "grid" ? "center" : "start"}
          >
            <button
              className="flex-1 px-3 py-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onView(workout);
              }}
              style={{ pointerEvents: "auto" }}
            >
              <Eye className="h-4 w-4 text-blue-600" />
              Visualizza
            </button>
            <button
              className="px-3 py-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onArchive(workout.id, !isArchived);
              }}
              style={{ pointerEvents: "auto" }}
            >
              {isArchived ? (
                <ArchiveRestore className="h-4 w-4 text-green-600" />
              ) : (
                <Archive className="h-4 w-4 text-gray-600" />
              )}
            </button>
            <button
              className="px-3 py-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(workout.id);
              }}
              style={{ pointerEvents: "auto" }}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </button>
          </Flex>

          {/* Data creazione */}
          <div className="pt-3 border-t border-white/30">
            <Text
              size="1"
              color="gray"
              className={viewMode === "grid" ? "text-center" : ""}
            >
              Creato: {formatDate(workout.creatoIl || workout.data)}
            </Text>
          </div>
        </Flex>
      </Flex>
    </div>
  );
}
