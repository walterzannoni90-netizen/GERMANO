"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLatestMeasurements, getUserWorkoutLogs } from "@/lib/firebase-firestore";
import { useAuth } from "@/contexts/AuthContext";
import { getUserData } from "@/lib/firebase-auth";

export function ProgressOverview() {
  const { user, userData } = useAuth();
  const [weight, setWeight] = useState<number>(0);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(7);
  const [steps, setSteps] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [measurements, logs] = await Promise.all([
          getLatestMeasurements(user.uid),
          getUserWorkoutLogs(user.uid),
        ]);

        const w = measurements.find((m: any) => m.type === "weight");
        if (w) setWeight(w.value);

        const s = measurements.find((m: any) => m.type === "steps");
        if (s) setSteps(s.value);

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentLogs = logs.filter((l: any) => l.completedAt?.toDate?.() > weekAgo);
        setCompleted(recentLogs.length);
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
        <CardTitle className="text-xl text-white">Progresso settimanale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-neutral-400">Peso corporeo</span>
            <span className="text-sm font-semibold text-white">{weight ? `${weight}kg` : "—"}</span>
          </div>
          <Progress value={weight ? Math.min((weight / 85) * 100, 100) : 0} className="h-2 bg-neutral-800" />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-neutral-400">Allenamenti completati</span>
            <span className="text-sm font-semibold text-white">{completed}/{total} ({(completed/total*100).toFixed(0)}%)</span>
          </div>
          <Progress value={(completed/total)*100} className="h-2 bg-green-500" />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-neutral-400">Passi giornalieri</span>
            <span className="text-sm font-semibold text-white">{steps?.toLocaleString() || "0"}/10,000</span>
          </div>
          <Progress value={Math.min((steps/10000)*100, 100)} className="h-2 bg-blue-500" />
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-3 rounded-xl bg-green-500/10">
            <div className="text-2xl font-bold text-green-500">{userData?.points || 0}</div>
            <div className="text-xs text-neutral-400">Punti</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-orange-500/10">
            <div className="text-2xl font-bold text-orange-500">{userData?.level || 1}</div>
            <div className="text-xs text-neutral-400">Livello</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-purple-500/10">
            <div className="text-2xl font-bold text-purple-500">{completed}</div>
            <div className="text-xs text-neutral-400">Allenamenti</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}