import { useUser } from "@/contexts/UserProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAxios } from "@/contexts/AxiosProvider";

export default function ChangePassword() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const axios = useAxios();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Le password non corrispondono");
      return;
    }

    try {
      await axios.post("/auth/change-password", {
        userId: user.id,
        newPassword,
      });

      setSuccess("Password aggiornata! Fai di nuovo login.");
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (err) {
      setError("Errore durante l'aggiornamento della password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-yellow-100 to-white px-4">
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl p-8 rounded-3xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Cambia la tua password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nuova password"
            className="w-full border rounded-xl px-4 py-2 bg-white/60 backdrop-blur-sm border-white/40"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Conferma password"
            className="w-full border rounded-xl px-4 py-2 bg-white/60 backdrop-blur-sm border-white/40"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full bg-green-500 text-white rounded-xl py-2 hover:bg-green-600 transition-all"
          >
            Salva
          </button>
        </form>
      </div>
    </div>
  );
}
