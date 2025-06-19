import React from "react";
import { useState } from "react";
import { useAxios } from "@/contexts/AxiosProvider";
import { useNavigate } from "react-router-dom";
import { Text, Button, Flex, Card, Badge } from "@radix-ui/themes";
import {
  BookOpen,
  Plus,
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
} from "lucide-react";
import ExerciseImageUpload from "@/components/ExerciseImageUpload";
import { toast } from "react-hot-toast";

export default function ExerciseNew() {
  const axios = useAxios();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [immagineUrl, setImmagineUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const categorieComuni = [
    { name: "Petto", icon: Heart, color: "red" },
    { name: "Schiena", icon: Activity, color: "green" },
    { name: "Gambe", icon: Zap, color: "blue" },
    { name: "Braccia", icon: ImageIcon, color: "purple" },
    { name: "Spalle", icon: Target, color: "orange" },
    { name: "Addominali", icon: Target, color: "yellow" },
  ];

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
      .post("/exercises", { nome, categoria, descrizione, immagineUrl })
      .then(() => {
        setSuccessMessage("Esercizio creato con successo!");
        toast.success("Esercizio creato con successo!");
        setTimeout(() => {
          navigate("/coach/exercises");
        }, 1500);
      })
      .catch((err) => {
        setErrorMessage("Errore durante la creazione dell'esercizio");
        toast.error("Errore durante la creazione dell'esercizio");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Flex align="center" justify="center" gap="3" className="mb-6">
            <div className="p-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl shadow-lg">
              <Plus className="h-8 w-8 text-white" />
            </div>
          </Flex>
          <Text
            as="h1"
            size="8"
            weight="bold"
            className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
          >
            Crea Nuovo Esercizio
          </Text>
          <Text size="4" color="gray" className="max-w-2xl mx-auto">
            Aggiungi un nuovo esercizio alla tua libreria con tutti i dettagli
            necessari
          </Text>
        </div>

        {/* Back Button */}
        <Card className="p-4 shadow-lg bg-white/90 backdrop-blur-sm">
          <Button
            variant="ghost"
            onClick={() => navigate("/coach/exercises")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna alla Libreria Esercizi
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
              <X className="h-5 w-5 text-red-600" />
              <Text color="red" weight="medium" size="3">
                {errorMessage}
              </Text>
            </Flex>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informazioni Base */}
            <Card className="p-8 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <Flex direction="column" gap="6">
                <Flex
                  align="center"
                  gap="3"
                  className="pb-4 border-b border-gray-100"
                >
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <Text size="6" weight="bold">
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
                      <Text weight="bold" size="3">
                        Nome Esercizio *
                      </Text>
                    </Flex>
                    <input
                      type="text"
                      placeholder="es. Panca Piana con Bilanciere"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full h-12 px-4 text-base border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                      required
                    />
                  </Flex>

                  {/* Descrizione */}
                  <Flex direction="column" gap="3">
                    <Flex align="center" gap="2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <Text weight="bold" size="3">
                        Descrizione
                      </Text>
                    </Flex>
                    <textarea
                      placeholder="Descrivi la tecnica di esecuzione, i muscoli coinvolti e eventuali varianti..."
                      value={descrizione}
                      onChange={(e) => setDescrizione(e.target.value)}
                      rows={5}
                      className="w-full text-base border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 resize-none p-4"
                    />
                  </Flex>
                </div>
              </Flex>
            </Card>

            {/* Categoria e Media */}
            <Card className="p-8 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <Flex direction="column" gap="6">
                <Flex
                  align="center"
                  gap="3"
                  className="pb-4 border-b border-gray-100"
                >
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Tag className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <Text size="6" weight="bold">
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
                      <Text weight="bold" size="3">
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
                                ? `bg-${cat.color}-100 border-${cat.color}-300 text-${cat.color}-700`
                                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
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
                      className="w-full h-12 px-4 text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </Flex>

                  <Flex direction="column" gap="3">
                    <Flex align="center" gap="2">
                      <ImageIcon className="h-4 w-4 text-blue-600" />
                      <Text weight="bold" size="3">
                        Immagine Esercizio
                      </Text>
                    </Flex>

                    <ExerciseImageUpload
                      currentImageUrl={immagineUrl}
                      onImageChange={setImmagineUrl}
                      disabled={isLoading}
                    />
                  </Flex>
                </div>
              </Flex>
            </Card>
          </div>

          {/* Preview */}
          {(nome || categoria || descrizione || immagineUrl) && (
            <Card className="p-8 shadow-xl bg-white/90 backdrop-blur-sm">
              <Flex direction="column" gap="6">
                <Flex
                  align="center"
                  gap="3"
                  className="pb-4 border-b border-gray-100"
                >
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <Text size="6" weight="bold">
                      Anteprima Esercizio
                    </Text>
                    <Text size="3" color="gray">
                      Come apparirà nella libreria
                    </Text>
                  </div>
                </Flex>

                <Card className="p-6 border-2 border-purple-200 bg-purple-50/50">
                  <Flex direction="column" gap="4">
                    <Flex align="center" justify="between">
                      <div className="flex-1">
                        <Text size="5" weight="bold" className="block mb-1">
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
                      <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={
                            immagineUrl.startsWith("http")
                              ? immagineUrl
                              : `http://localhost:3000${immagineUrl}`
                          }
                          alt={nome || "Anteprima esercizio"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </Flex>
                </Card>
              </Flex>
            </Card>
          )}

          {/* Actions */}
          <Card className="p-6 shadow-xl bg-white/90 backdrop-blur-sm">
            <Flex gap="4" justify="center" className="flex-wrap">
              <Button
                type="submit"
                disabled={isLoading || !nome.trim()}
                size="4"
                className="min-w-48 h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-xl"
              >
                <Flex align="center" gap="3">
                  {isLoading ? (
                    <>
                      <X className="h-6 w-6 animate-spin" />
                      <Text>Creazione in corso...</Text>
                    </>
                  ) : (
                    <>
                      <Save className="h-6 w-6" />
                      <Text>Salva Esercizio</Text>
                    </>
                  )}
                </Flex>
              </Button>

              <Button
                type="button"
                variant="soft"
                size="4"
                className="min-w-32 h-14 text-lg"
                onClick={() => navigate("/coach/exercises")}
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
