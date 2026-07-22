"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTrainings, Training } from "@/lib/firebase-firestore";

export function FeaturedTrainings() {
  const router = useRouter();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTrainings();
        setTrainings(data.filter((t: any) => t.active !== false).slice(0, 3) as Training[]);
      } catch (e) {
        console.error("Error loading trainings:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-white">Allenamenti in evidenza</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-neutral-900/50 border-neutral-800 animate-pulse">
              <div className="h-48 bg-neutral-800" />
              <CardHeader><div className="h-6 w-32 bg-neutral-800 rounded" /></CardHeader>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="trainings" className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Allenamenti in evidenza</h2>
        <Link href="/trainings">
          <Button variant="link" className="text-purple-500">
            Vedi tutti
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((training, index) => (
          <Card key={training.id || index} className="group overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
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
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-white mb-2">{training.title}</CardTitle>
                  <p className="text-sm text-neutral-400">by {training.trainer}</p>
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
                <span className="flex items-center gap-1 text-purple-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  {training.rating || "4.8"}
                </span>
              </div>
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white" onClick={() => router.push("/trainings")}>
                Guarda ora
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}