import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "@radix-ui/themes";
import { Dumbbell, ArrowRight, User, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { coachRegisterSchema } from "@/validators/coachRegister.validator";

export default function CoachRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      name,
      email,
      password,
      role: "coach",
    };

    const parse = coachRegisterSchema.safeParse(formData);

    if (!parse.success) {
      const fieldErrors = {};
      parse.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    setErrors({});

    try {
      console.log("📩 Risposta dal server:", data); 
      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const res = await fetch(
  `${API_BASE_URL}/coachconnect/auth/register`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }
);


      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Errore nella registrazione");
        return;
      }

      toast.success("Registrazione riuscita! Ora puoi accedere.");
      setEmail("");
      setPassword("");
      setName("");
      navigate("/login");
    } catch (err) {
      toast.error("Errore di rete o del server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sfondo gradiente blu/viola */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 z-0" />

      {/* Blobs decorativi */}
      <div className="absolute inset-0 z-0" style={{ pointerEvents: "none" }}>
        {/* Blob 1 */}
        <svg
          className="absolute top-10 left-10 w-80 h-80 blur-md opacity-25 animate-[blobMove_30s_ease-in-out_infinite]"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            d="M41.6,-61.3C53.5,-52.6,63.6,-42.2,68.1,-29.6C72.6,-17,71.5,-2.3,67.4,12.2C63.4,26.7,56.4,40.9,45.3,49.4C34.2,58,19.1,60.9,4.2,56.5C-10.7,52.2,-21.4,40.6,-34.5,32.4C-47.7,24.1,-63.3,19.2,-69.7,8.3C-76.1,-2.6,-73.4,-18.5,-66.2,-31.9C-59,-45.3,-47.4,-56.1,-34.1,-63.6C-20.8,-71.2,-10.4,-75.5,1.5,-78.1C13.3,-80.8,26.6,-81.9,41.6,-61.3Z"
            transform="translate(100 100)"
          />
        </svg>

        {/* Blob 2 */}
        <svg
          className="absolute top-40 right-10 w-72 h-72 blur-md opacity-20 animate-[blobMove_35s_ease-in-out_infinite] delay-150"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            d="M53.7,-47.2C66.1,-33.7,70.8,-11.6,65.7,8.3C60.7,28.3,45.9,46.2,29.2,54.6C12.5,62.9,-6.1,61.7,-21.4,54.1C-36.8,46.6,-48.9,32.7,-58.4,16.3C-67.8,-0.2,-74.6,-19.1,-67.5,-32.1C-60.3,-45.1,-39.1,-52.1,-20.3,-57.2C-1.6,-62.3,14.8,-65.7,32.2,-61.1C49.6,-56.5,68,-43.8,53.7,-47.2Z"
            transform="translate(100 100)"
          />
        </svg>

        {/* Blob 3 */}
        <svg
          className="absolute bottom-24 left-20 w-96 h-96 blur-md opacity-30 animate-[blobMove_40s_ease-in-out_infinite] delay-300"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            d="M57.6,-59.2C71.3,-42.5,76.4,-21.3,74.8,-1.7C73.3,17.9,65.1,35.8,51.5,50.3C37.8,64.7,18.9,75.7,1.2,74.2C-16.6,72.6,-33.1,58.4,-48.1,43.2C-63,27.9,-76.3,11.5,-76.1,-5.2C-75.8,-21.9,-61.9,-39,-45.2,-55.6C-28.5,-72.1,-14.3,-88.1,4.2,-92.3C22.7,-96.5,45.5,-89.9,57.6,-59.2Z"
            transform="translate(100 100)"
          />
        </svg>

        {/* Blob 4 */}
        <svg
          className="absolute top-1/2 left-1/4 w-60 h-60 blur-md opacity-15 animate-[blobMove_28s_ease-in-out_infinite] delay-450"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            d="M43.3,-44.7C57.3,-30.5,70.7,-15.2,72.1,1.3C73.5,17.9,62.9,35.9,49.6,47.5C36.3,59.1,20.2,64.3,2.3,63.1C-15.6,62,-31.2,54.6,-46.6,44C-62.1,33.4,-77.5,19.7,-78.7,4.2C-79.9,-11.4,-66.8,-27.6,-52.3,-41.3C-37.7,-54.9,-21.8,-66.1,-5.4,-62.2C11,-58.3,22,-39,43.3,-44.7Z"
            transform="translate(100 100)"
          />
        </svg>

        {/* Blob 5 */}
        <svg
          className="absolute bottom-10 right-10 w-64 h-64 blur-md opacity-25 animate-[blobMove_45s_ease-in-out_infinite] delay-600"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            d="M39.7,-48.2C49.4,-36.1,55.2,-23.6,59.7,-9.1C64.2,5.5,67.4,21.9,62.2,36.7C57.1,51.5,43.6,64.8,28,68.1C12.3,71.4,-5.5,64.7,-23.2,57.1C-40.8,49.5,-58.4,41.1,-66.7,26.8C-75.1,12.5,-74.3,-8,-65.5,-22.6C-56.8,-37.1,-40.2,-45.6,-24.5,-53.6C-8.7,-61.6,6.1,-69.2,19.2,-65.9C32.2,-62.6,44.4,-48.2,39.7,-48.2Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      {/* CONTENUTO DELL'APP */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header con effetto glass */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/25 backdrop-blur-md border border-white/40 rounded-2xl mb-4 shadow-2xl">
              <Dumbbell className="h-8 w-8 text-white drop-shadow-lg" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              CoachConnect
            </h1>
            <p className="text-white/90 drop-shadow-sm">
              Registrati come coach
            </p>
          </div>

          {/* Card principale con maggiore visibilità */}
          <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 flex items-center gap-2 drop-shadow-sm">
                  <User className="h-4 w-4" />
                  Nome
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 px-4 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60 focus:bg-white/25 transition-all duration-200 shadow-lg"
                  />
                  {errors.name && (
                    <Text size="1" className="text-red-200 mt-1 block">
                      {errors.name}
                    </Text>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 flex items-center gap-2 drop-shadow-sm">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60 focus:bg-white/25 transition-all duration-200 shadow-lg"
                  />
                  {errors.email && (
                    <Text size="1" className="text-red-200 mt-1 block">
                      {errors.email}
                    </Text>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 flex items-center gap-2 drop-shadow-sm">
                  <Lock className="h-4 w-4" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60 focus:bg-white/25 transition-all duration-200 shadow-lg"
                  />
                  {errors.password && (
                    <Text size="1" className="text-red-200 mt-1 block">
                      {errors.password}
                    </Text>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-white/30 hover:bg-white/40 backdrop-blur-md border border-white/50 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] ring-1 ring-white/20"
              >
                {isLoading ? (
                  "Registrazione..."
                ) : (
                  <>
                    Registrati{" "}
                    <ArrowRight className="inline-block ml-1 w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Link aggiuntivi */}
            <div className="mt-6 pt-6 border-t border-white/30">
              <div className="text-center space-y-2">
                <div className="text-xs text-white/80 drop-shadow-sm">
                  Sei già registrato?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-white font-medium hover:underline"
                  >
                    Torna alla pagina di login
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <div className="inline-block bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 shadow-lg">
              <p className="text-xs text-white/80 drop-shadow-sm">
                © 2024 CoachConnect. Tutti i diritti riservati.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
