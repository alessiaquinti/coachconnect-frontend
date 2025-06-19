"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAxios } from "@/contexts/AxiosProvider";
import { useUser } from "@/contexts/UserProvider";
import { Text, Button } from "@radix-ui/themes";
import { useSocket } from "@/contexts/SocketProvider";
import { Send, ArrowLeft, User, MessageCircle, Clock } from "lucide-react";

export default function MessageThread() {
  const { id: otherUserId } = useParams();
  const navigate = useNavigate();
  const axios = useAxios();
  const { user } = useUser();
  const [messaggi, setMessaggi] = useState([]);
  const [testo, setTesto] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [error, setError] = useState(null);
  const endRef = useRef(null);

  const socket = useSocket();

  const scrollToBottom = () => {
    setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleTextareaChange = (e) => {
    setTesto(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      inviaMessaggio();
    }
  };

  // Caricamento messaggi
  useEffect(() => {
    if (!otherUserId || !user?.id) return;

    setLoadingMessages(true);
    setError(null);

    axios
      .get(`/messages/${otherUserId}`)
      .then((res) => {
        const ordinati = res.data.sort(
          (a, b) => new Date(a.inviatoIl) - new Date(b.inviatoIl)
        );
        setMessaggi(ordinati);

        if (ordinati.length > 0) {
          const firstMessage = ordinati[0];
          const other =
            firstMessage.da.id === user.id ? firstMessage.a : firstMessage.da;
          setOtherUser(other);
        }

        setLoadingMessages(false);
        scrollToBottom();

        const messaggiDaLeggere = ordinati.filter(
          (msg) => msg.aId === user.id && !msg.letto
        );
        messaggiDaLeggere.forEach((msg) => {
          axios.patch(`/messages/${msg.id}/letto`).catch(console.error);
        });
      })
      .catch((err) => {
        console.error("Errore caricamento messaggi:", err);
        setError("Errore nel caricamento dei messaggi");
        setLoadingMessages(false);
      });
  }, [otherUserId, axios, user?.id]);

  useEffect(() => {
    if (!socket || !user?.id) return;

    const handleNewMessage = (nuovoMessaggio) => {
      const isForThisConversation =
        (nuovoMessaggio.daId === otherUserId &&
          nuovoMessaggio.aId === user.id) ||
        (nuovoMessaggio.daId === user.id && nuovoMessaggio.aId === otherUserId);

      if (isForThisConversation) {
        setMessaggi((prev) => {
          const exists = prev.some((msg) => msg.id === nuovoMessaggio.id);
          if (exists) {
            console.log("Messaggio già presente, ignoro");
            return prev;
          }

          const nuoviMessaggi = [...prev, nuovoMessaggio].sort(
            (a, b) => new Date(a.inviatoIl) - new Date(b.inviatoIl)
          );

          setTimeout(() => scrollToBottom(), 100);

          return nuoviMessaggi;
        });

        if (nuovoMessaggio.aId === user.id) {
          axios
            .patch(`/messages/${nuovoMessaggio.id}/letto`)
            .catch(console.error);
        }
      } else {
        console.log("ℹMessaggio per altra conversazione, ignoro");
      }
    };

    const handleConnect = () => {
      socket.emit("register", user.id);
    };

    if (socket.connected) {
      socket.emit("register", user.id);
    }

    socket.on("connect", handleConnect);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, user?.id, otherUserId, axios]);

  const inviaMessaggio = async () => {
    if (sendingMessage || !testo.trim() || !socket?.connected) return;

    setSendingMessage(true);

    try {
      const payload = {
        aId: otherUserId,
        testo: testo.trim(),
      };

      const res = await axios.post("/messages", payload);

      setMessaggi((prev) => {
        const exists = prev.some((msg) => msg.id === res.data.messaggio.id);
        if (exists) return prev;
        return [...prev, res.data.messaggio];
      });

      setTesto("");
      scrollToBottom();
    } catch (err) {
      console.error("Errore invio messaggio:", err);
    } finally {
      setSendingMessage(false);
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const goBack = () => {
    if (user?.role === "coach") {
      navigate("/coach/messages");
    } else {
      navigate("/member/messages");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl">
          <Text size="4" className="text-gray-600">
            Caricamento...
          </Text>
        </div>
      </div>
    );
  }

  if (loadingMessages) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-25 to-pink-50"
          style={{ pointerEvents: "none" }}
        ></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20 text-center">
            <div className="p-4 bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl w-fit mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-purple-600 animate-pulse" />
            </div>
            <Text size="4" className="text-gray-600">
              Caricamento conversazione...
            </Text>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-red-50 via-pink-25 to-orange-50"
          style={{ pointerEvents: "none" }}
        ></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20 text-center">
            <Text size="4" color="red" className="mb-4">
              {error}
            </Text>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600"
            >
              Ricarica
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isConnected = socket?.connected || false;
  const canSendMessage =
    isConnected && !sendingMessage && testo.trim().length > 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-25 to-pink-50"
        style={{ pointerEvents: "none" }}
      ></div>

      <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-200/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 bg-blue-200/8 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-pink-200/8 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header della conversazione */}
        <div className="bg-white/25 backdrop-blur-xl border-b border-white/40 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button
              onClick={goBack}
              className="p-2 bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/40 transition-all duration-200 shadow-lg"
              style={{ pointerEvents: "auto" }}
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>

            <div className="flex items-center gap-3 flex-1">
              <div className="p-3 bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <Text
                  size="4"
                  weight="bold"
                  className="text-gray-800 drop-shadow-sm"
                >
                  {otherUser?.name || "Conversazione"}
                </Text>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                  <Text size="2" className="text-gray-600">
                    {isConnected ? "Online" : "Offline"}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Area messaggi */}
        <div className="flex-1 overflow-hidden">
          <div className="max-w-4xl mx-auto h-full flex flex-col p-4">
            <div
              className="flex-1 overflow-y-auto space-y-4 mb-4"
              style={{ pointerEvents: "auto" }}
            >
              {messaggi.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl text-center">
                    <div className="p-4 bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl w-fit mx-auto mb-4">
                      <MessageCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <Text size="4" className="text-gray-600">
                      Inizia una nuova conversazione
                    </Text>
                  </div>
                </div>
              ) : (
                messaggi.map((msg) => {
                  const isMyMessage = msg.daId === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isMyMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg backdrop-blur-xl border ${
                          isMyMessage
                            ? "bg-purple-500/80 border-purple-300/50 text-white ml-auto"
                            : "bg-white/30 border-white/40 text-gray-800"
                        }`}
                      >
                        <Text
                          size="3"
                          className={
                            isMyMessage ? "text-white" : "text-gray-800"
                          }
                        >
                          {msg.testo}
                        </Text>
                        <div className="flex items-center gap-1 mt-2">
                          <Clock
                            className={`h-3 w-3 ${
                              isMyMessage ? "text-purple-200" : "text-gray-500"
                            }`}
                          />
                          <Text
                            size="1"
                            className={`${
                              isMyMessage ? "text-purple-200" : "text-gray-500"
                            }`}
                          >
                            {formatTime(msg.inviatoIl)}
                          </Text>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={endRef} />
            </div>

            {/* Area di input */}
            <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl p-4 shadow-xl ring-1 ring-white/20">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <textarea
                    value={testo}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Scrivi un messaggio..."
                    disabled={sendingMessage || !isConnected}
                    className="w-full p-3 bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl resize-none min-h-[60px] max-h-32 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-300/50 disabled:bg-gray-200/50 disabled:cursor-not-allowed transition-all duration-200"
                    style={{
                      pointerEvents: "auto",
                      userSelect: "text",
                      WebkitUserSelect: "text",
                    }}
                  />
                </div>
                <button
                  onClick={inviaMessaggio}
                  disabled={!canSendMessage}
                  className={`p-3 rounded-xl font-medium transition-all duration-200 shadow-lg ${
                    canSendMessage
                      ? "bg-purple-500/80 hover:bg-purple-600/80 text-white hover:scale-105 active:scale-95"
                      : "bg-gray-300/50 text-gray-500 cursor-not-allowed"
                  }`}
                  style={{ pointerEvents: "auto" }}
                >
                  {sendingMessage ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>

              {!isConnected && (
                <div className="mt-2 flex items-center gap-2 text-amber-600">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <Text size="2">Connessione in corso...</Text>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
