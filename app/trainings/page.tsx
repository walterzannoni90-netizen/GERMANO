import { ProgramsList } from "@/components/ProgramsList";
import { FilterTrainings } from "@/components/FilterTrainings";

export default function TrainingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Catalogo Programmi</h1>
        <p className="text-neutral-400">Schede di allenamento professionali create da Germano Poleselli. Acquista e visualizza la scheda completa con tutti gli esercizi giorno per giorno.</p>
      </div>
      
      <FilterTrainings />
      
      <ProgramsList />
    </div>
  );
}