import { ConsultationList } from "@/components/ConsultationList";
import { CalendarWidget } from "@/components/CalendarWidget";

export default function ConsultationsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Prenota una Consulenza</h1>
          <p className="text-neutral-400">Scegli il professionista giusto per te.</p>
        </div>
        
        <ConsultationList />
      </div>
      
      <div className="lg:col-span-1">
        <CalendarWidget />
      </div>
    </div>
  );
}
