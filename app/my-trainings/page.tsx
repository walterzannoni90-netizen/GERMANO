"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Target, MapPin, ChevronRight, Dumbbell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkoutPrograms, getWorkoutProgram, getUserPurchases, type WorkoutProgram } from "@/lib/firebase-firestore";

export default function MyTrainingsPage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [purchased, setPurchased] = useState<string[]>([]);
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user) { setLoading(false); return; }
      try {
        const [allPrograms, purchases] = await Promise.all([
          getWorkoutPrograms(),
          getUserPurchases(user.uid),
        ]);
        setPrograms(allPrograms.filter(p => p.active !== false));
        setPurchased(purchases.map(p => p.trainingId));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const isAdmin = userData?.role === "admin";
  const myPrograms = isAdmin ? programs : programs.filter(p => purchased.includes(p.id!));

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
        <Dumbbell className="h-16 w-16 mb-4 text-neutral-600" />
        <p className="text-xl mb-4">Accedi per vedere i tuoi allenamenti</p>
        <Button onClick={() => router.push("/login")} className="rounded-full bg-green-500 hover:bg-green-600">
          Accedi ora
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">I Miei Allenamenti</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <Card key={i} className="bg-neutral-900/50 border-neutral-800 animate-pulse">
              <div className="h-48 bg-neutral-800" />
              <CardHeader><div className="h-6 w-32 bg-neutral-800 rounded" /></CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (myPrograms.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">I Miei Allenamenti</h1>
        <Card className="bg-neutral-900/50 border-neutral-800">
          <CardContent className="flex flex-col items-center py-16 text-neutral-500">
            <Dumbbell className="h-16 w-16 mb-4 text-neutral-600" />
            <p className="text-xl mb-2">Nessun allenamento acquistato</p>
            <p className="mb-6 text-sm">Acquista il tuo primo programma dal catalogo</p>
            <Button onClick={() => router.push("/trainings")} className="rounded-full bg-green-500 hover:bg-green-600">
              Vedi catalogo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">I Miei Allenamenti</h1>
      <p className="text-neutral-400">
        Hai {myPrograms.length} programma{myPrograms.length > 1 ? "i" : ""} acquistato{myPrograms.length > 1 ? "i" : ""}.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myPrograms.map(program => (
          <Card key={program.id} className="group overflow-hidden hover:border-green-500/50 transition-all duration-300 cursor-pointer" onClick={() => router.push(`/trainings/detail?id=${program.id}`)}>
            <div className="relative h-48 overflow-hidden">
              <img src={program.image} alt={program.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute top-3 right-3 flex gap-2">
                <Badge variant="neutral">{program.level}</Badge>
                <Badge variant="success">{program.sessionsPerWeek}gg/sett</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl text-white">{program.title}</CardTitle>
              <p className="text-sm text-neutral-400">{program.subtitle}</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 text-sm text-neutral-400 mb-4">
                <span className="flex items-center gap-1"><Target className="h-4 w-4 text-green-500" />{program.goal}</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-green-500" />{program.target}</span>
              </div>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full" onClick={(e) => { e.stopPropagation(); router.push(`/trainings/${program.id}`); }}>
                Visualizza scheda <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}