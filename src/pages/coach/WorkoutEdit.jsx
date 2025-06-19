"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAxios } from "@/contexts/AxiosProvider";
import { useUser } from "@/contexts/UserProvider";
import { Text, Button, Flex, Card, Badge } from "@radix-ui/themes";
import Select from "react-select";

import {
  Calendar,
  FileText,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Target,
  Users,
  Clock,
  ArrowLeft,
  Edit3,
} from "lucide-react";

export default function WorkoutEdit() {
  const { id } = useParams();
  const axios = useAxios();
  const navigate = useNavigate();
  const { user } = useUser();

  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [data, setData] = useState("");
  const [clientiOptions, setClientiOptions] = useState([]);
  const [selectedClientIds, setSelectedClientIds] = useState([]);
  const [clienti, setClienti] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [originalExercises, setOriginalExercises] = useState([]);

  useEffect(() => {
    setIsLoadingData(true);

    const loadWorkout = axios
      .get(`/workouts/${id}`)
      .then((res) => {
        const w = res.data;

        setTitolo(w.titolo || "");
        setDescrizione(w.descrizione || "");
        setData(new Date(w.data).toISOString().slice(0, 16));

        if (w.clienti && Array.isArray(w.clienti)) {
          setSelectedClientIds(w.clienti.map((c) => c.clienteId));
        } else {
          setSelectedClientIds([]);
        }

        const exercisesData =
          w.esercizi?.map((e) => ({
            esercizioId: e.esercizioId || e.esercizio?.id,
            serie: e.serie,
            ripetizioni: e.ripetizioni,
            peso: e.peso,
          })) || [];

        setSelectedExercises(exercisesData);
        setOriginalExercises(exercisesData);
      })
      .catch((err) => {
        setErrorMessage("Errore nel recupero del workout");
      });

    // Carica lista clienti
    const loadClienti = axios
      .get("/customers")
      .then((res) => {
        const options = res.data.map((c) => ({
          value: c.id,
          label: c.user?.name || "",
        }));
        setClientiOptions(options);
      })
      .catch((err) => {
        setErrorMessage("Errore nel recupero clienti");
      });

    const loadAllExercises = axios
      .get("/exercises")
      .then((res) => {
        setAllExercises(res.data);
      })
      .catch((err) => {
        setErrorMessage("Errore nel caricamento esercizi");
      });

    Promise.all([loadWorkout, loadClienti, loadAllExercises]).finally(() =>
      setIsLoadingData(false)
    );
  }, [id, axios]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (titolo.length < 3) {
      setErrorMessage("Il titolo deve avere almeno 3 caratteri");
      setIsLoading(false);
      return;
    }

    if (!data) {
      setErrorMessage("La data è obbligatoria");
      setIsLoading(false);
      return;
    }

    if (selectedClientIds.length === 0) {
      setErrorMessage("Seleziona almeno un cliente");
      setIsLoading(false);
      return;
    }

    const updatedData = {
      titolo,
      descrizione,
      data: new Date(data).toISOString(),
      clientiIds: selectedClientIds,
      esercizi: selectedExercises.map((e) => ({
        esercizioId: e.esercizioId,
        serie: Number(e.serie),
        ripetizioni: Number(e.ripetizioni),
        peso: e.peso === "" ? null : Number(e.peso),
      })),
    };

    axios
      .put(`/workouts/${id}`, updatedData)
      .then(() => {
        setSuccessMessage("Allenamento aggiornato con successo!");
        setTimeout(() => {
          navigate("/coach/workouts");
        }, 1500);
      })
      .catch((err) => {
        setErrorMessage("Errore durante il salvataggio delle modifiche");
      })
      .finally(() => setIsLoading(false));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSelectedClienti = () => {
    return clientiOptions.filter((opt) =>
      selectedClientIds.includes(opt.value)
    );
  };

  const today = new Date().toISOString().slice(0, 16);

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center py-16">
            <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <Text size="5" color="gray">
              Caricamento allenamento...
            </Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Flex align="center" justify="center" gap="3" className="mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Edit3 className="h-8 w-8 text-white" />
            </div>
          </Flex>
          <Text
            as="h1"
            size="8"
            weight="bold"
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Modifica Allenamento
          </Text>
          <Text size="4" color="gray" className="max-w-2xl mx-auto">
            Aggiorna i dettagli dell'allenamento per i tuoi clienti
          </Text>
        </div>

        {/* Back Button */}
        <Card className="p-4 shadow-lg bg-white/90 backdrop-blur-sm">
          <Button
            variant="ghost"
            onClick={() => navigate("/coach/workouts")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna agli Allenamenti
          </Button>
        </Card>

        {/* Success Message */}
        {successMessage && (
          <Card className="p-4 bg-green-50 border-2 border-green-200 shadow-lg">
            <Flex align="center" gap="3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <Text color="green" weight="medium" size="3">
                {successMessage}
              </Text>
            </Flex>
          </Card>
        )}

        {/* Error Message */}
        {errorMessage && (
          <Card className="p-4 bg-red-50 border-2 border-red-200 shadow-lg">
            <Flex align="center" gap="3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <Text color="red" weight="medium" size="3">
                {errorMessage}
              </Text>
            </Flex>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Informazioni Base */}
            <Card className="p-8 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <Flex direction="column" gap="6">
                <Flex
                  align="center"
                  gap="3"
                  className="pb-4 border-b border-gray-100"
                >
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <Text size="6" weight="bold">
                      Informazioni Base
                    </Text>
                    <Text size="3" color="gray">
                      Dettagli principali dell'allenamento
                    </Text>
                  </div>
                </Flex>

                <div className="space-y-6">
                  <Flex direction="column" gap="3">
                    <Flex align="center" gap="2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <Text weight="bold" size="3">
                        Titolo Allenamento *
                      </Text>
                    </Flex>
                    <input
                      className="w-full h-12 px-4 text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      placeholder="es. Allenamento Upper Body Intensivo"
                      value={titolo}
                      onChange={(e) => setTitolo(e.target.value)}
                      required
                      minLength={3}
                    />
                  </Flex>

                  <Flex direction="column" gap="3">
                    <Flex align="center" gap="2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <Text weight="bold" size="3">
                        Descrizione
                      </Text>
                    </Flex>
                    <textarea
                      placeholder="Descrivi gli obiettivi, le note tecniche e le indicazioni specifiche per questo allenamento..."
                      value={descrizione}
                      onChange={(e) => setDescrizione(e.target.value)}
                      rows={5}
                      className="w-full text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none p-4"
                    />
                  </Flex>
                </div>
              </Flex>
            </Card>

            {/* Pianificazione */}
            <Card className="p-8 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <Flex direction="column" gap="6">
                <Flex
                  align="center"
                  gap="3"
                  className="pb-4 border-b border-gray-100"
                >
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <Text size="6" weight="bold">
                      Pianificazione
                    </Text>
                    <Text size="3" color="gray">
                      Quando e per chi è questo allenamento
                    </Text>
                  </div>
                </Flex>

                <div className="space-y-6">
                  <Flex direction="column" gap="3">
                    <Flex align="center" gap="2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <Text weight="bold" size="3">
                        Data e Ora *
                      </Text>
                    </Flex>
                    <input
                      type="datetime-local"
                      value={data}
                      min={today}
                      onChange={(e) => setData(e.target.value)}
                      className="w-full h-12 px-4 text-base border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                      required
                    />
                  </Flex>

                  <Flex direction="column" gap="3">
                    <Flex align="center" gap="2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <Text weight="bold" size="3">
                        Clienti *
                      </Text>
                    </Flex>
                    <Select
                      isMulti
                      options={clientiOptions}
                      value={clientiOptions.filter((opt) =>
                        selectedClientIds.includes(opt.value)
                      )}
                      onChange={(selectedOptions) => {
                        const ids = selectedOptions.map((opt) => opt.value);
                        setSelectedClientIds(ids);
                      }}
                      className="mb-4"
                      placeholder="Seleziona i clienti…"
                    />
                  </Flex>

                  {getSelectedClienti().length > 0 && (
                    <Card className="p-4 bg-green-50 border-2 border-green-200">
                      <Flex direction="column" gap="2">
                        <Flex align="center" gap="3">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <Badge color="green" size="2">
                            {getSelectedClienti().length} clienti selezionati
                          </Badge>
                        </Flex>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {getSelectedClienti().map((cliente) => (
                            <Badge
                              key={cliente.value}
                              variant="soft"
                              color="purple"
                            >
                              {cliente.label}
                            </Badge>
                          ))}
                        </div>
                      </Flex>
                    </Card>
                  )}
                </div>
              </Flex>
            </Card>
          </div>

          {/* Esercizi */}
          <Card className="p-8 shadow-xl bg-white/90 backdrop-blur-sm">
            <Flex direction="column" gap="6">
              <Text size="6" weight="bold">
                Esercizi associati
              </Text>

              {allExercises.map((ex) => {
                const existing = selectedExercises.find(
                  (e) => e.esercizioId === ex.id
                );
                const isSelected = !!existing;

                const handleToggle = () => {
                  setSelectedExercises((prev) => {
                    if (isSelected) {
                      return prev.filter((e) => e.esercizioId !== ex.id);
                    } else {
                      const originalData = originalExercises.find(
                        (orig) => orig.esercizioId === ex.id
                      );
                      if (originalData) {
                        return [
                          ...prev,
                          {
                            esercizioId: ex.id,
                            serie: originalData.serie || "",
                            ripetizioni: originalData.ripetizioni || "",
                            peso: originalData.peso || "",
                          },
                        ];
                      } else {
                        return [
                          ...prev,
                          {
                            esercizioId: ex.id,
                            serie: "",
                            ripetizioni: "",
                            peso: "",
                          },
                        ];
                      }
                    }
                  });
                };

                const handleChange = (field) => (e) => {
                  const value = e.target.value;
                  setSelectedExercises((prev) => {
                    return prev.map((item) => {
                      if (item.esercizioId === ex.id) {
                        return { ...item, [field]: value };
                      }
                      return item;
                    });
                  });
                };

                return (
                  <div key={ex.id} className="p-4 border rounded-lg space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={handleToggle}
                      />
                      <Text size="3" weight="bold">
                        {ex.nome}
                      </Text>
                    </label>

                    {isSelected && (
                      <div className="grid grid-cols-3 gap-4">
                        <input
                          type="number"
                          value={existing?.serie ?? ""}
                          onChange={handleChange("serie")}
                          placeholder="Serie"
                          className="border px-2 py-1 rounded"
                        />
                        <input
                          type="number"
                          value={existing?.ripetizioni ?? ""}
                          onChange={handleChange("ripetizioni")}
                          placeholder="Ripetizioni"
                          className="border px-2 py-1 rounded"
                        />
                        <input
                          type="number"
                          value={existing?.peso ?? ""}
                          onChange={handleChange("peso")}
                          placeholder="Peso (kg)"
                          className="border px-2 py-1 rounded"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </Flex>
          </Card>

          {/* Actions */}
          <Card className="p-6 shadow-xl bg-white/90 backdrop-blur-sm">
            <Flex gap="4" justify="center" className="flex-wrap">
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  !titolo.trim() ||
                  !data ||
                  selectedClientIds.length === 0
                }
                size="4"
                className="min-w-48 h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-xl"
              >
                <Flex align="center" gap="3">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <Text>Salvataggio in corso...</Text>
                    </>
                  ) : (
                    <>
                      <Save className="h-6 w-6" />
                      <Text>Salva Modifiche</Text>
                    </>
                  )}
                </Flex>
              </Button>

              <Button
                type="button"
                variant="soft"
                size="4"
                className="min-w-32 h-14 text-lg"
                onClick={() => navigate("/coach/workouts")}
                disabled={isLoading}
              >
                <Flex align="center" gap="2">
                  <X className="h-5 w-5" />
                  <Text>Annulla</Text>
                </Flex>
              </Button>
            </Flex>
          </Card>
        </form>
      </div>
    </div>
  );
}
