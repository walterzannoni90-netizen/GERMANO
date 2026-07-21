import { TrainingList } from "@/components/TrainingList";
import { FilterTrainings } from "@/components/FilterTrainings";

export default function TrainingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Catalogo Allenamenti</h1>
        <p className="text-neutral-400">Scegli dal nostro ampio catalogo di programmi fitness.</p>
      </div>
      
      <FilterTrainings />
      
      <TrainingList />
    </div>
  );
}
