"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, Dumbbell } from "lucide-react";
import { useRouter } from "next/navigation";
import { getWorkoutPrograms, deleteWorkoutProgram, updateWorkoutProgram, type WorkoutProgram } from "@/lib/firebase-firestore";

export default function AdminPrograms() {
  const router = useRouter();
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);

  useEffect(() => {
    getWorkoutPrograms().then(setPrograms);
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Eliminare questo programma?")) {
      await deleteWorkoutProgram(id);
      setPrograms(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleActive = async (p: WorkoutProgram) => {
    await updateWorkoutProgram(p.id!, { active: !p.active });
    setPrograms(prev => prev.map(x => x.id === p.id ? { ...x, active: !x.active } : x));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Programmi / Schede</h1>
        <p className="text-neutral-400 mt-1">Gestisci le schede di allenamento complete.</p>
      </div>

      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Titolo</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Target</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Livello</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Obiettivo</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Giorni</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Prezzo</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Stato</th>
                  <th className="text-right p-4 text-sm font-medium text-neutral-400">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {programs.map(p => (
                  <tr key={p.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                    <td className="p-4">
                      <p className="font-medium text-white">{p.title}</p>
                      <p className="text-xs text-neutral-500">{p.subtitle}</p>
                    </td>
                    <td className="p-4 text-sm text-neutral-400">{p.target}</td>
                    <td className="p-4"><Badge variant="neutral">{p.level}</Badge></td>
                    <td className="p-4 text-sm text-neutral-400">{p.goal}</td>
                    <td className="p-4 text-sm text-neutral-400">{p.days?.length || 0}</td>
                    <td className="p-4 text-sm font-semibold text-white">€{p.price?.toFixed(2)}</td>
                    <td className="p-4">
                      <Badge variant={p.active !== false ? "success" : "danger"}>
                        {p.active !== false ? "Attivo" : "Nascosto"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/trainings/detail?id=${p.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toggleActive(p)}>
                          {p.active !== false ? "Nascondi" : "Mostra"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id!)} className="text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {programs.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-neutral-500">
                      <Dumbbell className="h-8 w-8 mx-auto mb-2 text-neutral-600" />
                      Nessun programma trovato.
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