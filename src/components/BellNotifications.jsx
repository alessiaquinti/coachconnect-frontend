"use client";

import { useEffect, useState } from "react";
import { useAxios } from "@/contexts/AxiosProvider";
import { useUser } from "@/contexts/UserProvider";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  Dumbbell,
  MessageCircle,
  BellRing,
  User,
  Clock,
  Target,
  Award,
} from "lucide-react";
import { Box, Text, Badge, Popover } from "@radix-ui/themes";
import { useLocalSocket } from "@/contexts/SocketProvider";

export default function BellNotifications() {
  const axios = useAxios();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [notificheRaggruppate, setNotificheRaggruppate] = useState({});
  const [workoutNotifications, setWorkoutNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const socket = useLocalSocket();

  const getCurrentConversationUserId = () => {
    const pathParts = location.pathname.split("/");
    if (pathParts.includes("messages") && pathParts.length > 3) {
      return pathParts[pathParts.length - 1];
    }
    return null;
  };

  const raggruppaMessaggi = (messaggi) => {
    const gruppi = {};

    messaggi.forEach((msg) => {
      const mittenteId = msg.da.id;

      if (!gruppi[mittenteId]) {
        gruppi[mittenteId] = {
          mittente: msg.da,
          messaggi: [],
          ultimoMessaggio: msg,
          count: 0,
        };
      }

      gruppi[mittenteId].messaggi.push(msg);
      gruppi[mittenteId].count++;

      if (
        new Date(msg.inviatoIl) >
        new Date(gruppi[mittenteId].ultimoMessaggio.inviatoIl)
      ) {
        gruppi[mittenteId].ultimoMessaggio = msg;
      }
    });

    return gruppi;
  };

  useEffect(() => {
    if (!user?.id) return;
    caricaNotifiche();
  }, [user?.id, axios]);

  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      caricaNotifiche();
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id, axios]);

  const caricaNotifiche = () => {
    axios
      .get("/messages/unread")
      .then((res) => {
        const gruppi = raggruppaMessaggi(res.data);
        setNotificheRaggruppate(gruppi);
      })
      .catch((err) => {
        console.error("Errore notifiche messaggi:", err);
      });

    axios
      .get("/notifications")
      .then((res) => {
        const workoutNotifs = res.data.filter(
          (n) =>
            !n.letto &&
            (n.tipo === "WORKOUT_ASSEGNATO" || n.tipo === "WORKOUT_COMPLETATO")
        );
        setWorkoutNotifications(workoutNotifs);
      })
      .catch((err) => {
        console.error("Errore notifiche workout:", err);
      });
  };

  useEffect(() => {
    if (!socket || !user?.id) {
      console.log("Socket o user non disponibili per notifiche");
      return;
    }

    if (socket.connected) {
      socket.emit("register", user.id);
    }

    const handleConnect = () => {
      socket.emit("register", user.id);
    };

    const handleNewMessage = (nuovoMessaggio) => {
      if (nuovoMessaggio.aId === user.id) {
        const currentConversationUserId = getCurrentConversationUserId();
        const mittenteId = nuovoMessaggio.daId;

        if (currentConversationUserId === mittenteId) {
          console.log(
            "Messaggio dalla conversazione attualmente visualizzata, ignoro notifica"
          );
          return;
        }

        setNotificheRaggruppate((prev) => {
          const nuoveNotifiche = { ...prev };

          let messaggioGiaPresente = false;
          Object.values(nuoveNotifiche).forEach((gruppo) => {
            if (gruppo.messaggi.some((msg) => msg.id === nuovoMessaggio.id)) {
              messaggioGiaPresente = true;
            }
          });

          if (messaggioGiaPresente) {
            return prev;
          }

          if (!nuoveNotifiche[mittenteId]) {
            nuoveNotifiche[mittenteId] = {
              mittente: nuovoMessaggio.da,
              messaggi: [nuovoMessaggio],
              ultimoMessaggio: nuovoMessaggio,
              count: 1,
            };
          } else {
            nuoveNotifiche[mittenteId].messaggi.push(nuovoMessaggio);
            nuoveNotifiche[mittenteId].count++;
            nuoveNotifiche[mittenteId].ultimoMessaggio = nuovoMessaggio;
          }

          return nuoveNotifiche;
        });
      }
    };

    const handleNewWorkoutNotification = (notifica) => {
      setWorkoutNotifications((prev) => [
        {
          id: Date.now().toString(),
          tipo: notifica.tipo,
          titolo: notifica.titolo,
          corpo: notifica.corpo,
          metadata: {
            workoutId: notifica.workoutId,
            workoutTitolo: notifica.workoutTitolo,
            coachName: notifica.coachName,
            clienteName: notifica.clienteName,
          },
          letto: false,
          creatoIl: new Date().toISOString(),
        },
        ...prev,
      ]);
    };

    socket.on("connect", handleConnect);
    socket.on("newMessage", handleNewMessage);
    socket.on("newWorkoutNotification", handleNewWorkoutNotification);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("newMessage", handleNewMessage);
      socket.off("newWorkoutNotification", handleNewWorkoutNotification);
    };
  }, [socket, user?.id, location.pathname]);

  useEffect(() => {
    const currentConversationUserId = getCurrentConversationUserId();

    if (
      currentConversationUserId &&
      notificheRaggruppate[currentConversationUserId]
    ) {
      setNotificheRaggruppate((prev) => {
        const nuove = { ...prev };
        delete nuove[currentConversationUserId];
        return nuove;
      });
    }
  }, [location.pathname, notificheRaggruppate]);

  const handleApriConversazione = async (mittenteId, gruppo) => {
    try {
      const promises = gruppo.messaggi.map((msg) =>
        axios.patch(`/messages/${msg.id}/letto`)
      );
      await Promise.all(promises);

      setNotificheRaggruppate((prev) => {
        const nuove = { ...prev };
        delete nuove[mittenteId];
        return nuove;
      });

      const targetPath =
        user.role === "coach"
          ? `/coach/messages/${mittenteId}`
          : `/member/messages/${mittenteId}`;

      navigate(targetPath);
      setOpen(false);
    } catch (err) {
      console.error("Errore nel segnare come letti:", err);
    }
  };

  const handleApriWorkout = async (notifica) => {
    try {
      if (notifica?.id) {
        await axios.patch(`/notifications/${notifica.id}/read`);
      }
      

      setWorkoutNotifications((prev) =>
        prev.filter((n) => n.id !== notifica.id)
      );

      const targetPath =
        user.role === "coach" ? "/coach/workouts" : "/member/workouts";
      navigate(targetPath);
      setOpen(false);
    } catch (err) {
      console.error(" Errore gestione notifica workout:", err);
    }
  };

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

  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case "WORKOUT_ASSEGNATO":
        return (
          <Target className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
        );
      case "WORKOUT_COMPLETATO":
        return <Award className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />;
      default:
        return (
          <Dumbbell className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
        );
    }
  };

  const getNotificationColor = (tipo) => {
    switch (tipo) {
      case "WORKOUT_ASSEGNATO":
        return "purple";
      case "WORKOUT_COMPLETATO":
        return "green";
      default:
        return "purple";
    }
  };

  const totalMessaggi = Object.values(notificheRaggruppate).reduce(
    (sum, gruppo) => sum + gruppo.count,
    0
  );
  const totalWorkouts = workoutNotifications.length;
  const totalNotifiche = totalMessaggi + totalWorkouts;
  const numeroConversazioni = Object.keys(notificheRaggruppate).length;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Box className="relative cursor-pointer p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-200 shadow-lg">
          <Bell className="h-5 w-5 text-gray-700" />
          {totalNotifiche > 0 && (
            <Badge
              color="red"
              variant="solid"
              className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-pink-600 border border-white/50 shadow-lg"
            >
              {totalNotifiche > 99 ? "99+" : totalNotifiche}
            </Badge>
          )}
        </Box>
      </Popover.Trigger>

      <Popover.Content className="w-96 max-h-[500px] overflow-hidden bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl ring-1 ring-white/20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/30">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <BellRing className="h-6 w-6 text-white" />
            </div>
            <div className="grid">
              <Text
                size="5"
                weight="bold"
                className="text-gray-800 drop-shadow-sm"
              >
                Notifiche
              </Text>
              <Text size="3" color="gray">
                {totalNotifiche} {totalNotifiche === 1 ? "nuova" : "nuove"}
              </Text>
            </div>
          </div>

          {totalNotifiche === 0 ? (
            <div className="text-center py-12">
              <div className="p-6 bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 rounded-full w-fit mx-auto mb-4">
                <Bell className="h-12 w-12 text-gray-400" />
              </div>
              <Text size="4" weight="bold" color="gray" className="block mb-2">
                Tutto in ordine!
              </Text>
              <Text size="3" color="gray">
                Non hai nuove notifiche
              </Text>
            </div>
          ) : (
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {workoutNotifications.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-purple-100/80 backdrop-blur-sm border border-purple-200/50 rounded-lg">
                      <Dumbbell className="h-4 w-4 text-purple-600" />
                    </div>
                    <Text size="3" weight="bold" className="text-purple-700">
                      Allenamenti ({workoutNotifications.length})
                    </Text>
                  </div>
                  <div className="space-y-3">
                    {workoutNotifications.map((notifica) => (
                      <div
                        key={notifica.id}
                        className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl p-4 shadow-lg hover:bg-white/60 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                        onClick={() => handleApriWorkout(notifica)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl">
                            {getNotificationIcon(notifica.tipo)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Text
                              size="3"
                              weight="bold"
                              className="block text-gray-800 mb-1"
                            >
                              {notifica.titolo}
                            </Text>
                            <Text
                              size="2"
                              color="gray"
                              className="block mb-2 leading-relaxed"
                            >
                              {notifica.corpo}
                            </Text>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Clock className="h-3 w-3" />
                              <Text size="1" weight="medium">
                                {formatDate(notifica.creatoIl)}
                              </Text>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {workoutNotifications.length > 0 && numeroConversazioni > 0 && (
                <div className="border-t border-white/30 my-4"></div>
              )}

              {numeroConversazioni > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-lg">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <Text size="3" weight="bold" className="text-blue-700">
                      Messaggi ({numeroConversazioni}{" "}
                      {numeroConversazioni === 1
                        ? "conversazione"
                        : "conversazioni"}
                      )
                    </Text>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(notificheRaggruppate).map(
                      ([mittenteId, gruppo]) => (
                        <div
                          key={mittenteId}
                          className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl p-4 shadow-lg hover:bg-white/60 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                          onClick={() =>
                            handleApriConversazione(mittenteId, gruppo)
                          }
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <Text
                                  size="3"
                                  weight="bold"
                                  className="text-gray-800"
                                >
                                  {gruppo.mittente.name}
                                </Text>
                                <Badge
                                  color="blue"
                                  variant="soft"
                                  size="1"
                                  className="bg-blue-100/80 backdrop-blur-sm border border-blue-200/50"
                                >
                                  {gruppo.count}
                                </Badge>
                              </div>
                              <Text
                                size="2"
                                color="gray"
                                className="block truncate mb-2 leading-relaxed"
                              >
                                {gruppo.count === 1
                                  ? gruppo.ultimoMessaggio.testo
                                  : `${gruppo.count} nuovi messaggi`}
                              </Text>
                              <div className="flex items-center gap-2 text-gray-500">
                                <Clock className="h-3 w-3" />
                                <Text size="1" weight="medium">
                                  {formatDate(gruppo.ultimoMessaggio.inviatoIl)}
                                </Text>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer con azioni */}
          {totalNotifiche > 0 && (
            <div className="mt-6 pt-4 border-t border-white/30 space-y-3">
              {numeroConversazioni > 0 && (
                <button
                  onClick={() => {
                    const targetPath =
                      user.role === "coach"
                        ? "/coach/messages"
                        : "/member/messages";
                    navigate(targetPath);
                    setOpen(false);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Vedi tutti i messaggi
                </button>
              )}
            </div>
          )}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
