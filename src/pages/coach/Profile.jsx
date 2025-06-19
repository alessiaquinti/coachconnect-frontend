"use client";

import { useState, useRef } from "react";
import { useUser } from "@/contexts/UserProvider";
import { useAxios } from "@/contexts/AxiosProvider";
import usePageTitle from "@/hooks/usePageTitle";
import {
  User,
  Camera,
  Lock,
  Mail,
  Save,
  Upload,
  Eye,
  EyeOff,
  Check,
  X,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function CoachProfile() {
  usePageTitle("Il Mio Profilo");
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const { user, updateUser } = useUser();
  const axios = useAxios();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(user?.profileImg || null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [personalData, setPersonalData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });
  const [updatingPersonal, setUpdatingPersonal] = useState(false);
  const [personalSuccess, setPersonalSuccess] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

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

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadProfileImage = async () => {
    if (!imagePreview) return;

    setUploadingImage(true);
    try {
      const response = await fetch(imagePreview);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("avatar", blob, "profile.jpg");

      const result = await axios.post("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfileImage(result.data.avatarUrl);
      setImagePreview(null);
      updateUser({ ...user, profileImg: result.data.avatarUrl });

      toast.success("Foto profilo aggiornata con successo! ");
    } catch (error) {
      toast.error("Errore durante l'upload dell'immagine");
    } finally {
      setUploadingImage(false);
    }
  };

  // Aggiorna dati personali
  const updatePersonalData = async () => {
    setUpdatingPersonal(true);
    setPersonalSuccess(false);

    try {
      await axios.patch("/profile", personalData);
      updateUser({ ...user, ...personalData });
      setPersonalSuccess(true);
      toast.success("Dati personali aggiornati!");
      setTimeout(() => setPersonalSuccess(false), 3000);
    } catch (error) {
      toast.error("Errore durante l'aggiornamento dei dati");
    } finally {
      setUpdatingPersonal(false);
    }
  };

  // Cambia password
  const changePassword = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("Compila tutti i campi");
      toast.error("Compila tutti i campi");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("La nuova password deve essere di almeno 6 caratteri");
      toast.error("La nuova password deve essere di almeno 6 caratteri");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Le password non coincidono");
      toast.error("Le password non coincidono");
      return;
    }

    setUpdatingPassword(true);
    try {
      await axios.patch("/profile/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordSuccess(true);
      toast.success("Password cambiata con successo!");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Errore durante il cambio password";
      setPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-25 to-purple-50"></div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 bg-indigo-200/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/coach")}
            className="p-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-200 shadow-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 drop-shadow-sm">
              Il Mio Profilo
            </h1>
            <p className="text-gray-600">
              Gestisci le tue informazioni personali
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Foto Profilo */}
          <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
            <div className="flex items-center gap-3 mb-6">
              <Camera className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">Foto Profilo</h2>
            </div>

            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-xl">
                  {imagePreview ? (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : profileImage ? (
                    <img
                      src={`${API_BASE_URL}${profileImage}`}
                      alt="Profilo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log(
                          "Errore caricamento immagine:",
                          profileImage
                        );
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100">
                      <User className="h-12 w-12 text-blue-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
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
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={uploadProfileImage}
                    disabled={uploadingImage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-all duration-200 flex items-center gap-2 shadow-lg"
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
                    className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
                  >
                    <X className="h-4 w-4" />
                    Annulla
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Dati Personali */}
          <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Dati Personali
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={personalData.name}
                  onChange={(e) =>
                    setPersonalData({ ...personalData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
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
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={personalData.bio}
                  onChange={(e) =>
                    setPersonalData({ ...personalData, bio: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                  placeholder="Raccontaci qualcosa di te..."
                />
              </div>

              <button
                onClick={updatePersonalData}
                disabled={updatingPersonal}
                className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                {updatingPersonal ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : personalSuccess ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {updatingPersonal
                  ? "Salvataggio..."
                  : personalSuccess
                  ? "Salvato!"
                  : "Salva Modifiche"}
              </button>
            </div>
          </div>
        </div>

        {/* Cambio Password */}
        <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Cambia Password</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Attuale
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 pr-10 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      current: !showPasswords.current,
                    })
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nuova Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 pr-10 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      new: !showPasswords.new,
                    })
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conferma Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 pr-10 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirm: !showPasswords.confirm,
                    })
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {passwordError && (
            <div className="mt-4 p-3 bg-red-100/80 border border-red-200 rounded-xl text-red-700 text-sm">
              {passwordError}
            </div>
          )}

          <button
            onClick={changePassword}
            disabled={updatingPassword}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            {updatingPassword ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : passwordSuccess ? (
              <Check className="h-5 w-5" />
            ) : (
              <Lock className="h-5 w-5" />
            )}
            {updatingPassword
              ? "Aggiornamento..."
              : passwordSuccess
              ? "Password Aggiornata!"
              : "Cambia Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
