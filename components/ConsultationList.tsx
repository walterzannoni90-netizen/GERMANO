"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { getConsultations, Consultation } from "@/lib/firebase-firestore";

export function ConsultationList() {
  const [consultants, setConsultants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getConsultations();
        const available = data.filter((c: any) => c.status === "available");
        const grouped = available.reduce((acc: any, curr: any) => {
          const key = curr.professionalName || curr.professionalId;
          if (!acc[key]) {
            acc[key] = {
              id: curr.id,
              name: curr.professionalName || "Professionista",
              specialty: curr.specialty || "Fitness",
              experience: "Esperto",
              rating: 4.9,
              reviews: 0,
              image: curr.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
            };
          }
          acc[key].reviews += 1;
          return acc;
        }, {});
        setConsultants(Object.values(grouped));
      } catch (e) {
        console.error("Error loading consultations:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-neutral-900/50 border-neutral-800 animate-pulse">
            <div className="flex items-start gap-4 p-6">
              <div className="w-16 h-16 rounded-full bg-neutral-800" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-40 bg-neutral-800 rounded" />
                <div className="h-4 w-24 bg-neutral-800 rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {consultants.map((consultant: any) => (
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
      {consultants.length === 0 && (
        <div className="text-center py-20 text-neutral-500">
          Nessuna consulenza disponibile al momento.
        </div>
      )}
    </div>
  );
}