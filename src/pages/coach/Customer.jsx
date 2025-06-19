import { useAxios } from "@/contexts/AxiosProvider";
import usePageTitle from "@/hooks/usePageTitle";
import {
  Trash2,
  UserRoundIcon as UserRoundPen,
  UserRoundPlus,
  X,
  Search,
  Users,
  Eye,
  Mail,
  Target,
  AlertCircle,
  Grid3X3,
  List,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Text, Flex, Button, Badge } from "@radix-ui/themes";

export default function CustomerPage() {
  usePageTitle("Clienti");
  const [clienti, setClienti] = useState([]);
  const [errore, setErrore] = useState("");
  const axios = useAxios();
  const [showModal, setShowModal] = useState(false);
  const [clienteDaModificare, setClienteDaModificare] = useState(null);
  const [modNome, setModNome] = useState("");
  const [modEmail, setModEmail] = useState("");
  const [modNote, setModNote] = useState("");
  const [modHeight, setModHeight] = useState("");
  const [modWeight, setModWeight] = useState("");
  const [modGoal, setModGoal] = useState("");
  const [modPreferences, setModPreferences] = useState("");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [preferences, setPreferences] = useState("");

  const [caricamento, setCaricamento] = useState(false);
  const [erroreForm, setErroreForm] = useState("");
  const [messaggio, setMessaggio] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [clienteDaEliminare, setClienteDaEliminare] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); 
  const [selectedClient, setSelectedClient] = useState(null);

  const fetchClienti = async () => {
    try {
      const res = await axios.get("/customers");
      setClienti(res.data);
    } catch (err) {
      setErrore("Errore nel caricamento dei clienti");
    }
  };

  const eliminaCliente = async (id) => {
    try {
      await axios.delete(`/customers/${id}`);
      toast.success("Cliente eliminato con successo");
      fetchClienti();
    } catch (err) {
      toast.error("Errore nell'eliminazione del cliente");
    }
  };

  const handleEliminaCliente = async (cliente) => {
    try {
      const res = await axios.get(
        `/messages/by-user/${cliente.user.id}/summary`
      );
      const { msgCount, workoutCount } = res.data;

      if (msgCount > 0 || workoutCount > 0) {
        setClienteDaEliminare({ ...cliente, msgCount, workoutCount });
        setShowConfirmModal(true);
      } else {
        await eliminaCliente(cliente.id);
      }
    } catch (err) {
      toast.error("Errore nel controllo dei dati cliente");
    }
  };

  const salvaModificaCliente = async () => {
    if (caricamento) return;

    try {
      setCaricamento(true);
      await axios.put(`/customers/${clienteDaModificare.id}`, {
        name: modNome,
        email: modEmail,
        note: modNote,
        height: modHeight,
        weight: modWeight,
        fitnessGoal: modGoal,
        preferences: modPreferences,
      });
      toast.success("Cliente aggiornato ");
      setClienteDaModificare(null);
      await fetchClienti();
    } catch (err) {
      toast.error("Errore durante la modifica");
    } finally {
      setCaricamento(false); 
    }
  };

  const apriFormModifica = (cliente) => {
    setClienteDaModificare(cliente);
    setModNome(cliente.user?.name || "");
    setModEmail(cliente.user?.email || "");
    setModNote(cliente.note || "");
    setModHeight(cliente.height || "");
    setModWeight(cliente.weight || "");
    setModGoal(cliente.fitnessGoal || "");
    setModPreferences(cliente.preferences || "");
  };

  const handleView = (cliente) => {
    setSelectedClient(cliente);
  };

  const filteredClienti = clienti.filter((cliente) => {
    const matchesSearch =
      cliente.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.fitnessGoal?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  useEffect(() => {
    fetchClienti();
  }, []);

  return (
    <div
      className="min-h-screen  bg-gradient-to-br from-blue-100 via-purple-50 to-pink-50"
      style={{
        position: "relative",
        isolation: "isolate", 
      }}
    >
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header ispirato alla libreria esercizi */}
        <div className="text-center space-y-4 grid">
          <Flex align="center" justify="center" gap="3" className="mb-6">
            <div className="p-4 bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </Flex>
          <Text
            as="h1"
            size="8"
            weight="bold"
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm"
          >
            Gestione Clienti
          </Text>
          <Text size="4" color="gray" className="max-w-2xl mx-auto">
            Gestisci i tuoi clienti, visualizza i loro profili e monitora i
            progressi
          </Text>
        </div>

        {/* Error Alert */}
        {errore && (
          <div className="bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4 shadow-lg">
            <Flex align="center" gap="3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <Text color="red" weight="medium" size="3">
                {errore}
              </Text>
            </Flex>
          </div>
        )}

        {/* Controls ispirato alla libreria esercizi */}
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
                    placeholder="Cerca clienti per nome, email o obiettivi..."
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

                <Button
                  size="3"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg border border-blue-300/50 rounded-xl cursor-pointer"
                  onClick={() => setShowModal(true)}
                  style={{ pointerEvents: "auto" }}
                >
                  <UserRoundPlus className="h-5 w-5" />
                  Nuovo Cliente
                </Button>
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
                    {filteredClienti.length}
                  </Text>
                  <Text size="2" color="gray">
                    {filteredClienti.length === 1 ? "Cliente" : "Clienti"}
                  </Text>
                </div>
                <div className="text-center">
                  <Text
                    size="4"
                    weight="bold"
                    className="block text-purple-600"
                  >
                    {clienti.length}
                  </Text>
                  <Text size="2" color="gray">
                    Totali
                  </Text>
                </div>
              </Flex>
            </Flex>
          </Flex>
        </div>

        {/* Clients List */}
        <div className="space-y-6">
          {filteredClienti.length === 0 ? (
            <div className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl p-16 shadow-2xl ring-1 ring-white/20 text-center">
              <div className="space-y-6">
                <div className="p-6 bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 rounded-full w-fit mx-auto">
                  <Users className="h-16 w-16 text-gray-400" />
                </div>
                <div>
                  <Text
                    size="6"
                    weight="bold"
                    color="gray"
                    className="block mb-2"
                  >
                    {searchTerm
                      ? "Nessun cliente trovato"
                      : "Nessun cliente disponibile"}
                  </Text>
                  <Text size="4" color="gray">
                    {searchTerm
                      ? "Prova a modificare i termini di ricerca"
                      : "Inizia aggiungendo il tuo primo cliente"}
                  </Text>
                </div>
                {!searchTerm && (
                  <Button
                    size="3"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border border-blue-300/50 rounded-xl cursor-pointer"
                    onClick={() => setShowModal(true)}
                    style={{ pointerEvents: "auto" }}
                  >
                    <UserRoundPlus className="h-5 w-5" />
                    Aggiungi il tuo primo cliente
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
              {filteredClienti.map((cliente) => (
                <div
                  key={cliente.id}
                  className={`bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl ring-1 ring-white/20 hover:shadow-2xl transition-all duration-300 hover:border-blue-200/50 group cursor-pointer ${
                    viewMode === "grid" ? "p-6" : "p-4"
                  }`}
                  onClick={() => handleView(cliente)}
                  style={{ pointerEvents: "auto" }}
                >
                  <Flex
                    direction={viewMode === "grid" ? "column" : "row"}
                    gap="4"
                  >
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 ${
                        viewMode === "grid" ? "mx-auto" : ""
                      }`}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {cliente.user?.name?.charAt(0)?.toUpperCase() || "C"}
                      </div>
                    </div>

                    {/* Content */}
                    <Flex direction="column" gap="3" className="flex-1">
                      {/* Header */}
                      <div className={viewMode === "grid" ? "text-center" : ""}>
                        <Text
                          size={viewMode === "grid" ? "5" : "4"}
                          weight="bold"
                          className="block mb-1 group-hover:text-blue-600 transition-colors text-gray-800"
                        >
                          {cliente.user?.name}
                        </Text>
                        <Text
                          size="2"
                          color="gray"
                          className="flex items-center gap-1"
                        >
                          <Mail className="h-3 w-3" />
                          {cliente.user?.email}
                        </Text>
                      </div>

                      {/* Info */}
                      <div className="space-y-2">
                        {cliente.note && (
                          <Text
                            size="3"
                            color="gray"
                            className={
                              viewMode === "grid"
                                ? "line-clamp-2 text-center"
                                : "line-clamp-1"
                            }
                          >
                            {cliente.note}
                          </Text>
                        )}

                        {cliente.fitnessGoal && (
                          <Badge
                            color="blue"
                            variant="soft"
                            size="1"
                            className="bg-white/30 backdrop-blur-sm"
                          >
                            <Target className="h-3 w-3 mr-1" />
                            {cliente.fitnessGoal}
                          </Badge>
                        )}

                        {(cliente.height || cliente.weight) && (
                          <Flex
                            gap="2"
                            justify={viewMode === "grid" ? "center" : "start"}
                          >
                            {cliente.height && (
                              <Badge
                                color="purple"
                                variant="soft"
                                size="1"
                                className="bg-white/30 backdrop-blur-sm"
                              >
                                {cliente.height}cm
                              </Badge>
                            )}
                            {cliente.weight && (
                              <Badge
                                color="green"
                                variant="soft"
                                size="1"
                                className="bg-white/30 backdrop-blur-sm"
                              >
                                {cliente.weight}kg
                              </Badge>
                            )}
                          </Flex>
                        )}
                      </div>

                      {/* Actions - Stile libreria esercizi */}
                      <Flex
                        gap="2"
                        className="pt-2 border-t border-white/30"
                        justify={viewMode === "grid" ? "center" : "start"}
                      >
                        <button
                          className="flex-1 px-3 py-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(cliente);
                          }}
                          style={{ pointerEvents: "auto" }}
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                          Visualizza
                        </button>
                        <button
                          className="px-3 py-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            apriFormModifica(cliente);
                          }}
                          style={{ pointerEvents: "auto" }}
                        >
                          <UserRoundPen className="h-4 w-4 text-purple-600" />
                          Modifica
                        </button>
                        <button
                          className="px-3 py-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEliminaCliente(cliente);
                          }}
                          style={{ pointerEvents: "auto" }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </Flex>
                    </Flex>
                  </Flex>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Nuovo Cliente - Migliorato */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl w-full max-w-2xl border border-white/40 ring-1 ring-white/20 max-h-[90vh] overflow-y-auto">
              <Flex align="center" justify="between" className="mb-6">
                <Text size="6" weight="bold" className="text-gray-800">
                  Nuovo Cliente
                </Text>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl hover:bg-white/40 transition-all duration-200 cursor-pointer"
                  style={{ pointerEvents: "auto" }}
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </Flex>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setErroreForm("");
                  setCaricamento(true);

                  try {
                    const payload = {
                      name: nome,
                      email,
                      password: "ciao123",
                      note,
                      height,
                      weight,
                      fitnessGoal,
                      preferences,
                    };

                    await axios.post("/customers", payload);
                    await fetchClienti();
                    setShowModal(false);
                    setNome("");
                    setEmail("");
                    setNote("");
                    setHeight("");
                    setWeight("");
                    setFitnessGoal("");
                    setPreferences("");
                    toast.success("Cliente creato con successo! ");
                  } catch (err) {
                    if (
                      err.response?.data?.message === "Email già registrata."
                    ) {
                      setErroreForm("Email già in uso");
                    } else {
                      setErroreForm("Errore nella creazione del cliente ");
                    }
                  } finally {
                    setCaricamento(false);
                  }
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-gray-700 font-medium">
                      Nome *
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 px-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 transition-all duration-200 shadow-md"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700 font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="w-full h-12 px-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 transition-all duration-200 shadow-md"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-gray-700 font-medium">
                      Altezza (cm)
                    </label>
                    <input
                      type="number"
                      className="w-full h-12 px-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 transition-all duration-200 shadow-md"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700 font-medium">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      className="w-full h-12 px-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 transition-all duration-200 shadow-md"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-medium">
                    Obiettivi di fitness
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 transition-all duration-200 shadow-md"
                    value={fitnessGoal}
                    onChange={(e) => setFitnessGoal(e.target.value)}
                    placeholder="es. Perdita di peso, Aumento massa muscolare..."
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-medium">
                    Note
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 transition-all duration-200 shadow-md resize-none"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Note aggiuntive sul cliente..."
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-medium">
                    Preferenze di allenamento
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 transition-all duration-200 shadow-md resize-none"
                    rows={3}
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    placeholder="Preferenze, limitazioni, orari preferiti..."
                  />
                </div>

                {erroreForm && (
                  <div className="bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-3 shadow-lg">
                    <Text color="red" size="3">
                      {erroreForm}
                    </Text>
                  </div>
                )}

                <Flex gap="3" justify="end">
                  <Button
                    type="button"
                    variant="soft"
                    onClick={() => setShowModal(false)}
                    className="bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 rounded-xl cursor-pointer"
                    style={{ pointerEvents: "auto" }}
                  >
                    Annulla
                  </Button>
                  <Button
                    type="submit"
                    disabled={caricamento}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border border-blue-300/50 rounded-xl cursor-pointer"
                    style={{ pointerEvents: "auto" }}
                  >
                    {caricamento ? "Salvataggio..." : "Salva Cliente"}
                  </Button>
                </Flex>
              </form>
            </div>
          </div>
        )}

        {/* Modal Modifica Cliente - Migliorato */}
        {clienteDaModificare && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl w-full max-w-2xl border border-white/40 ring-1 ring-white/20 max-h-[90vh] overflow-y-auto">
              <Flex align="center" justify="between" className="mb-6">
                <Text size="6" weight="bold" className="text-gray-800">
                  Modifica Cliente
                </Text>
                <button
                  onClick={() => setClienteDaModificare(null)}
                  className="p-2 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl hover:bg-white/40 transition-all duration-200 cursor-pointer"
                  style={{ pointerEvents: "auto" }}
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </Flex>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-gray-700 font-medium">
                      Nome
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 px-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 transition-all duration-200 shadow-md"
                      value={modNome}
                      onChange={(e) => setModNome(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700 font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full h-12 px-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 transition-all duration-200 shadow-md"
                      value={modEmail}
                      onChange={(e) => setModEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-gray-700 font-medium">
                      Altezza (cm)
                    </label>
                    <input
                      type="number"
                      className="w-full h-12 px-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 transition-all duration-200 shadow-md"
                      value={modHeight}
                      onChange={(e) => setModHeight(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700 font-medium">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      className="w-full h-12 px-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 transition-all duration-200 shadow-md"
                      value={modWeight}
                      onChange={(e) => setModWeight(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-medium">
                    Obiettivi di fitness
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 transition-all duration-200 shadow-md"
                    value={modGoal}
                    onChange={(e) => setModGoal(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-medium">
                    Note
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 transition-all duration-200 shadow-md resize-none"
                    rows={3}
                    value={modNote}
                    onChange={(e) => setModNote(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-medium">
                    Preferenze di allenamento
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 transition-all duration-200 shadow-md resize-none"
                    rows={3}
                    value={modPreferences}
                    onChange={(e) => setModPreferences(e.target.value)}
                  />
                </div>

                <Flex gap="3" justify="end">
                  <button
                    type="button"
                    onClick={() => setClienteDaModificare(null)}
                    className="px-4 py-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                    style={{ pointerEvents: "auto" }}
                  >
                    Annulla
                  </button>
                  <button
                    onClick={salvaModificaCliente}
                    disabled={caricamento}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border border-blue-300/50 text-white rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                    style={{ pointerEvents: "auto" }}
                  >
                    {caricamento ? "Salvataggio..." : "Salva Modifiche"}
                  </button>
                </Flex>
              </div>
            </div>
          </div>
        )}

        {/* Modal Conferma Eliminazione - Migliorato */}
        {showConfirmModal && clienteDaEliminare && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl w-full max-w-md border border-white/40 ring-1 ring-white/20">
              <Flex align="center" gap="3" className="mb-6">
                <div className="p-3 bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <Text size="6" weight="bold" className="text-gray-800">
                  Conferma Eliminazione
                </Text>
              </Flex>

              <div className="space-y-4 mb-6">
                <Text size="4" className="text-gray-700">
                  Questo cliente ha:
                </Text>
                <div className="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200/50 rounded-xl p-4">
                  {clienteDaEliminare.msgCount > 0 && (
                    <Text size="3" className="block text-yellow-800">
                      • <strong>{clienteDaEliminare.msgCount}</strong> messaggio
                      {clienteDaEliminare.msgCount > 1 ? "i" : ""}
                    </Text>
                  )}
                  {clienteDaEliminare.workoutCount > 0 && (
                    <Text size="3" className="block text-yellow-800">
                      • <strong>{clienteDaEliminare.workoutCount}</strong>{" "}
                      workout attivo
                      {clienteDaEliminare.workoutCount > 1 ? "i" : ""}
                    </Text>
                  )}
                </div>
                <Text size="3" color="gray">
                  I dati resteranno nel sistema ma non saranno più collegati a
                  questo cliente.
                </Text>
              </div>

              <Flex gap="3" justify="end">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setClienteDaEliminare(null);
                  }}
                  className="px-4 py-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                  style={{ pointerEvents: "auto" }}
                >
                  Annulla
                </button>
                <button
                  onClick={async () => {
                    await eliminaCliente(clienteDaEliminare.id);
                    setShowConfirmModal(false);
                    setClienteDaEliminare(null);
                  }}
                  className="px-4 py-2 bg-red-500/80 hover:bg-red-600/80 border border-red-300/50 text-white rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                  style={{ pointerEvents: "auto" }}
                >
                  Elimina Cliente
                </button>
              </Flex>
            </div>
          </div>
        )}

        {/* Modal Visualizza Cliente */}
        {selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl w-full max-w-2xl border border-white/40 ring-1 ring-white/20 max-h-[90vh] overflow-y-auto">
              <Flex align="center" justify="between" className="mb-6">
                <Flex align="center" gap="3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {selectedClient.user?.name?.charAt(0)?.toUpperCase() || "C"}
                  </div>
                  <div>
                    <Text size="6" weight="bold" className="text-gray-800">
                      {selectedClient.user?.name}
                    </Text>
                    <Text size="3" color="gray">
                      Dettagli Cliente
                    </Text>
                  </div>
                </Flex>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="p-2 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl hover:bg-white/40 transition-all duration-200 cursor-pointer"
                  style={{ pointerEvents: "auto" }}
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </Flex>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                    <Text
                      size="2"
                      weight="bold"
                      color="gray"
                      className="block mb-2"
                    >
                      EMAIL
                    </Text>
                    <Text size="3" className="text-gray-800">
                      {selectedClient.user?.email}
                    </Text>
                  </div>

                  {selectedClient.height && (
                    <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                      <Text
                        size="2"
                        weight="bold"
                        color="gray"
                        className="block mb-2"
                      >
                        ALTEZZA
                      </Text>
                      <Text size="3" className="text-gray-800">
                        {selectedClient.height} cm
                      </Text>
                    </div>
                  )}

                  {selectedClient.weight && (
                    <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                      <Text
                        size="2"
                        weight="bold"
                        color="gray"
                        className="block mb-2"
                      >
                        PESO
                      </Text>
                      <Text size="3" className="text-gray-800">
                        {selectedClient.weight} kg
                      </Text>
                    </div>
                  )}

                  {selectedClient.fitnessGoal && (
                    <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                      <Text
                        size="2"
                        weight="bold"
                        color="gray"
                        className="block mb-2"
                      >
                        OBIETTIVI FITNESS
                      </Text>
                      <Text size="3" className="text-gray-800">
                        {selectedClient.fitnessGoal}
                      </Text>
                    </div>
                  )}
                </div>

                {selectedClient.note && (
                  <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                    <Text
                      size="2"
                      weight="bold"
                      color="gray"
                      className="block mb-2"
                    >
                      NOTE
                    </Text>
                    <Text size="3" className="text-gray-800">
                      {selectedClient.note}
                    </Text>
                  </div>
                )}

                {selectedClient.preferences && (
                  <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                    <Text
                      size="2"
                      weight="bold"
                      color="gray"
                      className="block mb-2"
                    >
                      PREFERENZE DI ALLENAMENTO
                    </Text>
                    <Text size="3" className="text-gray-800">
                      {selectedClient.preferences}
                    </Text>
                  </div>
                )}

                <Flex gap="3" justify="end">
                  <button
                    onClick={() => {
                      setSelectedClient(null);
                      apriFormModifica(selectedClient);
                    }}
                    className="px-4 py-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                    style={{ pointerEvents: "auto" }}
                  >
                    <UserRoundPen className="h-4 w-4 text-purple-600" />
                    Modifica
                  </button>
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border border-blue-300/50 text-white rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                    style={{ pointerEvents: "auto" }}
                  >
                    Chiudi
                  </button>
                </Flex>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}
