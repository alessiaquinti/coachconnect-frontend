"use client";

import { useState, useRef } from "react";
import { useUser } from "@/contexts/UserProvider";
import { useAxios } from "@/contexts/AxiosProvider";
import usePageTitle from "@/hooks/usePageTitle";
import {
  User,
  Save,
  Check,
  Mail,
  Calendar,
  Users,
  Ruler,
  Weight,
  Camera,
  Upload,
  X,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Text, Flex, Heading } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

export default function MemberProfile() {
  usePageTitle("Il Mio Profilo");
  const { user, updateUser } = useUser();
  const axios = useAxios();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  //const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");

  const [personalData, setPersonalData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    birthdate: user?.birthdate || "",
    gender: user?.gender || "",
    height: user?.height || "",
    weight: user?.weight || "",
    completati: user?.completati || 0,
    ore: user?.ore || 0,
  });

  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async () => {
    setUpdating(true);
    setSuccess(false);
    try {
      await axios.patch("/profile", personalData);
      updateUser({ ...user, ...personalData });
      setSuccess(true);
      toast.success("Profilo aggiornato! ✨");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      toast.error("Errore durante il salvataggio");
    } finally {
      setUpdating(false);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Seleziona un file immagine valido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Il file è troppo grande. Massimo 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async () => {
    if (!imagePreview) return;
  
    setUploadingImage(true);
    try {
      const response = await fetch(imagePreview);
      const blob = await response.blob();
  
      const formData = new FormData();
      formData.append("avatar", blob, "avatar.jpg");
  
      const result = await axios.post("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setImagePreview(null);
    updateUser({ ...user, profileImg: result.data.avatarUrl });
  
      toast.success("Avatar aggiornato con successo! ");
    } catch (error) {
      toast.error("Errore durante l'upload dell'immagine");
    } finally {
      setUploadingImage(false);
    }
  };
  

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
            <button
              onClick={() => navigate("/member")}
              className="p-3 bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl hover:bg-white/40 transition-all duration-200 shadow-lg"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <div className="p-4 bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg">
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </Flex>
          <Heading
            size="8"
            weight="bold"
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm"
          >
            Il Mio Profilo
          </Heading>
          <Text size="4" color="gray" className="max-w-2xl mx-auto">
            Gestisci le tue informazioni personali e i tuoi obiettivi fitness
          </Text>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20 hover:bg-white/30 transition-all duration-300">
            <Flex align="center" gap="3" className="mb-6">
              <div className="p-3 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-xl shadow-lg">
                <Camera className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <Heading size="5" className="text-gray-800 drop-shadow-sm">
                  Foto Profilo
                </Heading>
                <Text size="3" color="gray">
                  Aggiorna la tua immagine
                </Text>
              </div>
            </Flex>

            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-white/50 shadow-2xl backdrop-blur-sm">
                {imagePreview ? (
  <img
    src={imagePreview}
    alt="Preview"
    className="w-full h-full object-cover"
  />
) : user?.profileImg ? (
  <img
    src={`http://localhost:3000${user.profileImg}`}
    alt="Avatar"
    className="w-full h-full object-cover"
    onError={(e) => {
      e.target.style.display = "none";
    }}
  />
) : (
  <div className="w-full h-full flex items-center justify-center">
    <User className="h-12 w-12 text-blue-400" />
  </div>
)}

                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="ml-10 -mt-16 absolute bottom-0 right-0 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 border-2 border-white"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              {imagePreview && (
                <Flex gap="3" justify="center">
                  <button
                    onClick={uploadAvatar}
                    disabled={uploadingImage}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl disabled:opacity-50 transition-all duration-200 flex items-center gap-2 shadow-xl border border-blue-300/50"
                  >
                    {uploadingImage ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {uploadingImage ? "Caricamento..." : "Salva"}
                  </button>
                  <button
                    onClick={() => setImagePreview(null)}
                    className="px-6 py-3 bg-white/30 hover:bg-white/40 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg"
                  >
                    <X className="h-4 w-4" />
                    Annulla
                  </button>
                </Flex>
              )}
            </div>
          </div>

          {/* Dati Base - Stile coach */}
          <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20 hover:bg-white/30 transition-all duration-300">
            <Flex align="center" gap="3" className="mb-6">
              <div className="p-3 bg-green-100/80 backdrop-blur-sm border border-green-200/50 rounded-xl shadow-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <Heading size="5" className="text-gray-800 drop-shadow-sm">
                  Dati Personali
                </Heading>
                <Text size="3" color="gray">
                  Informazioni di base
                </Text>
              </div>
            </Flex>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <Text
                  size="2"
                  weight="bold"
                  color="gray"
                  className="block mb-2"
                >
                  NOME
                </Text>
                <input
                  type="text"
                  value={personalData.name}
                  onChange={(e) =>
                    setPersonalData({ ...personalData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60 focus:bg-white/60 transition-all duration-200 shadow-lg text-gray-700"
                />
              </div>

              {/* Email */}
              <div>
                <Text
                  size="2"
                  weight="bold"
                  color="gray"
                  className="block mb-2"
                >
                  EMAIL
                </Text>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={personalData.email}
                    onChange={(e) =>
                      setPersonalData({
                        ...personalData,
                        email: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60 focus:bg-white/60 transition-all duration-200 shadow-lg text-gray-700"
                  />
                </div>
              </div>

              {/* Data di nascita */}
              <div>
                <Text
                  size="2"
                  weight="bold"
                  color="gray"
                  className="block mb-2"
                >
                  DATA DI NASCITA
                </Text>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={personalData.birthdate}
                    onChange={(e) =>
                      setPersonalData({
                        ...personalData,
                        birthdate: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60 focus:bg-white/60 transition-all duration-200 shadow-lg text-gray-700"
                  />
                </div>
              </div>

              {/* Genere */}
              <div>
                <Text
                  size="2"
                  weight="bold"
                  color="gray"
                  className="block mb-2"
                >
                  GENERE
                </Text>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={personalData.gender}
                    onChange={(e) =>
                      setPersonalData({
                        ...personalData,
                        gender: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60 focus:bg-white/60 transition-all duration-200 shadow-lg text-gray-700 appearance-none"
                  >
                    <option value="">Seleziona</option>
                    <option value="M">Maschio</option>
                    <option value="F">Femmina</option>
                    <option value="Altro">Altro</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20 hover:bg-white/30 transition-all duration-300">
          <Flex align="center" gap="3" className="mb-6">
            <div className="p-3 bg-purple-100/80 backdrop-blur-sm border border-purple-200/50 rounded-xl shadow-lg">
              <Ruler className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <Heading size="5" className="text-gray-800 drop-shadow-sm">
                Dati Fisici
              </Heading>
              <Text size="3" color="gray">
                Altezza, peso e obiettivi fitness
              </Text>
            </div>
          </Flex>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Altezza */}
            <div>
              <Text size="2" weight="bold" color="gray" className="block mb-2">
                ALTEZZA (CM)
              </Text>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={personalData.height}
                  onChange={(e) =>
                    setPersonalData({ ...personalData, height: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:border-purple-400/60 focus:bg-white/60 transition-all duration-200 shadow-lg text-gray-700"
                  placeholder="175"
                />
              </div>
            </div>

            {/* Peso */}
            <div>
              <Text size="2" weight="bold" color="gray" className="block mb-2">
                PESO (KG)
              </Text>
              <div className="relative">
                <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={personalData.weight}
                  onChange={(e) =>
                    setPersonalData({ ...personalData, weight: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:border-purple-400/60 focus:bg-white/60 transition-all duration-200 shadow-lg text-gray-700"
                  placeholder="70"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Text size="2" weight="bold" color="gray" className="block mb-2">
              OBIETTIVI FITNESS
            </Text>
            <input
              type="text"
              value={personalData.fitnessGoal}
              disabled
              className="w-full px-4 py-3 bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 rounded-xl text-gray-500 shadow-lg"
              placeholder="I tuoi obiettivi verranno impostati dal coach"
            />
          </div>

          <button
            onClick={handleUpdate}
            disabled={updating}
            className="w-full mt-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-xl border border-blue-300/50 text-lg font-medium"
          >
            {updating ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : success ? (
              <Check className="h-6 w-6" />
            ) : (
              <Save className="h-6 w-6" />
            )}
            {updating
              ? "Salvataggio in corso..."
              : success
              ? "Profilo Salvato!"
              : "Salva Modifiche"}
          </button>
        </div>
      </div>
    </div>
  );
}
