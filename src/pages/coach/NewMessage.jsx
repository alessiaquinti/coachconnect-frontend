"use client";

import { useEffect, useState } from "react";
import { useAxios } from "@/contexts/AxiosProvider";
import { useNavigate } from "react-router-dom";
import {
  Send,
  MessageCircle,
  User,
  ArrowLeft,
  Users,
  Edit3,
  CheckCircle,
} from "lucide-react";

export default function NewMessage() {
  const axios = useAxios();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [testo, setTesto] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Carica i clienti all'avvio
  useEffect(() => {
    axios
      .get("/customers")
      .then((res) => {
        setCustomers(res.data);
      })
      .catch((err) => {
        setError("Impossibile caricare la lista clienti");
      });
  }, [axios]);

  // Gestisce selezione cliente
  const handleCustomerSelect = (customerId) => {
    setSelectedId(customerId);
    const customer = customers.find((c) => c.user.id === customerId);
    setSelectedCustomer(customer);
    setError("");
  };

  // Invia messaggio
  const inviaMessaggio = async () => {
    if (!testo.trim() || !selectedId) {
      setError("Seleziona un destinatario e scrivi un messaggio.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await axios.post("/messages", {
        aId: selectedId,
        testo: testo.trim(),
      });
      navigate(`/coach/messages/${selectedId}`);
    } catch (err) {
      setError("Errore durante l'invio. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sfondo con gradiente */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-25 to-purple-50"
        style={{ pointerEvents: "none" }}
      ></div>

      {/* Elementi geometrici di sfondo */}
      <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 bg-indigo-200/10 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-10 w-20 h-20 bg-purple-200/10 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/coach/messages")}
              className="p-3 bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl hover:bg-white/30 transition-all duration-200 hover:scale-105"
              style={{ pointerEvents: "auto" }}
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl shadow-lg">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 drop-shadow-sm">
                  Nuovo Messaggio
                </h1>
                <p className="text-gray-600">
                  Scrivi un messaggio ai tuoi clienti
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
            {/* Selezione Cliente */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-blue-600" />
                <label className="text-sm font-medium text-gray-800">
                  Seleziona un cliente
                </label>
              </div>

              {customers.length === 0 ? (
                <div className="bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 text-center">
                  <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Nessun cliente disponibile</p>
                </div>
              ) : (
                <div className="grid gap-3 max-h-60 overflow-y-auto">
                  {customers.map((customer) => (
                    <button
                      key={customer.user.id}
                      onClick={() => handleCustomerSelect(customer.user.id)}
                      className={`p-4 rounded-xl border transition-all duration-200 text-left hover:scale-[1.02] ${
                        selectedId === customer.user.id
                          ? "bg-blue-100/80 border-blue-300/50 shadow-lg"
                          : "bg-white/20 border-white/30 hover:bg-white/30"
                      }`}
                      style={{ pointerEvents: "auto" }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            selectedId === customer.user.id
                              ? "bg-blue-200/80"
                              : "bg-white/30"
                          }`}
                        >
                          <User className="h-4 w-4 text-gray-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {customer.user.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {customer.user.email}
                          </p>
                        </div>
                        {selectedId === customer.user.id && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cliente Selezionato */}
            {selectedCustomer && (
              <div className="mb-6 p-4 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-200/80 rounded-lg">
                    <User className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">
                      Messaggio per: {selectedCustomer.user.name}
                    </p>
                    <p className="text-sm text-blue-600">
                      {selectedCustomer.user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Textarea Messaggio */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Edit3 className="h-5 w-5 text-blue-600" />
                <label className="text-sm font-medium text-gray-800">
                  Il tuo messaggio
                </label>
                <span className="text-xs text-gray-500 ml-auto">
                  {testo.length}/500
                </span>
              </div>

              <div className="relative">
                <textarea
                  value={testo}
                  onChange={(e) => setTesto(e.target.value.slice(0, 500))}
                  placeholder="Scrivi il tuo messaggio qui... Puoi dare consigli, motivare o rispondere a domande del tuo cliente."
                  rows={6}
                  disabled={loading}
                  className="w-full p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300/50 transition-all duration-200 text-gray-800 placeholder-gray-500 disabled:opacity-50"
                  style={{ pointerEvents: "auto" }}
                />
                <div className="absolute bottom-3 right-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      testo.length > 450
                        ? "bg-red-400"
                        : testo.length > 300
                        ? "bg-yellow-400"
                        : "bg-green-400"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Errore */}
            {error && (
              <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
                <p className="text-red-700 text-sm font-medium">⚠️ {error}</p>
              </div>
            )}

            {/* Pulsanti */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/coach/messages")}
                className="flex-1 h-12 bg-gray-200/80 hover:bg-gray-300/80 backdrop-blur-sm border border-gray-300/50 text-gray-700 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
                style={{ pointerEvents: "auto" }}
              >
                Annulla
              </button>

              <button
                onClick={inviaMessaggio}
                disabled={!selectedId || !testo.trim() || loading}
                className="flex-1 h-12 bg-blue-500/80 hover:bg-blue-600/80 backdrop-blur-sm border border-blue-300/50 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ pointerEvents: "auto" }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Invio...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Invia Messaggio
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
