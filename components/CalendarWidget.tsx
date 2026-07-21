"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getConsultations } from "@/lib/firebase-firestore";

const days = ["L", "M", "M", "G", "V", "S", "D"];

export function CalendarWidget() {
  const [availableDates, setAvailableDates] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  useEffect(() => {
    (async () => {
      try {
        const data = await getConsultations();
        const available = new Set<number>();
        data
          .filter((c: any) => c.status === "available")
          .forEach((c: any) => {
            if (c.date) {
              const d = new Date(c.date);
              if (d.getMonth() === now.getMonth()) available.add(d.getDate());
            }
          });
        setAvailableDates(available);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Calendario disponibilità</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4 text-center">
          {days.map((day, index) => (
            <div key={index} className="text-xs font-medium text-neutral-400 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {[...Array(daysInMonth)].map((_, index) => {
            const day = index + 1;
            const isToday = day === currentDay;
            const isPast = day < currentDay;
            const hasAvailability = availableDates.has(day);
            
            return (
              <button
                key={day}
                disabled={isPast}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-sm transition-all
                  ${isToday ? "bg-green-500 text-white font-bold" : ""}
                  ${isPast ? "text-neutral-600 cursor-not-allowed" : "text-neutral-300 hover:bg-neutral-800"}
                  ${hasAvailability && !isPast && !isToday ? "border border-green-500/50 hover:border-green-500" : ""}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-semibold text-white">Fasce orarie disponibili</h4>
          
          {["09:00", "10:30", "14:00", "16:00", "17:30"].map((time, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/50">
              <span className="text-sm text-white font-medium">{time}</span>
              <Button size="sm" variant="secondary" className="text-xs rounded-full">
                Seleziona
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}