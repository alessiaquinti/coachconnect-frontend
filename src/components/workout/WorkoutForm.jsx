import { useState } from "react";
import { Text, Flex, Button } from "@radix-ui/themes";
import {
  FileText,
  Calendar,
  Users,
  Target,
  Clock,
  Save,
  Loader2,
  LayoutTemplateIcon as Template,
} from "lucide-react";
import Select from "react-select";

export default function WorkoutForm({
  onSubmit,
  isLoading = false,
  clientOptions = [],
  initialData = {},
}) {
  const [formData, setFormData] = useState({
    titolo: initialData.titolo || "",
    descrizione: initialData.descrizione || "",
    dataConsigliata: initialData.dataConsigliata || "",
    clientiIds: initialData.clientiIds || [],
    isTemplate: initialData.isTemplate || false,
    ...initialData,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      titolo: formData.titolo,
      descrizione: formData.descrizione,
      esercizi: formData.esercizi || [],
    };

    if (!formData.isTemplate && formData.clientiIds.length > 0) {
      submitData.clientiIds = formData.clientiIds;
      submitData.dataConsigliata = formData.dataConsigliata || null;
    }

    onSubmit(submitData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const clientSelectOptions = clientOptions.map((client) => ({
    value: client.id,
    label: client.user?.name || client.nome || "Cliente",
  }));

  const today = new Date().toISOString().slice(0, 16);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Informazioni Base */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
          <Flex direction="column" gap="6">
            <Flex
              align="center"
              gap="3"
              className="pb-4 border-b border-white/30"
            >
              <div className="p-3 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <Text size="6" weight="bold" className="text-gray-800">
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
                  <Text weight="bold" size="3" className="text-gray-700">
                    Nome Allenamento *
                  </Text>
                </Flex>
                <input
                  className="w-full h-12 px-4 text-base bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60 focus:bg-white/25 transition-all duration-200 shadow-lg"
                  placeholder="es. Allenamento Upper Body Intensivo"
                  value={formData.titolo}
                  onChange={(e) => handleInputChange("titolo", e.target.value)}
                  required
                  minLength={3}
                />
              </Flex>

              <Flex direction="column" gap="3">
                <Flex align="center" gap="2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <Text weight="bold" size="3" className="text-gray-700">
                    Descrizione
                  </Text>
                </Flex>
                <textarea
                  placeholder="Descrivi gli obiettivi e le indicazioni specifiche..."
                  value={formData.descrizione}
                  onChange={(e) =>
                    handleInputChange("descrizione", e.target.value)
                  }
                  rows={5}
                  className="w-full text-base bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60 focus:bg-white/25 transition-all duration-200 shadow-lg resize-none p-4"
                />
              </Flex>
            </div>
          </Flex>
        </div>

        {/* Assegnazione - Solo se non è template */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
          <Flex direction="column" gap="6">
            <Flex
              align="center"
              gap="3"
              className="pb-4 border-b border-white/30"
            >
              <div className="p-3 bg-purple-100/80 backdrop-blur-sm border border-purple-200/50 rounded-xl shadow-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <Text size="6" weight="bold" className="text-gray-800">
                  {formData.isTemplate ? "Template" : "Assegnazione"}
                </Text>
                <Text size="3" color="gray">
                  {formData.isTemplate
                    ? "Crea un template riutilizzabile"
                    : "Assegna a clienti specifici"}
                </Text>
              </div>
            </Flex>

            {formData.isTemplate ? (
              <div className="text-center py-8">
                <Template className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <Text
                  size="4"
                  weight="medium"
                  className="block mb-2 text-purple-700"
                >
                  Modalità Template
                </Text>
                <Text size="3" color="gray">
                  Questo allenamento sarà salvato come template e potrà essere
                  assegnato successivamente a uno o più clienti
                </Text>
              </div>
            ) : (
              <div className="space-y-6">
                <Flex direction="column" gap="3">
                  <Flex align="center" gap="2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <Text weight="bold" size="3" className="text-gray-700">
                      Data Consigliata (opzionale)
                    </Text>
                  </Flex>
                  <input
                    type="datetime-local"
                    value={formData.dataConsigliata}
                    min={today}
                    onChange={(e) =>
                      handleInputChange("dataConsigliata", e.target.value)
                    }
                    className="w-full h-12 px-4 text-base bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:border-purple-400/60 focus:bg-white/25 transition-all duration-200 shadow-lg"
                  />
                  <Text size="2" color="gray">
                    Data entro cui il cliente dovrebbe completare l'allenamento
                  </Text>
                </Flex>

                <Flex direction="column" gap="3">
                  <Flex align="center" gap="2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <Text weight="bold" size="3" className="text-gray-700">
                      Clienti *
                    </Text>
                  </Flex>
                  <div className="bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl shadow-lg p-1">
                    <Select
                      isMulti
                      options={clientSelectOptions}
                      value={clientSelectOptions.filter((opt) =>
                        formData.clientiIds.includes(opt.value)
                      )}
                      onChange={(selectedOptions) => {
                        const selectedIds = selectedOptions
                          ? selectedOptions.map((opt) => opt.value)
                          : [];
                        handleInputChange("clientiIds", selectedIds);
                      }}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Seleziona uno o più clienti..."
                      noOptionsMessage={() => "Nessun cliente disponibile"}
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: "transparent",
                          border: "none",
                          boxShadow: "none",
                          "&:hover": { border: "none" },
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.4)",
                          borderRadius: "0.75rem",
                          overflow: "hidden",
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                        }),
                        multiValue: (base) => ({
                          ...base,
                          backgroundColor: "rgba(147, 51, 234, 0.1)",
                          borderRadius: "0.5rem",
                        }),
                        multiValueLabel: (base) => ({
                          ...base,
                          color: "rgb(147, 51, 234)",
                          fontWeight: "500",
                        }),
                        multiValueRemove: (base) => ({
                          ...base,
                          color: "rgb(147, 51, 234)",
                          ":hover": {
                            backgroundColor: "rgba(147, 51, 234, 0.2)",
                            color: "rgb(147, 51, 234)",
                          },
                        }),
                      }}
                    />
                  </div>
                  <Text size="2" color="gray">
                    Seleziona i clienti a cui assegnare questo allenamento
                  </Text>
                  {formData.clientiIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.clientiIds.map((clientId) => {
                        const client = clientOptions.find(
                          (c) => c.id === clientId
                        );
                        return (
                          <div
                            key={clientId}
                            className="px-3 py-1 bg-purple-100/80 backdrop-blur-sm border border-purple-200/50 rounded-full text-sm text-purple-700 font-medium"
                          >
                            {client?.user?.name || client?.nome || "Cliente"}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Flex>
              </div>
            )}
          </Flex>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-8">
        <Button
          type="submit"
          disabled={
            isLoading ||
            !formData.titolo.trim() ||
            (!formData.isTemplate && formData.clientiIds.length === 0)
          }
          size="4"
          className="w-full max-w-md h-16 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-xl border border-blue-300/50"
        >
          <Flex align="center" gap="3">
            {isLoading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <Text>Salvataggio...</Text>
              </>
            ) : (
              <>
                <Save className="h-6 w-6" />
                <Text>
                  {formData.isTemplate ? "Crea Template" : "Crea e Assegna"}
                </Text>
              </>
            )}
          </Flex>
        </Button>
      </div>
    </form>
  );
}
