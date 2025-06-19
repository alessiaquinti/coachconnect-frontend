
import { Text, Flex, Badge } from "@radix-ui/themes"
import { Users } from "lucide-react"

export default function WorkoutClients({ clients = [] }) {
  if (!clients || clients.length === 0) return null

  return (
    <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl ring-1 ring-white/20">
      <Flex direction="column" gap="4">
        <Flex align="center" gap="3">
          <div className="p-3 bg-purple-100/80 backdrop-blur-sm border border-purple-200/50 rounded-xl shadow-lg">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <Text size="5" weight="bold" className="text-gray-800">
            Clienti Assegnati
          </Text>
        </Flex>

        <div className="flex flex-wrap gap-2">
          {clients.map((client, idx) => (
            <Badge
              key={client.clienteId || client.id || idx}
              color="purple"
              variant="soft"
              size="2"
              className="bg-purple-100/80 backdrop-blur-sm border border-purple-200/50"
            >
              {client.cliente?.user?.name || client.user?.name || client.nome || "Cliente"}
            </Badge>
          ))}
        </div>
      </Flex>
    </div>
  )
}
