import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const trainings = [
  { id: 1, title: "Full Body HIIT", trainer: "Mario Rossi", duration: "45 min", level: "Intermedio", price: "€19.99", rating: 4.8, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" },
  { id: 2, title: "Yoga per Principianti", trainer: "Giulia Bianchi", duration: "30 min", level: "Principiante", price: "€14.99", rating: 4.9, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop" },
  { id: 3, title: "Strongman Foundation", trainer: "Luca Verdi", duration: "60 min", level: "Avanzato", price: "€24.99", rating: 4.7, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" },
  { id: 4, title: "Abs & Core Blast", trainer: "Sofia Romano", duration: "25 min", level: "Intermedio", price: "€17.99", rating: 4.6, image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2070&auto=format&fit=crop" },
  { id: 5, title: "Cardio Dance Fitness", trainer: "Marco Palermo", duration: "40 min", level: "Principiante", price: "€16.99", rating: 4.8, image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2070&auto=format&fit=crop" },
  { id: 6, title: "Total Body Conditioning", trainer: "Elena Torino", duration: "50 min", level: "Intermedio", price: "€18.99", rating: 4.9, image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2070&auto=format&fit=crop" },
];

export function TrainingList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trainings.map((training) => (
        <Card key={training.id} className="group overflow-hidden hover:border-green-500/50 transition-all duration-300">
          <div className="relative h-48 overflow-hidden">
            <img
              src={training.image}
              alt={training.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3">
              <Badge variant="neutral">{training.level}</Badge>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="text-xl text-white mb-2">{training.title}</CardTitle>
            <div className="flex justify-between items-center text-sm text-neutral-400">
              <span>by {training.trainer}</span>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={14} fill="currentColor" />
                {training.rating}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-neutral-400 mb-4">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {training.duration}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-white">{training.price}</span>
              <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full">
                Acquista ora
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
