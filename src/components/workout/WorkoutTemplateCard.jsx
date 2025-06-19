import { useState } from "react";
import { Text, Flex, Badge, Button } from "@radix-ui/themes";
import {
  LayoutTemplate,
  Eye,
  Edit3,
  Copy,
  Trash2,
  MoreVertical,
  Calendar,
} from "lucide-react";

export default function WorkoutTemplateCard({
  template,
  onView,
  onEdit,
  onAssign,
  onDuplicate,
  onDelete,
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  const getTemplateStats = () => {
    const exerciseCount = template.esercizi?.length || 0;
    const totalSets =
      template.esercizi?.reduce((acc, ex) => acc + (ex.serie || 0), 0) || 0;
    const utilizzi = template.utilizzi || 0;
    return { exerciseCount, totalSets, utilizzi };
  };

  const stats = getTemplateStats();

  const handleDropdownClick = (e, action) => {
    e.stopPropagation();
    setShowDropdown(false);
    action();
  };

  return (
    <div
      className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl ring-1 ring-white/20 hover:shadow-2xl transition-all duration-300 hover:border-purple-200/50 group cursor-pointer relative"
      onClick={() => onView(template.id)}
    >
      {/* Dropdown Menu */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
          className="p-2 rounded-lg bg-white/30 backdrop-blur-sm border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
        >
          <MoreVertical className="h-4 w-4 text-gray-600" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl shadow-2xl ring-1 ring-white/20 py-2 z-20">
            <button
              onClick={(e) => handleDropdownClick(e, () => onView(template.id))}
              className="w-full px-4 py-2 text-left hover:bg-white/50 transition-colors flex items-center gap-2 text-gray-700"
            >
              <Eye className="h-4 w-4" />
              Visualizza
            </button>
            <button
              onClick={(e) => handleDropdownClick(e, () => onEdit(template.id))}
              className="w-full px-4 py-2 text-left hover:bg-white/50 transition-colors flex items-center gap-2 text-gray-700"
            >
              <Edit3 className="h-4 w-4" />
              Modifica
            </button>
            <button
              onClick={(e) =>
                handleDropdownClick(e, () => onAssign(template.id))
              }
              className="w-full px-4 py-2 text-left hover:bg-white/50 transition-colors flex items-center gap-2 text-purple-700"
            >
              <Calendar className="h-4 w-4" />
              Assegna
            </button>
            <button
              onClick={(e) =>
                handleDropdownClick(e, () => onDuplicate(template.id))
              }
              className="w-full px-4 py-2 text-left hover:bg-white/50 transition-colors flex items-center gap-2 text-gray-700"
            >
              <Copy className="h-4 w-4" />
              Duplica
            </button>
            <div className="border-t border-gray-200/50 my-1"></div>
            <button
              onClick={(e) =>
                handleDropdownClick(e, () => onDelete(template.id))
              }
              className="w-full px-4 py-2 text-left hover:bg-red-50/50 transition-colors flex items-center gap-2 text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Elimina
            </button>
          </div>
        )}
      </div>

      <Flex direction="column" gap="4">
        {/* Header */}
        <div>
          <Flex align="center" gap="2" className="mb-3">
            <div className="p-2 bg-purple-100/80 backdrop-blur-sm border border-purple-200/50 rounded-lg">
              <LayoutTemplate className="h-4 w-4 text-purple-600" />
            </div>
            <Badge color="purple" variant="soft" size="1">
              Template
            </Badge>
            {stats.utilizzi > 0 && (
              <Badge color="blue" variant="soft" size="1">
                {stats.utilizzi} utilizzi
              </Badge>
            )}
          </Flex>

          <Text
            size="5"
            weight="bold"
            className="block mb-2 group-hover:text-purple-600 transition-colors text-gray-800 pr-8"
          >
            {template.titolo}
          </Text>
        </div>

        {/* Description */}
        {template.descrizione && (
          <Text size="3" color="gray" className="line-clamp-2">
            {template.descrizione}
          </Text>
        )}

        {/* Stats */}
        <Flex gap="4" className="pt-2 border-t border-white/30">
          <div className="text-center">
            <Text size="3" weight="bold" className="block text-purple-600">
              {stats.exerciseCount}
            </Text>
            <Text size="1" color="gray">
              Esercizi
            </Text>
          </div>
          <div className="text-center">
            <Text size="3" weight="bold" className="block text-blue-600">
              {stats.totalSets}
            </Text>
            <Text size="1" color="gray">
              Serie Tot.
            </Text>
          </div>
          <div className="text-center">
            <Text size="3" weight="bold" className="block text-green-600">
              {stats.utilizzi}
            </Text>
            <Text size="1" color="gray">
              Utilizzi
            </Text>
          </div>
        </Flex>

        {/* Actions */}
        <Flex gap="2" className="pt-2 border-t border-white/30">
          <Button
            size="2"
            variant="soft"
            className="flex-1 bg-purple-100/30 backdrop-blur-sm border border-purple-200/40 hover:bg-purple-100/40 text-purple-700"
            onClick={(e) => {
              e.stopPropagation();
              onAssign(template.id);
            }}
          >
            <Calendar className="h-4 w-4" />
            Assegna
          </Button>
          <Button
            size="2"
            variant="soft"
            className="bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(template.id);
            }}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </Flex>
      </Flex>
    </div>
  );
}
