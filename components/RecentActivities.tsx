"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserActivities } from "@/lib/firebase-firestore";
import { useAuth } from "@/contexts/AuthContext";

const iconMap: Record<string, string> = {
  workout: "🏆",
  measurement: "⚖️",
  consultation: "📅",
  message: "💬",
  payment: "💳",
  achievement: "⭐",
};

const colorMap: Record<string, string> = {
  workout: "text-purple-500",
  measurement: "text-blue-500",
  consultation: "text-orange-500",
  message: "text-purple-500",
  payment: "text-pink-500",
  achievement: "text-yellow-500",
};

export function RecentActivities() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getUserActivities(user.uid);
        setActivities(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) return null;

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Attività recenti</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 p-3 animate-pulse">
              <div className="w-8 h-8 bg-neutral-800 rounded" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-32 bg-neutral-800 rounded" />
                <div className="h-3 w-48 bg-neutral-800 rounded" />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <p className="text-center text-neutral-500 py-8">Nessuna attività recente.</p>
        ) : (
          activities.map((activity: any, index: number) => (
            <div key={activity.id || index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-neutral-800/50 transition-colors">
              <div className={`text-2xl ${colorMap[activity.type] || "text-neutral-400"}`}>
                {iconMap[activity.type] || "📌"}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">{activity.title}</h4>
                <p className="text-sm text-neutral-400">{activity.description}</p>
              </div>
              <span className="text-xs text-neutral-500 whitespace-nowrap">
                {activity.createdAt?.toDate?.()?.toLocaleDateString?.() || ""}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}