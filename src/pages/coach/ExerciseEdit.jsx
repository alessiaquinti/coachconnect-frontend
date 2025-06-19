import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAxios } from "@/contexts/AxiosProvider";
import { Text, Button, Flex, Badge } from "@radix-ui/themes";
import {
  BookOpen,
  Save,
  X,
  Target,
  Tag,
  FileText,
  ImageIcon,
  Heart,
  Zap,
  Activity,
  ArrowLeft,
  CheckCircle2,
  Eye,
  Edit3,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function ExerciseEdit() {
  const { id } = useParams();
  const axios = useAxios();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [immagineUrl, setImmagineUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const categorieComuni = [
    { name: "Petto", icon: Heart, color: "red" },
    { name: "Schiena", icon: Activity, color: "green" },
    { name: "Gambe", icon: Zap, color: "blue" },
    { name: "Braccia", icon: ImageIcon, color: "purple" },
    { name: "Spalle", icon: Target, color: "orange" },
    { name: "Addominali", icon: Target, color: "yellow" },
  ];

  useEffect(() => {
    setIsLoadingData(true);
    axios
      .get(`/exercises/${id}`)
      .then((res) => {
        const e = res.data;
        setNome(e.nome || "");
        setCategoria(e.categoria || "");
        setDescrizione(e.descrizione || "");
        setImmagineUrl(e.immagineUrl || "");
        setErrorMessage("");
      })
      .catch((err) => {
        setErrorMessage("Errore nel recupero dell'esercizio");
      })
      .finally(() => setIsLoadingData(false));
  }, [id, axios]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!nome.trim()) {
      setErrorMessage("Il nome dell'esercizio è obbligatorio");
      setIsLoading(false);
      return;
    }

    axios
      .put(`/exercises/${id}`, {
        nome,
        categoria,
        descrizione,
        immagineUrl,
      })
      .then(() => {
        setSuccessMessage("Esercizio aggiornato con successo!");
        setTimeout(() => {
          navigate("/coach/exercises");
        }, 1500);
      })
      .catch((err) => {
        console.error("Errore nel salvataggio", err);
        setErrorMessage("Errore nel salvataggio delle modifiche");
      })
      .finally(() => setIsLoading(false));
  };

  const handleCategoriaSelect = (categoriaName) => {
    setCategoria(categoriaName);
  };

  const getCategoryIcon = (categoria) => {
    const found = categorieComuni.find(
      (c) => c.name.toLowerCase() === categoria.toLowerCase()
    );
    return found ? found.icon : Target;
  };

  const getCategoryColor = (categoria) => {
    const found = categorieComuni.find(
      (c) => c.name.toLowerCase() === categoria.toLowerCase()
    );
    return found ? found.color : "gray";
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-25 to-purple-50"></div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-green-200/15 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 bg-blue-200/10 rounded-full blur-xl animate-pulse delay-500"></div>
          <div className="absolute top-1/2 left-10 w-20 h-20 bg-purple-200/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto p-6">
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-16 shadow-2xl ring-1 ring-white/20 text-center">
            <Loader2 className="h-16 w-16 text-green-600 mx-auto mb-4 animate-spin" />
            <Text size="5" color="gray">
              Caricamento esercizio...
            </Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-25 to-purple-50"></div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-200/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-blue-200/10 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-10 w-20 h-20 bg-purple-200/10 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Flex align="center" justify="center" gap="3" className="mb-6">
            <div className="p-4 bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg">
              <Edit3 className="h-8 w-8 text-green-600" />
            </div>
          </Flex>
          <Text
            as="h1"
            size="8"
            weight="bold"
            className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm"
          >
            Modifica Esercizio
          </Text>
          <Text size="4" color="gray" className="max-w-2xl mx-auto">
            Aggiorna i dettagli dell'esercizio nella tua libreria
          </Text>
        </div>

        {/* Back Button */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-4 shadow-2xl ring-1 ring-white/20">
          <Button
            variant="ghost"
            onClick={() => navigate("/coach/exercises")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna alla Libreria Esercizi
          </Button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100/80 backdrop-blur-sm border border-green-200/50 rounded-xl p-4 shadow-lg">
            <Flex align="center" gap="3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <Text color="green" weight="medium" size="3">
                {successMessage}
              </Text>
            </Flex>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4 shadow-lg">
            <Flex align="center" gap="3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <Text color="red" weight="medium" size="3">
                {errorMessage}
              </Text>
            </Flex>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informazioni Base */}
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20 hover:shadow-3xl transition-all duration-300">
              <Flex direction="column" gap="6">
                <Flex
                  align="center"
                  gap="3"
                  className="pb-4 border-b border-white/30"
                >
                  <div className="p-3 bg-green-100/80 backdrop-blur-sm border border-green-200/50 rounded-xl shadow-lg">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <Text
                      size="6"
                      weight="bold"
                      className="text-gray-800 drop-shadow-sm"
                    >
                      Informazioni Base
                    </Text>
                    <Text size="3" color="gray">
                      Dettagli principali dell'esercizio
                    </Text>
                  </div>
                </Flex>

                <div className="space-y-6">
                  {/* Nome */}
                  <Flex direction="column" gap="3">
                    <Flex align="center" gap="2">
                      <BookOpen className="h-4 w-4 text-green-600" />
                      <Text weight="bold" size="3" className="text-gray-700">
                        Nome Esercizio *
                      </Text>
                    </Flex>
                    <input
                      type="text"
                      placeholder="es. Panca Piana con Bilanciere"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full h-12 px-4 text-base bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/60 focus:border-green-400/60 focus:bg-white/25 transition-all duration-200 shadow-lg"
                      required
                    />
                  </Flex>

                  {/* Descrizione */}
                  <Flex direction="column" gap="3">
                    <Flex align="center" gap="2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <Text weight="bold" size="3" className="text-gray-700">
                        Descrizione
                      </Text>
                    </Flex>
                    <textarea
                      placeholder="Descrivi la tecnica di esecuzione, i muscoli coinvolti e eventuali varianti..."
                      value={descrizione}
                      onChange={(e) => setDescrizione(e.target.value)}
                      rows={5}
                      className="w-full text-base bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/60 focus:border-green-400/60 focus:bg-white/25 transition-all duration-200 shadow-lg resize-none p-4"
                    />
                  </Flex>
                </div>
              </Flex>
            </div>

            {/* Categoria e Media */}
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20 hover:shadow-3xl transition-all duration-300">
              <Flex direction="column" gap="6">
                <Flex
                  align="center"
                  gap="3"
                  className="pb-4 border-b border-white/30"
                >
                  <div className="p-3 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-xl shadow-lg">
                    <Tag className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <Text
                      size="6"
                      weight="bold"
                      className="text-gray-800 drop-shadow-sm"
                    >
                      Categoria e Media
                    </Text>
                    <Text size="3" color="gray">
                      Classificazione e immagini
                    </Text>
                  </div>
                </Flex>

                <div className="space-y-6">
                  {/* Categoria */}
                  <Flex direction="column" gap="3">
                    <Flex align="center" gap="2">
                      <Tag className="h-4 w-4 text-blue-600" />
                      <Text weight="bold" size="3" className="text-gray-700">
                        Categoria
                      </Text>
                    </Flex>

                    {/* Categorie Comuni */}
                    <div className="grid grid-cols-2 gap-3">
                      {categorieComuni.map((cat) => {
                        const IconComponent = cat.icon;
                        const isSelected = categoria === cat.name;
                        return (
                          <button
                            key={cat.name}
                            type="button"
                            onClick={() => handleCategoriaSelect(cat.name)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                              isSelected
                                ? `bg-${cat.color}-100/80 border-${cat.color}-300/50 text-${cat.color}-700 backdrop-blur-sm shadow-lg`
                                : "bg-white/20 border-white/40 text-gray-600 hover:border-white/60 hover:bg-white/30 backdrop-blur-sm shadow-md"
                            }`}
                          >
                            <IconComponent className="h-4 w-4" />
                            <Text size="2" weight="medium">
                              {cat.name}
                            </Text>
                          </button>
                        );
                      })}
                    </div>

                    {/* Input Categoria Personalizzata */}
                    <input
                      type="text"
                      placeholder="O inserisci una categoria personalizzata..."
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full h-12 px-4 text-base bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60 focus:bg-white/25 transition-all duration-200 shadow-lg"
                    />
                  </Flex>

                  {/* Immagine URL */}
                  <Flex direction="column" gap="3">
                    <Flex align="center" gap="2">
                      <ImageIcon className="h-4 w-4 text-blue-600" />
                      <Text weight="bold" size="3" className="text-gray-700">
                        URL Immagine
                      </Text>
                    </Flex>
                    <input
                      type="url"
                      placeholder="https://esempio.com/immagine-esercizio.jpg"
                      value={immagineUrl}
                      onChange={(e) => setImmagineUrl(e.target.value)}
                      className="w-full h-12 px-4 text-base bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60 focus:bg-white/25 transition-all duration-200 shadow-lg"
                    />
                    <Text size="2" color="gray">
                      Inserisci l'URL di un'immagine che mostra l'esercizio
                    </Text>
                  </Flex>
                </div>
              </Flex>
            </div>
          </div>

          {/* Preview */}
          {(nome || categoria || descrizione || immagineUrl) && (
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
              <Flex direction="column" gap="6">
                <Flex
                  align="center"
                  gap="3"
                  className="pb-4 border-b border-white/30"
                >
                  <div className="p-3 bg-purple-100/80 backdrop-blur-sm border border-purple-200/50 rounded-xl shadow-lg">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <Text
                      size="6"
                      weight="bold"
                      className="text-gray-800 drop-shadow-sm"
                    >
                      Anteprima Esercizio
                    </Text>
                    <Text size="3" color="gray">
                      Come apparirà nella libreria dopo le modifiche
                    </Text>
                  </div>
                </Flex>

                <div className="p-6 border-2 border-purple-200/50 bg-purple-50/50 backdrop-blur-sm rounded-xl shadow-lg">
                  <Flex direction="column" gap="4">
                    <Flex align="center" justify="between">
                      <div className="flex-1">
                        <Text
                          size="5"
                          weight="bold"
                          className="block mb-1 text-gray-800"
                        >
                          {nome || "Nome dell'esercizio"}
                        </Text>
                        {categoria && (
                          <Badge
                            color={getCategoryColor(categoria)}
                            variant="soft"
                            size="1"
                          >
                            {React.createElement(getCategoryIcon(categoria), {
                              className: "h-3 w-3 mr-1",
                            })}
                            {categoria}
                          </Badge>
                        )}
                      </div>
                    </Flex>

                    {descrizione && (
                      <Text size="3" color="gray">
                        {descrizione}
                      </Text>
                    )}

                    {immagineUrl && (
                      <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden shadow-md">
                        <img
                          src={immagineUrl || "/placeholder.svg"}
                          alt={nome || "Anteprima esercizio"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </Flex>
                </div>
              </Flex>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl ring-1 ring-white/20">
            <Flex gap="4" justify="center" className="flex-wrap">
              <Button
                type="submit"
                disabled={isLoading || !nome.trim()}
                size="4"
                className="min-w-48 h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-xl border border-green-300/50"
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
                className="min-w-32 h-14 text-lg bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 transition-all duration-200 shadow-lg"
                onClick={() => navigate("/coach/exercises")}
                disabled={isLoading}
              >
                <Flex align="center" gap="2">
                  <X className="h-5 w-5" />
                  <Text>Annulla</Text>
                </Flex>
              </Button>
            </Flex>
          </div>
        </form>
      </div>
    </div>
  );
}
