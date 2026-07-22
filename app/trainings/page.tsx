"use client";
import { useState } from "react";
import { ProgramsList } from "@/components/ProgramsList";
import { FilterTrainings } from "@/components/FilterTrainings";
import type { ShopFilters } from "@/components/FilterTrainings";

export default function TrainingsPage() {
  const [filters, setFilters] = useState<ShopFilters>({ target: "Tutti", level: "Tutti", search: "" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Schede di Allenamento</h1>
        <p className="text-neutral-400">Schede di allenamento professionali create da Germano Poleselli. &euro;40 l&apos;una. Acquista e ricevi il PDF completo.</p>
      </div>
      
      <FilterTrainings filters={filters} onFilterChange={setFilters} />
      
      <ProgramsList filters={filters} />
    </div>
  );
}