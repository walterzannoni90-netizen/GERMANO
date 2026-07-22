"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLatestMeasurements } from "@/lib/firebase-firestore";
import { useAuth } from "@/contexts/AuthContext";

const labels: Record<string, { title: string; icon: string; color: string; goal: number; unit: string }> = {
  weight: { title: "Peso corporeo", icon: "⚖️", color: "text-blue-500", goal: 75, unit: "kg" },
  bodyFat: { title: "Grasso corporeo", icon: "📊", color: "text-red-500", goal: 15, unit: "%" },
  arm: { title: "Misure braccia", icon: "📏", color: "text-purple-500", goal: 35, unit: "cm" },
  waist: { title: "Misure vita", icon: "📏", color: "text-orange-500", goal: 78, unit: "cm" },
  thigh: { title: "Misure cosce", icon: "📏", color: "text-purple-500", goal: 50, unit: "cm" },
  steps: { title: "Passi giornalieri", icon: "👣", color: "text-pink-500", goal: 10000, unit: "" },
};

export function ProgressStats() {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getLatestMeasurements(user.uid);
        const grouped: Record<string, any> = {};
        data.forEach((m: any) => {
          if (!grouped[m.type]) grouped[m.type] = m;
        });
        setMeasurements(grouped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) return null;

  const statEntries = Object.entries(labels).map(([key, label]) => {
    const m = measurements[key];
    const currentVal = m?.value || 0;
    const goalVal = label.goal;
    return {
      ...label,
      key,
      value: currentVal ? `${currentVal}${label.unit}` : "—",
      goal: `${goalVal}${label.unit}`,
      progress: goalVal > 0 ? Math.min(Math.round((currentVal / goalVal) * 100), 100) : 0,
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statEntries.map((stat, index) => (
        <Card key={index} className="bg-neutral-900/50 border-neutral-800 hover:border-purple-500/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">{stat.title}</CardTitle>
            <span className={`text-xl ${stat.color}`}>{stat.icon}</span>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mb-2">
              <div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-neutral-500">Obiettivo: {stat.goal}</div>
              </div>
            </div>
            <Progress value={stat.progress} className="h-2 bg-neutral-800" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}