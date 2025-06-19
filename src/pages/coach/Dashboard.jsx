import { useUser } from "@/contexts/UserProvider";
import { useNavigate } from "react-router-dom";
import { Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Dumbbell,
  Users,
  BookOpen,
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  Award,
  Activity,
  Star,
  Calendar,
} from "lucide-react";
import usePageTitle from "@/hooks/usePageTitle";
import { useEffect, useState } from "react";
import { useAxios } from "@/contexts/AxiosProvider";

export default function CoachDashboard() {
  usePageTitle("Dashboard");
  const { user } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const axios = useAxios();

  useEffect(() => {
    axios
      .get("/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error("Errore caricamento stats:", err);
        setStats({ clienti: 0, allenamenti: 0, ore: 0 });
      });
  }, [axios]);

  const quickStats = stats
    ? [
        {
          icon: Users,
          label: "Clienti Attivi",
          value: stats.clienti,
          color: "blue",
          trend: "",
        },
        {
          icon: Dumbbell,
          label: "Allenamenti Creati",
          value: stats.allenamenti,
          color: "green",
          trend: "",
        },
        {
          icon: Clock,
          label: "Ore di Coaching",
          value: `${stats.ore}h`,
          color: "orange",
          trend: "",
        },
      ]
    : [];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-50"></div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200/15 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 bg-pink-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-indigo-200/20 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 p-6 space-y-8">
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
          <Flex align="center" justify="between">
            <div>
              <Heading size="6" className="text-gray-800 mb-2 drop-shadow-sm">
                Ciao {user?.name}!
              </Heading>
              <Text size="4" className="text-gray-600 drop-shadow-sm">
                Benvenuto nella tua area coach professionale
              </Text>
              <Text size="3" className="text-gray-500 mt-2">
                Gestisci i tuoi clienti e crea allenamenti personalizzati
              </Text>
            </div>
            <div className="hidden md:block">
              <div className="p-4 bg-white/25 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg">
                <Award className="h-12 w-12 text-blue-600 drop-shadow-sm" />
              </div>
            </div>
          </Flex>
        </div>

        {/* Statistiche */}
        <div>
          <Heading
            size="5"
            className="mb-4 flex items-center gap-2 text-gray-800 drop-shadow-sm"
          >
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Statistiche Rapide
          </Heading>
          <Grid columns={{ initial: "1", sm: "2", lg: "4" }} gap="4">
            {quickStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-xl ring-1 ring-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-[1.02]"
              >
                <Flex direction="column" gap="3">
                  <Flex align="center" justify="between">
                    <div className="p-3 bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg">
                      <stat.icon className="h-6 w-6 text-gray-700" />
                    </div>
                  </Flex>
                  <div>
                    <Text
                      size="6"
                      weight="bold"
                      className="block text-gray-800 drop-shadow-sm"
                    >
                      {stat.value}
                    </Text>
                    <Text size="2" className="text-gray-600">
                      {stat.label}
                    </Text>
                  </div>
                </Flex>
              </div>
            ))}
          </Grid>
        </div>

        {/* Azioni */}
        <div>
          <Heading
            size="5"
            className="mb-4 flex items-center gap-2 text-gray-800 drop-shadow-sm"
          >
            <Target className="h-5 w-5 text-purple-600" />
            Azioni Principali
          </Heading>
          <Grid columns={{ initial: "1", md: "3" }} gap="6">
            <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-[1.02] group">
              <Flex direction="column" gap="4">
                <div className="p-4 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl w-fit group-hover:bg-blue-200/80 transition-colors shadow-lg">
                  <Dumbbell className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <Heading size="4" className="mb-2 text-gray-800">
                    Allenamenti
                  </Heading>
                  <Text size="3" className="text-gray-600 mb-4">
                    Crea, modifica e assegna schede di allenamento
                    personalizzate ai tuoi clienti.
                  </Text>
                </div>
                <div className="space-y-3 mt-auto">
                  <button
                    className="w-full h-12 bg-blue-500/80 hover:bg-blue-600/80 backdrop-blur-sm border border-blue-300/50 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                    onClick={() => navigate("/coach/workouts")}
                  >
                    <Activity className="h-4 w-4" />
                    Gestisci allenamenti
                  </button>
                  <button
                    className="w-full h-12 bg-white/30 hover:bg-white/40 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    onClick={() => navigate("/coach/workout/new")}
                  >
                    <PlusIcon />
                    Nuovo allenamento
                  </button>
                </div>
              </Flex>
            </div>

            <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-[1.02] group">
              <Flex direction="column" gap="4">
                <div className="p-4 bg-green-100/80 backdrop-blur-sm border border-green-200/50 rounded-2xl w-fit group-hover:bg-green-200/80 transition-colors shadow-lg">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <Heading size="4" className="mb-2 text-gray-800">
                    Libreria Esercizi
                  </Heading>
                  <Text size="3" className="text-gray-600 mb-4">
                    Aggiungi nuovi esercizi, modifica quelli esistenti e
                    organizza la tua libreria.
                  </Text>
                </div>
                <div className="mt-auto">
                  <button
                    className="w-full h-12 bg-green-500/80 hover:bg-green-600/80 backdrop-blur-sm border border-green-300/50 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                    onClick={() => navigate("/coach/exercises")}
                  >
                    <BookOpen className="h-4 w-4" />
                    Vai alla libreria
                  </button>
                </div>
              </Flex>
            </div>

            <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-[1.02] group">
              <Flex direction="column" gap="4">
                <div className="p-4 bg-purple-100/80 backdrop-blur-sm border border-purple-200/50 rounded-2xl w-fit group-hover:bg-purple-200/80 transition-colors shadow-lg">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <Heading size="4" className="mb-2 text-gray-800">
                    Calendario Allenamenti
                  </Heading>
                  <Text size="3" className="text-gray-600 mb-4">
                    Visualizza i workout assegnati nel calendario
                  </Text>
                </div>

                <div className="mt-auto">
                  <button
                    className="w-full h-12 bg-purple-500/80 hover:bg-purple-600/80 backdrop-blur-sm border border-purple-300/50 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                    onClick={() => navigate("/coach/calendar")}
                  >
                    <Calendar className="h-4 w-4" />
                    Vai alla libreria
                  </button>
                </div>
              </Flex>
            </div>
          </Grid>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 shadow-lg">
            <Text size="2" className="text-gray-600">
              CoachConnect &copy; 2025 - Tutti i diritti riservati
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
