"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getConsultations } from "@/lib/firebase-firestore";
import { useAuth } from "@/contexts/AuthContext";

export function UpcomingSessions() {
  const router = useRouter();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getConsultations();
        const upcoming = data
          .filter((c: any) => c.clientId === user.uid && (c.status === "booked" || c.status === "available"))
          .slice(0, 3);
        setSessions(upcoming);
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
        <CardTitle className="text-xl text-white">Prossimi appuntamenti</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-16 h-16 rounded-lg bg-neutral-800" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-32 bg-neutral-800 rounded" />
                <div className="h-3 w-24 bg-neutral-800 rounded" />
              </div>
            </div>
          ))
        ) : sessions.length === 0 ? (
          <p className="text-center text-neutral-500 py-8">Nessun appuntamento imminente.</p>
        ) : (
          sessions.map((session: any, index: number) => (
            <div key={session.id || index} className="flex gap-3 p-3 rounded-xl hover:bg-neutral-800/50 transition-colors cursor-pointer" onClick={() => router.push("/consultations")}>
              <img
                src={session.image || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop"}
                alt={session.title || session.professionalName || "Appuntamento"}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-white text-sm">{session.title || session.professionalName || "Consulenza"}</h4>
                <p className="text-xs text-neutral-400 mb-1">{session.professionalName || session.specialty}</p>
                <div className="flex items-center gap-2 text-xs text-purple-500">
                  <span>{session.date ? new Date(session.date).toLocaleDateString("it-IT") : ""}</span>
                  {session.time && <><span>•</span><span>{session.time}</span></>}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}