import { Text, Flex } from "@radix-ui/themes";
import { Calendar, Eye } from "lucide-react";

export default function WorkoutHeader({ workout }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Template";
    const date = new Date(dateString);
    return date.toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
      <Flex direction="column" gap="6">
        <Flex align="center" gap="3">
          <div className="p-4 bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg">
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
          <Text size="7" weight="bold" className="text-gray-800 drop-shadow-sm">
            {workout.nome || workout.titolo || "Allenamento"}
          </Text>
        </Flex>

        {workout.descrizione && (
          <Text
            size="4"
            color="gray"
            className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-md"
          >
            {workout.descrizione}
          </Text>
        )}

        <Flex align="center" gap="2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <Text size="3" color="gray">
            {formatDate(workout.dataAllenamento || workout.data)}
          </Text>
        </Flex>
      </Flex>
    </div>
  );
}
