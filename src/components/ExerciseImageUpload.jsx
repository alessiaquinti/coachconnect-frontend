"use client";

import { useState, useRef } from "react";
import { useAxios } from "@/contexts/AxiosProvider";
import { Camera, X, ImageIcon, Loader2 } from "lucide-react";
import { Text } from "@radix-ui/themes";
import { toast } from "react-hot-toast";

export default function ExerciseImageUpload({
  currentImageUrl,
  onImageChange,
  disabled = false,
}) {
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const axios = useAxios();
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validazione file
    if (!file.type.startsWith("image/")) {
      toast.error("Seleziona un file immagine valido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Il file è troppo grande. Massimo 5MB.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("exerciseImage", file);

      const result = await axios.post("/exercises/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onImageChange(result.data.imageUrl);
      toast.success("Immagine caricata con successo!");
    } catch (error) {
      console.error("Errore upload:", error);
      toast.error("Errore durante l'upload dell'immagine");
    } finally {
      setUploading(false);
    }
  };

  const removeCurrentImage = () => {
    onImageChange("");
    toast.success("Immagine rimossa");
  };


  return (
    <div className="space-y-4">
      {/* Current Image Display */}
      <div className="relative">
        {currentImageUrl ? (
          // Immagine attuale
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden group">
            <img
              src={
                currentImageUrl.startsWith("http")
                  ? currentImageUrl
                  : `${API_BASE_URL}${currentImageUrl}`
              }
              alt="Immagine esercizio"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log("Errore caricamento immagine:", currentImageUrl);
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />

            {/* Fallback */}
            <div
              className="w-full h-full flex items-center justify-center bg-gray-200"
              style={{ display: "none" }}
            >
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
            {/* Overlay per rimuovere */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={removeCurrentImage}
                disabled={disabled || uploading}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          // Placeholder vuoto
          <div className="w-full h-48 bg-gray-100/80 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <Text size="3" color="gray">
                Nessuna immagine
              </Text>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          disabled={disabled || uploading}
          className="hidden"
        />

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="w-full py-3 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center justify-center gap-2 text-gray-700 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <Text size="3" weight="medium">
                Caricamento...
              </Text>
            </>
          ) : (
            <>
              <Camera className="h-5 w-5" />
              <Text size="3" weight="medium">
                {currentImageUrl ? "Cambia Immagine" : "Aggiungi Immagine"}
              </Text>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
