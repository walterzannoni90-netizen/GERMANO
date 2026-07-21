"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, Lock, CheckCircle, Clock, Target, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkoutPrograms, getUserPurchases, addUserPurchase, createOrder, type WorkoutProgram } from "@/lib/firebase-firestore";

export function ProgramsList() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [purchased, setPurchased] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const all = await getWorkoutPrograms();
        setPrograms(all.filter(p => p.active !== false));
        if (user) {
          const purchases = await getUserPurchases(user.uid);
          setPurchased(purchases.map(p => p.trainingId));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handlePurchase = async (programId: string) => {
    if (!user || !userData) { router.push("/login"); return; }
    const p = programs.find(pr => pr.id === programId);
    if (!p) return;
    try {
      await addUserPurchase(user.uid, programId);
      await createOrder({
        userId: user.uid,
        userName: `${userData.name} ${userData.surname}`,
        items: [{ type: "training", name: p.title, price: p.price }],
        total: p.price,
        status: "completed",
        paymentMethod: "simulato",
      });
      setPurchased(prev => [...prev, programId]);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => (
          <Card key={i} className="bg-neutral-900/50 border-neutral-800 animate-pulse">
            <div className="h-48 bg-neutral-800" />
            <CardHeader><div className="h-6 w-32 bg-neutral-800 rounded" /></CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="text-center py-20 text-neutral-500">
        <Dumbbell className="h-16 w-16 mx-auto mb-4 text-neutral-600" />
        <p>Nessun programma disponibile al momento.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map(program => {
        const isPurchased = purchased.includes(program.id!);
        return (
          <Card key={program.id} className="group overflow-hidden hover:border-green-500/50 transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
              <img
                src={program.image}
                alt={program.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <Badge variant="neutral">{program.level}</Badge>
                <Badge variant={program.location === "casa" ? "warning" : "success"}>
                  {program.location === "casa" ? "Casa" : "Palestra"}
                </Badge>
              </div>
              {isPurchased && (
                <div className="absolute top-3 left-3">
                  <Badge variant="success">Acquistato</Badge>
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-xl text-white mb-1">{program.title}</CardTitle>
              <p className="text-sm text-neutral-400">{program.subtitle}</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400 mb-4">
                <span className="flex items-center gap-1"><Target className="h-4 w-4 text-green-500" />{program.goal}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-green-500" />{program.sessionsPerWeek}gg/sett</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-green-500" />{program.target}</span>
              </div>
              <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{program.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-white">
                  {isPurchased ? "✓ Acquistato" : `€${(program.price || 0).toFixed(2)}`}
                </span>
                {isPurchased ? (
                  <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full" onClick={() => router.push(`/trainings/detail?id=${program.id}`)}>
                    Vedi scheda
                  </Button>
                ) : (
                  <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full" onClick={() => handlePurchase(program.id!)}>
                    {!user ? "Accedi" : "Acquista ora"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}