"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserMeasurements } from "@/lib/firebase-firestore";
import { useAuth } from "@/contexts/AuthContext";

export function ProgressGraphs() {
  const { user } = useAuth();
  const [weeks, setWeeks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getUserMeasurements(user.uid);
        const weightData = data
          .filter((m: any) => m.type === "weight")
          .slice(0, 4)
          .reverse();
        const measurementData = data
          .filter((m: any) => m.type === "waist")
          .slice(0, 4)
          .reverse();

        if (weightData.length === 0 && measurementData.length === 0) {
          setWeeks([]);
        } else {
          const maxLen = Math.max(weightData.length, measurementData.length);
          const combined = Array.from({ length: maxLen }, (_, i) => ({
            week: `Settimana ${i + 1}`,
            weight: weightData[i]?.value || 0,
            measurement: measurementData[i]?.value || 0,
          }));
          setWeeks(combined);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Andamento pesi e misure</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-24 bg-neutral-800 rounded" />
                <div className="flex-1 h-2 bg-neutral-800 rounded-full" />
                <div className="h-4 w-16 bg-neutral-800 rounded" />
              </div>
            ))}
          </div>
        ) : weeks.length === 0 ? (
          <p className="text-center text-neutral-500 py-10">
            Nessun dato disponibile. Inizia a registrare le tue misurazioni!
          </p>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Peso corporeo (kg)</h4>
                {weeks[0]?.weight > weeks[weeks.length - 1]?.weight ? (
                  <span className="text-sm text-green-500">Trend positivo! 👍</span>
                ) : (
                  <span className="text-sm text-blue-500">In evoluzione</span>
                )}
              </div>
              <div className="space-y-3">
                {weeks.map((week, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm text-neutral-400 w-24">{week.week}</span>
                    <div className="flex-1 relative h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-green-500 rounded-full"
                        style={{ width: `${Math.min((week.weight / 85) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white w-16 text-right">{week.weight}kg</span>
                  </div>
                ))}
              </div>
            </div>

            {weeks.some((w) => w.measurement > 0) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">Misure vita (cm)</h4>
                  {weeks[0]?.measurement > weeks[weeks.length - 1]?.measurement ? (
                    <span className="text-sm text-green-500">In riduzione!</span>
                  ) : (
                    <span className="text-sm text-blue-500">In evoluzione</span>
                  )}
                </div>
                <div className="space-y-3">
                  {weeks.map((week, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-sm text-neutral-400 w-24">{week.week}</span>
                      <div className="flex-1 relative h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className="absolute left-0 top-0 h-full bg-blue-500 rounded-full"
                          style={{ width: `${Math.min((week.measurement / 110) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-white w-16 text-right">{week.measurement}cm</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1 rounded-full">
                Visualizza grafico completo
              </Button>
              <Button variant="outline" className="border-neutral-600 text-white hover:bg-neutral-800 rounded-full">
                Esporta dati
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}