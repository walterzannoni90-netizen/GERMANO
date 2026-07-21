import { Button } from "@/components/ui/button";

const categories = [
  { name: "Tutti i documenti", icon: "📁", count: 24 },
  { name: "Programmi allenamento", icon: "💪", count: 8 },
  { name: "Referti medici", icon: "🩺", count: 6 },
  { name: "Ricevute", icon: "💳", count: 7 },
  { name: "Consensi", icon: "📝", count: 3 },
  { name: "Certificati", icon: "📜", count: 2 },
];

export function DocumentCategory() {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold text-white mb-4">Categorie</h2>
      {categories.map((category) => (
        <Button
          key={category.name}
          variant="secondary"
          className="w-full justify-between rounded-xl hover:bg-neutral-800 text-left"
        >
          <div className="flex items-center gap-3">
            <span>{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </div>
          <span className="bg-neutral-700 text-white text-xs px-2 py-1 rounded-full">
            {category.count}
          </span>
        </Button>
      ))}
    </div>
  );
}
