import { ProgressStats } from "@/components/ProgressStats";
import { ProgressGraphs } from "@/components/ProgressGraphs";
import { ProgressPhotos } from "@/components/ProgressPhotos";
import { AddMeasurement } from "@/components/AddMeasurement";

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">I Tuoi Progressi</h1>
        <p className="text-neutral-400">Traccia il tuo percorso verso la forma fisica dei tuoi sogni.</p>
      </div>
      
      <AddMeasurement />
      
      <ProgressStats />
      
      <ProgressGraphs />
      
      <ProgressPhotos />
    </div>
  );
}
