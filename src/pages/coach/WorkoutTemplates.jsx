"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Copy,
  Trash2,
  Send,
  FileIcon as FileTemplate,
  Dumbbell,
  MoreVertical,
  Search,
  Grid3X3,
  List,
  Eye,
  X,
} from "lucide-react";
import { Text, Flex, Badge } from "@radix-ui/themes";
import toast from "react-hot-toast";
import { useAxios } from "@/contexts/AxiosProvider";
import usePageTitle from "@/hooks/usePageTitle";

export default function WorkoutTemplates() {
  usePageTitle("Template");
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const axios = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get("/workouts/templates");
      const data = response.data || [];
      setTemplates(data);
    } catch (error) {
      toast.error("Errore nel caricamento template");
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (templateId) => {
    if (!confirm("Sei sicuro di voler eliminare questo template?")) return;

    try {
      await axios.delete(`/workouts/${templateId}`);
      setTemplates((prev) => prev.filter((t) => t.id !== templateId));
      toast.success("Template eliminato!");
    } catch (error) {
      if (error.response?.status === 404) {
        setTemplates((prev) => prev.filter((t) => t.id !== templateId));
        toast.success("Template non trovato nel backend, rimosso localmente");
      } else {
        toast.error("Errore durante l'eliminazione del template");
      }
    }
  };

  const duplicateTemplate = async (template) => {
    navigate(`/coach/templates/duplicate/${template.id}`);
  };

  const handleView = (template) => {
    setSelectedTemplate(template);
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.titolo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.descrizione?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.esercizi?.some(
        (ex) =>
          ex.esercizio?.nome
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          ex.nome?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50 flex items-center justify-center">
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl">
          <Flex align="center" gap="3">
            <div className="p-3 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-full shadow-lg">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <Text color="blue" size="5" weight="bold">
              Caricamento template...
            </Text>
          </Flex>
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
        <div className="text-center space-y-4 grid">
          <Flex align="center" justify="center" gap="3" className="mb-6">
            <div className="p-4 bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg">
              <FileTemplate className="h-8 w-8 text-blue-600" />
            </div>
          </Flex>
          <Text
            as="h1"
            size="8"
            weight="bold"
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm"
          >
            Template Allenamenti
          </Text>
          <Text size="4" color="gray" className="max-w-2xl mx-auto">
            Gestisci i tuoi template riutilizzabili e crea allenamenti
            personalizzati
          </Text>
        </div>

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
                    placeholder="Cerca template per nome, descrizione o esercizi..."
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

                <Link
                  to="/coach/templates/new"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg border border-blue-300/50 cursor-pointer transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                  style={{ pointerEvents: "auto" }}
                >
                  <Plus className="h-5 w-5" />
                  Nuovo Template
                </Link>
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
                    {filteredTemplates.length}
                  </Text>
                  <Text size="2" color="gray">
                    {filteredTemplates.length === 1 ? "Template" : "Template"}
                  </Text>
                </div>
                <div className="text-center">
                  <Text
                    size="4"
                    weight="bold"
                    className="block text-purple-600"
                  >
                    {templates.length}
                  </Text>
                  <Text size="2" color="gray">
                    Totali
                  </Text>
                </div>
                <div className="text-center">
                  <Text size="4" weight="bold" className="block text-green-600">
                    {templates.reduce((acc, t) => acc + (t.utilizzi || 0), 0)}
                  </Text>
                  <Text size="2" color="gray">
                    Utilizzi
                  </Text>
                </div>
              </Flex>
            </Flex>
          </Flex>
        </div>

        {/* Templates List */}
        <div className="space-y-6">
          {filteredTemplates.length === 0 ? (
            <div className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl p-16 shadow-2xl ring-1 ring-white/20 text-center">
              <div className="space-y-6">
                <div className="p-6 bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 rounded-full w-fit mx-auto">
                  <FileTemplate className="h-16 w-16 text-gray-400" />
                </div>
                <div>
                  <Text
                    size="6"
                    weight="bold"
                    color="gray"
                    className="block mb-2"
                  >
                    {searchTerm
                      ? "Nessun template trovato"
                      : "Nessun template disponibile"}
                  </Text>
                  <Text size="4" color="gray">
                    {searchTerm
                      ? "Prova a modificare i termini di ricerca"
                      : "Inizia creando il tuo primo template di allenamento"}
                  </Text>
                </div>
                {!searchTerm && (
                  <Link
                    to="/coach/templates/new"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg border border-blue-300/50 cursor-pointer transition-all duration-200 inline-flex items-center gap-3"
                    style={{ pointerEvents: "auto" }}
                  >
                    <Plus className="h-5 w-5" />
                    Crea il tuo primo template
                  </Link>
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
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onDelete={deleteTemplate}
                  onDuplicate={duplicateTemplate}
                  onView={handleView}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal Visualizza Template */}
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl w-full max-w-4xl border border-white/40 ring-1 ring-white/20 max-h-[90vh] overflow-y-auto">
              <Flex align="center" justify="between" className="mb-6">
                <Flex align="center" gap="3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <FileTemplate className="h-6 w-6 text-white" />
                  </div>
                  <div className="grid">
                    <Text size="6" weight="bold" className="text-gray-800">
                      {selectedTemplate.titolo}
                    </Text>
                    <Text size="3" color="gray">
                      Dettagli Template
                    </Text>
                  </div>
                </Flex>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="p-2 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl hover:bg-white/40 transition-all duration-200 cursor-pointer"
                  style={{ pointerEvents: "auto" }}
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </Flex>

              <div className="space-y-6">
                {/* Info generali */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                    <Text
                      size="2"
                      weight="bold"
                      color="gray"
                      className="block mb-2"
                    >
                      ESERCIZI
                    </Text>
                    <Text size="4" weight="bold" className="text-blue-600">
                      {selectedTemplate.esercizi?.length || 0}
                    </Text>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                    <Text
                      size="2"
                      weight="bold"
                      color="gray"
                      className="block mb-2"
                    >
                      SERIE TOTALI
                    </Text>
                    <Text size="4" weight="bold" className="text-purple-600">
                      {selectedTemplate.esercizi?.reduce(
                        (acc, ex) => acc + (ex.serie || 0),
                        0
                      ) || 0}
                    </Text>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                    <Text
                      size="2"
                      weight="bold"
                      color="gray"
                      className="block mb-2"
                    >
                      UTILIZZI
                    </Text>
                    <Text size="4" weight="bold" className="text-green-600">
                      {selectedTemplate.utilizzi || 0}
                    </Text>
                  </div>
                </div>

                {/* Descrizione */}
                {selectedTemplate.descrizione && (
                  <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                    <Text
                      size="2"
                      weight="bold"
                      color="gray"
                      className="block mb-2"
                    >
                      DESCRIZIONE
                    </Text>
                    <Text size="3" className="text-gray-800">
                      {selectedTemplate.descrizione}
                    </Text>
                  </div>
                )}

                {/* Lista esercizi */}
                {selectedTemplate.esercizi &&
                  selectedTemplate.esercizi.length > 0 && (
                    <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                      <Text
                        size="2"
                        weight="bold"
                        color="gray"
                        className="block mb-4 items-center gap-2"
                      >
                        <Dumbbell className="h-4 w-4" />
                        ESERCIZI DEL TEMPLATE
                      </Text>
                      <div className="space-y-3">
                        {selectedTemplate.esercizi.map((ex, idx) => (
                          <div
                            key={idx}
                            className="bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg p-3 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {idx + 1}
                              </div>
                              <div>
                                <Text
                                  size="3"
                                  weight="medium"
                                  className="text-gray-800"
                                >
                                  {ex.esercizio?.nome || ex.nome}
                                </Text>
                                {ex.esercizio?.categoria && (
                                  <Badge
                                    color="blue"
                                    variant="soft"
                                    size="1"
                                    className="bg-blue-100/80 backdrop-blur-sm mt-1"
                                  >
                                    {ex.esercizio.categoria}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <Text
                                size="2"
                                weight="bold"
                                className="text-purple-600"
                              >
                                {ex.serie}×{ex.ripetizioni}
                              </Text>
                              {ex.peso && (
                                <Text size="1" color="gray" className="block">
                                  {ex.peso}kg
                                </Text>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Data creazione */}
                <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                  <Text
                    size="2"
                    weight="bold"
                    color="gray"
                    className="block mb-2"
                  >
                    DATA CREAZIONE
                  </Text>
                  <Text size="3" className="text-gray-800">
                    {new Date(
                      selectedTemplate.createdAt || Date.now()
                    ).toLocaleDateString("it-IT", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </div>

                <Flex gap="3" justify="end">
                  <button
                    onClick={() => {
                      setSelectedTemplate(null);
                      navigate(`/coach/templates/edit/${selectedTemplate.id}`);
                    }}
                    className="px-4 py-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                    style={{ pointerEvents: "auto" }}
                  >
                    <Copy className="h-4 w-4 text-purple-600" />
                    Duplica
                  </button>
                  <button
                    onClick={() => setSelectedTemplate(null)}
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
    </div>
  );
}

function TemplateCard({ template, onDelete, onDuplicate, onView, viewMode }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const getTemplateStats = () => {
    const exerciseCount = template.esercizi?.length || 0;
    const totalSets =
      template.esercizi?.reduce((acc, ex) => acc + (ex.serie || 0), 0) || 0;
    return { exerciseCount, totalSets };
  };

  const stats = getTemplateStats();

  return (
    <div
      className={`bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl ring-1 ring-white/20 hover:shadow-2xl transition-all duration-300 hover:border-blue-200/50 group cursor-pointer relative ${
        viewMode === "grid" ? "p-6" : "p-4"
      }`}
      onClick={() => onView(template)}
      style={{ pointerEvents: "auto" }}
    >
      {/* Dropdown Menu */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
          className="p-2 rounded-lg bg-white/30 backdrop-blur-sm border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
          style={{ pointerEvents: "auto" }}
        >
          <MoreVertical className="h-4 w-4 text-gray-600" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl shadow-2xl ring-1 ring-white/20 py-2 z-20">
            <Link
              to={`/coach/templates/${template.id}/assign`}
              className="w-full px-4 py-2 text-left hover:bg-white/50 transition-colors flex items-center gap-2 text-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <Send className="h-4 w-4" />
              Assegna
            </Link>
            <Link
              to={`/coach/templates/duplicate/${template.id}`}
              className="w-full px-4 py-2 text-left hover:bg-white/50 transition-colors flex items-center gap-2 text-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <Copy className="h-4 w-4" />
              Duplica
            </Link>

            <div className="border-t border-gray-200/50 my-1"></div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(template.id);
                setShowDropdown(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-red-50/50 transition-colors flex items-center gap-2 text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Elimina
            </button>
          </div>
        )}
      </div>

      <Flex direction={viewMode === "grid" ? "column" : "row"} gap="4">
        {/* Icon */}
        <div
          className={`flex-shrink-0 ${viewMode === "grid" ? "mx-auto" : ""}`}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <FileTemplate className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <Flex direction="column" gap="3" className="flex-1">
          {/* Header */}
          <div className={viewMode === "grid" ? "text-center" : ""}>
            <Text
              size={viewMode === "grid" ? "5" : "4"}
              weight="bold"
              className="block mb-1 group-hover:text-purple-600 transition-colors text-gray-800"
            >
              {template.titolo || "Template"}
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
                Template
              </Badge>
              {template.utilizzi > 0 && (
                <Badge
                  color="green"
                  variant="soft"
                  size="1"
                  className="bg-green-100/80 backdrop-blur-sm"
                >
                  {template.utilizzi} utilizzi
                </Badge>
              )}
            </Flex>
          </div>

          {/* Description */}
          {template.descrizione && (
            <Text
              size="3"
              color="gray"
              className={
                viewMode === "grid"
                  ? "line-clamp-2 text-center"
                  : "line-clamp-1"
              }
            >
              {template.descrizione}
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
                {stats.exerciseCount}
              </Text>
              <Text size="1" color="gray">
                Esercizi
              </Text>
            </div>
            <div className="text-center">
              <Text size="3" weight="bold" className="block text-purple-600">
                {stats.totalSets}
              </Text>
              <Text size="1" color="gray">
                Serie Tot.
              </Text>
            </div>
          </Flex>

          {/* Esercizi Preview */}
          {template.esercizi && template.esercizi.length > 0 && (
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/40">
              <Text
                size="2"
                weight="medium"
                color="gray"
                className="mb-2 flex items-center gap-1"
              >
                <Dumbbell className="h-3 w-3" />
                Esercizi:
              </Text>
              <div className="space-y-1">
                {template.esercizi.slice(0, 3).map((ex, idx) => (
                  <Text key={idx} size="1" color="gray" className="block">
                    • {ex.esercizio?.nome || ex.nome} ({ex.serie}×
                    {ex.ripetizioni})
                  </Text>
                ))}
                {template.esercizi.length > 3 && (
                  <Text size="1" color="gray">
                    +{template.esercizi.length - 3} altri...
                  </Text>
                )}
              </div>
            </div>
          )}

          <Flex
            gap="2"
            className="pt-2 border-t border-white/30"
            justify={viewMode === "grid" ? "center" : "start"}
          >
            <button
              className="flex-1 px-3 py-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onView(template);
              }}
              style={{ pointerEvents: "auto" }}
            >
              <Eye className="h-4 w-4 text-blue-600" />
              Visualizza
            </button>
            <Link
              to={`/coach/templates/${template.id}/assign`}
              className="px-3 py-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm font-medium"
              onClick={(e) => e.stopPropagation()}
              style={{ pointerEvents: "auto" }}
            >
              <Send className="h-4 w-4 text-green-600" />
              Assegna
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/coach/templates/edit/${template.id}`);
              }}
              className="px-3 py-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
              style={{ pointerEvents: "auto" }}
            >
              <Copy className="h-4 w-4 text-purple-600" />
            </button>
          </Flex>

          {/* Data creazione */}
          <div className="pt-3 border-t border-white/30">
            <Text
              size="1"
              color="gray"
              className={viewMode === "grid" ? "text-center" : ""}
            >
              Creato:{" "}
              {new Date(template.createdAt || Date.now()).toLocaleDateString()}
            </Text>
          </div>
        </Flex>
      </Flex>
    </div>
  );
}
