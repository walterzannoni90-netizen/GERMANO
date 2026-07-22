"use client";

import { Button } from "@/components/ui/button";

export interface ShopFilters {
  target: string;
  level: string;
  search: string;
}

interface FilterTrainingsProps {
  filters: ShopFilters;
  onFilterChange: (filters: ShopFilters) => void;
}

export function FilterTrainings({ filters, onFilterChange }: FilterTrainingsProps) {
  const targets = [
    { value: "Tutti", label: "Tutti" },
    { value: "Uomo", label: "Uomo" },
    { value: "Donna", label: "Donna" },
    { value: "Casa", label: "Casa" },
  ];
  const levels = ["Tutti", "Principiante", "Intermedio", "Avanzato"];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Cerca nel negozio..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="w-full h-10 rounded-full bg-neutral-800 px-4 pr-10 text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-neutral-500 self-center mr-1">Target:</span>
        {targets.map((t) => (
          <Button
            key={t.value}
            variant={filters.target === t.value ? "default" : "outline"}
            className={`rounded-full text-sm whitespace-nowrap ${filters.target === t.value ? "bg-purple-500 text-white" : "border-neutral-700 text-neutral-300"}`}
            onClick={() => onFilterChange({ ...filters, target: t.value })}
          >
            {t.label}
          </Button>
        ))}
        <span className="text-sm text-neutral-500 self-center ml-2 mr-1">Livello:</span>
        {levels.map((l) => (
          <Button
            key={l}
            variant={filters.level === l ? "default" : "outline"}
            className={`rounded-full text-sm whitespace-nowrap ${filters.level === l ? "bg-purple-500 text-white" : "border-neutral-700 text-neutral-300"}`}
            onClick={() => onFilterChange({ ...filters, level: l })}
          >
            {l}
          </Button>
        ))}
      </div>
    </div>
  );
}
