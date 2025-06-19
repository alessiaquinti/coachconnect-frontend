"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAxios } from "@/contexts/AxiosProvider";
import { Text, Flex, Badge } from "@radix-ui/themes";
import {
  ArrowLeft,
  Dumbbell,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Target,
  RotateCcw,
  Mail,
  AlertCircle,
} from "lucide-react";
import usePageTitle from "@/hooks/usePageTitle";

export default function WorkoutView() {
  usePageTitle("Dettagli Workout");
  const { id } = useParams();
  const axios = useAxios();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const response = await axios.get(`/workouts/${id}`);
        setWorkout(response.data);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            "Errore nel caricamento dell'allenamento"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadWorkout();
    }
  }, [axios, id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50 flex items-center justify-center">
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl">
          <Flex align="center" gap="3">
            <div className="p-3 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-full shadow-lg">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <Text color="blue" size="5" weight="bold">
              Caricamento allenamento...
            </Text>
          </Flex>
        </div>
      </div>
    );
  }

  if (!workout || errorMessage) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50"></div>
        <div className="relative z-10 max-w-4xl mx-auto p-6">
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-16 shadow-2xl ring-1 ring-white/20 text-center">
            <div className="space-y-6">
              <div className="p-6 bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-full w-fit mx-auto">
                <AlertCircle className="h-16 w-16 text-red-600" />
              </div>
              <Text color="red" size="5" weight="bold">
                {errorMessage || "Allenamento non trovato"}
              </Text>
              <button
                onClick={() => navigate("/coach/workouts")}
                className="px-6 py-3 bg-blue-500/80 hover:bg-blue-600/80 backdrop-blur-sm border border-blue-300/50 text-white rounded-xl transition-all duration-200 shadow-lg"
              >
                Torna agli Allenamenti
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50"></div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-purple-200/10 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-pink-200/10 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-8">
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-4 shadow-2xl ring-1 ring-white/20">
          <button
            onClick={() => navigate("/coach/workouts")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna agli Allenamenti
          </button>
        </div>

        {/* Workout Header */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
          <Flex align="center" gap="4" className="mb-6">
            <div
              className={`p-4 rounded-2xl shadow-lg ${
                workout.completato
                  ? "bg-gradient-to-r from-green-500 to-blue-600"
                  : "bg-gradient-to-r from-blue-500 to-purple-600"
              }`}
            >
              <Dumbbell className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <Text size="8" weight="bold" className="text-gray-800 mb-2">
                {workout.titolo}
              </Text>
              <Flex align="center" gap="3">
                <Badge
                  color={workout.completato ? "green" : "orange"}
                  variant="soft"
                  size="2"
                  className="bg-white/30 backdrop-blur-sm"
                >
                  {workout.completato ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completato
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      In Corso
                    </>
                  )}
                </Badge>
                {workout.dataConsigliata && (
                  <Badge
                    color="blue"
                    variant="soft"
                    size="2"
                    className="bg-blue-100/80 backdrop-blur-sm"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(workout.dataConsigliata)}
                  </Badge>
                )}
              </Flex>
            </div>
          </Flex>

          {workout.descrizione && (
            <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl p-4 mb-6">
              <Text size="4" className="text-gray-700">
                {workout.descrizione}
              </Text>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4 text-center">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <Text size="5" weight="bold" className="block text-blue-600">
                {workout.clienti?.length || 0}
              </Text>
              <Text size="2" color="gray">
                Clienti Assegnati
              </Text>
            </div>
            <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4 text-center">
              <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <Text size="5" weight="bold" className="block text-purple-600">
                {workout.esercizi?.length || 0}
              </Text>
              <Text size="2" color="gray">
                Esercizi
              </Text>
            </div>
            <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4 text-center">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <Text size="5" weight="bold" className="block text-green-600">
                {workout.clienti?.filter((c) => c.completato)?.length || 0}
              </Text>
              <Text size="2" color="gray">
                Completati
              </Text>
            </div>
            <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-4 text-center">
              <RotateCcw className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <Text size="5" weight="bold" className="block text-orange-600">
                {workout.esercizi?.reduce(
                  (acc, ex) => acc + (ex.serie || 0),
                  0
                ) || 0}
              </Text>
              <Text size="2" color="gray">
                Serie Totali
              </Text>
            </div>
          </div>
        </div>

        {/* Clienti */}
        {workout.clienti && workout.clienti.length > 0 && (
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
            <Flex
              align="center"
              gap="3"
              className="mb-6 pb-4 border-b border-white/30"
            >
              <div className="p-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <Text size="6" weight="bold" className="text-gray-800">
                  Clienti Assegnati
                </Text>
                <Text size="3" color="gray">
                  {workout.clienti.length} clienti hanno ricevuto questo
                  allenamento
                </Text>
              </div>
            </Flex>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workout.clienti.map((cliente, idx) => (
                <div
                  key={idx}
                  className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Flex align="center" gap="3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {cliente.user?.name?.charAt(0)?.toUpperCase() ||
                        cliente.nome?.charAt(0)?.toUpperCase() ||
                        "C"}
                    </div>
                    <div className="flex-1">
                      <Text
                        size="4"
                        weight="bold"
                        className="text-gray-800 mb-1"
                      >
                        {cliente.user?.name || cliente.nome}
                      </Text>
                      <Flex align="center" gap="2">
                        <Mail className="h-3 w-3 text-gray-500" />
                        <Text size="2" color="gray">
                          {cliente.user?.email || cliente.email}
                        </Text>
                      </Flex>
                    </div>
                    <div>
                      {cliente.completato ? (
                        <Badge
                          color="green"
                          variant="soft"
                          size="2"
                          className="bg-green-100/80 backdrop-blur-sm"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completato
                        </Badge>
                      ) : (
                        <Badge
                          color="orange"
                          variant="soft"
                          size="2"
                          className="bg-orange-100/80 backdrop-blur-sm"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          In Corso
                        </Badge>
                      )}
                    </div>
                  </Flex>
                  {cliente.completatoIl && (
                    <div className="mt-3 pt-3 border-t border-white/30">
                      <Text size="2" color="gray">
                        Completato il: {formatDate(cliente.completatoIl)}
                      </Text>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Esercizi */}
        {workout.esercizi && workout.esercizi.length > 0 && (
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
            <Flex
              align="center"
              gap="3"
              className="mb-6 pb-4 border-b border-white/30"
            >
              <div className="p-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl shadow-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <Text size="6" weight="bold" className="text-gray-800">
                  Esercizi dell'Allenamento
                </Text>
                <Text size="3" color="gray">
                  {workout.esercizi.length} esercizi programmati
                </Text>
              </div>
            </Flex>

            <div className="space-y-4">
              {workout.esercizi.map((esercizio, idx) => (
                <div
                  key={idx}
                  className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Flex align="center" gap="4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <Text
                        size="4"
                        weight="bold"
                        className="text-gray-800 mb-1"
                      >
                        {esercizio.esercizio?.nome || esercizio.nome}
                      </Text>
                      {esercizio.esercizio?.categoria && (
                        <Badge
                          color="purple"
                          variant="soft"
                          size="1"
                          className="bg-purple-100/80 backdrop-blur-sm"
                        >
                          {esercizio.esercizio.categoria}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-lg px-3 py-2">
                        <Text
                          size="3"
                          weight="bold"
                          className="text-purple-600"
                        >
                          {esercizio.serie} × {esercizio.ripetizioni}
                        </Text>
                        {esercizio.peso && (
                          <Text size="2" color="gray" className="block">
                            {esercizio.peso}kg
                          </Text>
                        )}
                      </div>
                    </div>
                  </Flex>
                  {esercizio.note && (
                    <div className="mt-3 pt-3 border-t border-white/30">
                      <Text size="2" color="gray">
                        Note: {esercizio.note}
                      </Text>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note */}
        {workout.note && (
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
            <Flex align="center" gap="3" className="mb-4">
              <div className="p-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl shadow-lg">
                <AlertCircle className="h-6 w-6 text-green-600" />
              </div>
              <Text size="6" weight="bold" className="text-gray-800">
                Note dell'Allenamento
              </Text>
            </Flex>
            <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl p-4">
              <Text size="4" className="text-gray-700">
                {workout.note}
              </Text>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
