"use client";

import { useEffect, useState } from "react";
import { useAxios } from "@/contexts/AxiosProvider";
import { useUser } from "@/contexts/UserProvider";
import { useNavigate } from "react-router-dom";
import { Text, Badge, Flex, Heading } from "@radix-ui/themes";
import {
  Mail,
  MailOpen,
  MessageCircle,
  User,
  Plus,
  Clock,
  Send,
} from "lucide-react";
import usePageTitle from "@/hooks/usePageTitle";

export default function MessageView() {
  usePageTitle("Messaggi");
  const axios = useAxios();
  const { user } = useUser();
  const navigate = useNavigate();

  const [conversazioni, setConversazioni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      console.log("Aspetto user.id...");
      return;
    }

    setLoading(true);

    axios
      .get("/messages")
      .then((res) => {
        const gruppi = {};

        res.data.forEach((msg) => {
          if (!msg.da || !msg.a) {
            console.warn("Messaggio con utente null ignorato:", msg);
            return;
          }

          const altroUtente = msg.da.id === user.id ? msg.a : msg.da;

          if (!altroUtente || !altroUtente.id) {
            console.warn("AltroUtente null ignorato:", msg);
            return;
          }

          if (!gruppi[altroUtente.id]) {
            gruppi[altroUtente.id] = {
              user: altroUtente,
              ultimiMessaggi: [],
            };
          }
          gruppi[altroUtente.id].ultimiMessaggi.push(msg);
        });

        const lista = Object.values(gruppi).map((conv) => {
          const ultimi = conv.ultimiMessaggi.sort(
            (a, b) => new Date(b.inviatoIl) - new Date(a.inviatoIl)
          )[0];
          return {
            utente: conv.user,
            messaggio: ultimi,
          };
        });

        const conversazioniOrdinate = lista.sort(
          (a, b) =>
            new Date(b.messaggio.inviatoIl) - new Date(a.messaggio.inviatoIl)
        );

        setConversazioni(conversazioniOrdinate);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setConversazioni([]);
      });
  }, [axios, user]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Ora";
    if (diffMins < 60) return `${diffMins}m fa`;
    if (diffHours < 24) return `${diffHours}h fa`;
    if (diffDays < 7) return `${diffDays}g fa`;
    return date.toLocaleDateString("it-IT");
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50"></div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200/15 rounded-full blur-xl animate-pulse delay-500"></div>
          <div className="absolute bottom-32 left-40 w-40 h-40 bg-pink-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20 text-center">
            <Flex align="center" gap="3" justify="center" className="mb-4">
              <div className="p-4 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl shadow-lg">
                <MessageCircle className="h-8 w-8 text-blue-600 animate-pulse" />
              </div>
            </Flex>
            <Text size="5" weight="bold" className="text-blue-600">
              Caricamento conversazioni...
            </Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50"></div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200/15 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 bg-pink-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-indigo-200/20 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <Flex align="center" justify="center" gap="3" className="mb-6">
            <div className="p-4 bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg">
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
          </Flex>
          <Heading
            size="8"
            weight="bold"
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm"
          >
            Messaggi
          </Heading>
          <Text size="4" color="gray" className="max-w-2xl mx-auto">
            Gestisci le conversazioni con i tuoi clienti
          </Text>
        </div>

        {/* Controls ispirato ai templates */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl ring-1 ring-white/20">
          <Flex align="center" justify="between" gap="4" className="flex-wrap">
            <Flex align="center" gap="6">
              <div className="text-center">
                <Text size="4" weight="bold" className="block text-blue-600">
                  {conversazioni.length}
                </Text>
                <Text size="2" color="gray">
                  Conversazioni
                </Text>
              </div>
              <div className="text-center">
                <Text size="4" weight="bold" className="block text-purple-600">
                  {conversazioni.filter((c) => !c.messaggio.letto).length}
                </Text>
                <Text size="2" color="gray">
                  Non letti
                </Text>
              </div>
            </Flex>

            <button
              onClick={() => navigate("/coach/messages/new")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg border border-blue-300/50 cursor-pointer transition-all duration-200 flex items-center gap-2 text-sm font-medium"
              style={{ pointerEvents: "auto" }}
            >
              <Plus className="h-5 w-5" />
              Nuovo Messaggio
            </button>
          </Flex>
        </div>

        {/* Lista conversazioni */}
        {conversazioni.length === 0 ? (
          <div className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl p-16 shadow-2xl ring-1 ring-white/20 text-center">
            <div className="space-y-6">
              <div className="p-6 bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 rounded-full w-fit mx-auto">
                <MessageCircle className="h-16 w-16 text-gray-400" />
              </div>
              <div className="grid">
                <Text
                  size="6"
                  weight="bold"
                  color="gray"
                  className="block mb-2"
                >
                  Nessuna conversazione
                </Text>
                <Text size="4" color="gray" className="mb-6">
                  Inizia a comunicare con i tuoi clienti
                </Text>
                <button
                  onClick={() => navigate("/coach/messages/new")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg border border-blue-300/50 cursor-pointer transition-all duration-200 inline-flex items-center gap-3"
                  style={{ pointerEvents: "auto" }}
                >
                  <Send className="h-5 w-5" />
                  Scrivi il primo messaggio
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {conversazioni.map((conv) => (
              <div
                key={conv.utente.id}
                className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl ring-1 ring-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-[1.01] cursor-pointer group"
                onClick={() => navigate(`/coach/messages/${conv.utente.id}`)}
                style={{ pointerEvents: "auto" }}
              >
                <Flex align="center" gap="4">
                  <div className="p-4 bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg group-hover:bg-white/40 transition-colors">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Flex align="center" justify="between" className="mb-3">
                      <Heading
                        size="4"
                        className="text-gray-800 drop-shadow-sm"
                      >
                        {conv.utente.name || "Utente eliminato"}
                      </Heading>
                      <Flex align="center" gap="2">
                        <Badge
                          color={conv.messaggio.letto ? "gray" : "blue"}
                          variant="soft"
                          className="bg-white/50 backdrop-blur-sm border border-white/30"
                        >
                          {conv.messaggio.letto ? (
                            <MailOpen className="h-3 w-3" />
                          ) : (
                            <Mail className="h-3 w-3" />
                          )}
                          <Text size="1" className="ml-1">
                            {conv.messaggio.letto ? "Letto" : "Nuovo"}
                          </Text>
                        </Badge>
                      </Flex>
                    </Flex>

                    <Text
                      size="3"
                      color="gray"
                      className="block truncate mb-3 leading-relaxed"
                    >
                      {conv.messaggio.testo}
                    </Text>

                    <Flex align="center" gap="2" className="text-gray-500">
                      <div className="p-1 bg-white/30 backdrop-blur-sm rounded-lg">
                        <Clock className="h-3 w-3" />
                      </div>
                      <Text size="2" weight="medium">
                        {formatDate(conv.messaggio.inviatoIl)}
                      </Text>
                    </Flex>
                  </div>
                </Flex>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
