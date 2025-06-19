import WriteToCoachButton from "@/components/WriteToCoachButton";
import { useAxios } from "@/contexts/AxiosProvider";
import usePageTitle from "@/hooks/usePageTitle";
import { Text } from "@radix-ui/themes";
import {
  Dumbbell,
  Calendar,
  MessageCircle,
  Target,
  Award,
  Activity,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MemberDashboard() {
  usePageTitle("Dashboard");
  const navigate = useNavigate();

  const axios = useAxios();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("/dashboard/stats-customer")
      .then((res) => setStats(res.data))
      .catch((err) => {
        setStats({ completati: 0, ore: 0 });
      });
  }, [axios]);

  const quickStats = stats
    ? [
        {
          icon: Dumbbell,
          label: "Allenamenti Completati",
          value: stats.completati,
          color: "blue",
          trend: "",
        },
        {
          icon: Clock,
          label: "Ore di Allenamento",
          value: `${stats.ore}h`,
          color: "purple",
          trend: "",
        },
      ]
    : [];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-25 to-blue-50"></div>

      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-200/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 bg-pink-200/10 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-10 w-20 h-20 bg-blue-200/10 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>

      <div className="relative p-6 space-y-8">
        {/* Welcome Message */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
          <div className="flex items-center justify-between">
            <div className="grid">
              <Text
                size="6"
                weight="bold"
                className="text-gray-800 mb-2 drop-shadow-sm"
              >
                Benvenuto nella tua area personale
              </Text>
              <Text size="4" className="text-gray-600 drop-shadow-sm">
                Qui troverai i tuoi allenamenti, i tuoi progressi e i messaggi
                dal tuo coach.
              </Text>
            </div>
            <div className="hidden md:block">
              <div className="p-4 bg-white/25 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg">
                <Award className="h-12 w-12 text-purple-600 drop-shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <Text
            size="5"
            weight="bold"
            className="mb-4 flex items-center gap-2 text-gray-800 drop-shadow-sm"
          >
            <Activity className="h-5 w-5 text-purple-600" />I Tuoi Progressi
          </Text>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-xl ring-1 ring-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg">
                      <stat.icon className="h-6 w-6 text-gray-700" />
                    </div>
                  </div>
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
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Actions */}
        <div>
          <Text
            size="5"
            weight="bold"
            className="mb-4 flex items-center gap-2 text-gray-800 drop-shadow-sm"
          >
            <Target className="h-5 w-5 text-purple-600" />
            Azioni Rapide
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-purple-100/80 backdrop-blur-sm border border-purple-200/50 rounded-2xl w-fit group-hover:bg-purple-200/80 transition-colors shadow-lg">
                  <Dumbbell className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <Text size="4" weight="bold" className="mb-2 text-gray-800">
                    I Miei Allenamenti
                  </Text>
                  <Text size="3" className="text-gray-600 mb-4">
                    Visualizza e completa i tuoi allenamenti personalizzati.
                  </Text>
                </div>
                <button
                  className="w-full h-12 bg-purple-500/80 hover:bg-purple-600/80 backdrop-blur-sm border border-purple-300/50 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] mt-auto"
                  onClick={() => navigate("/member/workouts")}
                >
                  <Activity className="h-4 w-4" />
                  Vai agli allenamenti
                </button>

                <WriteToCoachButton />
              </div>
            </div>

            <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl w-fit group-hover:bg-blue-200/80 transition-colors shadow-lg">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <Text size="4" weight="bold" className="mb-2 text-gray-800">
                    Messaggi Coach
                  </Text>
                  <Text size="3" className="text-gray-600 mb-4">
                    Comunica con il tuo coach e ricevi consigli personalizzati.
                  </Text>
                </div>
                <button
                  className="w-full h-12 bg-blue-500/80 hover:bg-blue-600/80 backdrop-blur-sm border border-blue-300/50 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] mt-auto"
                  onClick={() => navigate("/member/messages")}
                >
                  <MessageCircle className="h-4 w-4" />
                  Apri messaggi
                </button>
              </div>
            </div>

            <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-green-100/80 backdrop-blur-sm border border-green-200/50 rounded-2xl w-fit group-hover:bg-green-200/80 transition-colors shadow-lg">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <Text size="4" weight="bold" className="mb-2 text-gray-800">
                    Calendario
                  </Text>
                  <Text size="3" className="text-gray-600 mb-4">
                    Pianifica i tuoi allenamenti e tieni traccia dei progressi.
                  </Text>
                </div>
                <div className="mt-auto">
                  <button
                    className="w-full h-12 bg-green-500/80 hover:bg-green-600/80 backdrop-blur-sm border border-green-300/50 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                    onClick={() => navigate("/member/calendar")}
                  >
                    <Calendar className="h-4 w-4" />
                    Vai al calendario
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 shadow-lg">
            <Text size="2" className="text-gray-600">
              CoachConnect &copy; 2025 - La tua palestra digitale
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
