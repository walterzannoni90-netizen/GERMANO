import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const consultants = [
  { id: 1, name: "Dr. Mario Rossi", specialty: "Personal Trainer", experience: "10 anni", rating: 4.9, reviews: 128, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80" },
  { id: 2, name: "Giulia Bianchi", specialty: "Yoga & Pilates", experience: "8 anni", rating: 4.8, reviews: 96, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80" },
  { id: 3, name: "Dr. Luca Verdi", specialty: "Nutrizione", experience: "12 anni", rating: 5.0, reviews: 156, image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=80" },
  { id: 4, name: "Sofia Romano", specialty: "Fitness per Donne", experience: "6 anni", rating: 4.7, reviews: 84, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80" },
];

export function ConsultationList() {
  return (
    <div className="space-y-4">
      {consultants.map((consultant) => (
        <Card key={consultant.id} className="bg-neutral-900/50 border-neutral-800 hover:border-green-500/50 transition-all">
          <div className="flex items-start gap-4 p-6">
            <img
              src={consultant.image}
              alt={consultant.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <CardTitle className="text-xl text-white mb-2">{consultant.name}</CardTitle>
              <p className="text-green-500 font-medium mb-2">{consultant.specialty}</p>
              <div className="flex items-center gap-4 text-sm text-neutral-400 mb-4">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {consultant.experience}
                </span>
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  {consultant.rating}
                  <span className="text-neutral-500">({consultant.reviews} recensioni)</span>
                </span>
              </div>
              <div className="flex gap-3">
                <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full">
                  Prenota consulenza
                </Button>
                <Button variant="outline" className="border-neutral-600 text-white hover:bg-neutral-800 rounded-full">
                  Vedi profilo
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
