"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock } from "lucide-react";
import {
  getConsultations,
  updateConsultation,
} from "@/lib/firebase-firestore";

interface ConsultationItem {
  id: string;
  professionalName?: string;
  clientName?: string;
  specialty?: string;
  date?: string;
  time?: string;
  status?: string;
  type?: string;
  price?: number;
}

export default function AdminConsultations() {
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);

  useEffect(() => {
    getConsultations().then((data) => setConsultations(data as ConsultationItem[]));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateConsultation(id, { status } as any);
    setConsultations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const statusColors: Record<string, "success" | "warning" | "danger" | "neutral"> = {
    available: "success",
    booked: "warning",
    completed: "neutral",
    cancelled: "danger",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Consulenze</h1>
        <p className="text-neutral-400 mt-1">Gestisci le prenotazioni delle consulenze.</p>
      </div>

      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Professionista</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Cliente</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Specialità</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Data</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Ora</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Stato</th>
                  <th className="text-right p-4 text-sm font-medium text-neutral-400">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((c) => (
                  <tr key={c.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                    <td className="p-4 font-medium text-white">{c.professionalName || "—"}</td>
                    <td className="p-4 text-sm text-neutral-400">{c.clientName || "Non prenotato"}</td>
                    <td className="p-4 text-sm text-neutral-400">{c.specialty}</td>
                    <td className="p-4 text-sm text-neutral-400">{c.date}</td>
                    <td className="p-4 text-sm text-neutral-400">{c.time}</td>
                    <td className="p-4">
                      <Badge variant={statusColors[c.status || "available"] as any}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {c.status === "booked" && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => updateStatus(c.id, "completed")} className="text-purple-400">
                              <Check className="h-4 w-4 mr-1" /> Completa
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => updateStatus(c.id, "cancelled")} className="text-red-400">
                              <X className="h-4 w-4 mr-1" /> Cancella
                            </Button>
                          </>
                        )}
                        {c.status === "available" && (
                          <Button variant="ghost" size="sm" onClick={() => updateStatus(c.id, "cancelled")} className="text-red-400">
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {consultations.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-neutral-500">
                      Nessuna consulenza trovata.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
