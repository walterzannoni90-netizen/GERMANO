"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { getTrainings, Training } from "@/lib/firebase-firestore";

export function TrainingList() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTrainings();
        setTrainings(data.filter((t: any) => t.active !== false));
      } catch (e) {
        console.error("Error loading trainings:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="bg-neutral-900/50 border-neutral-800 animate-pulse">
            <div className="h-48 bg-neutral-800" />
            <CardHeader><div className="h-6 w-32 bg-neutral-800 rounded" /></CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trainings.map((training) => (
        <Card key={training.id} className="group overflow-hidden hover:border-green-500/50 transition-all duration-300">
          <div className="relative h-48 overflow-hidden">
            <img
              src={training.image || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop"}
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
              <span className="text-xl font-bold text-white">€{(training.price || 0).toFixed(2)}</span>
              <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full">
                Acquista ora
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {trainings.length === 0 && (
        <div className="col-span-full text-center py-20 text-neutral-500">
          Nessun allenamento disponibile al momento.
        </div>
      )}
    </div>
  );
}