"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, Lock, CheckCircle, Target, Utensils } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkoutPrograms, getUserPurchases, addUserPurchase, createOrder, type WorkoutProgram } from "@/lib/firebase-firestore";

const IMAGE_FALLBACK = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070&auto=format&fit=crop";

export default function NutritionPage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [purchased, setPurchased] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const all = await getWorkoutPrograms();
        setPrograms(all.filter(p => p.active !== false && p.type === "nutrition"));
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
    if (purchasingId) return;
    const p = programs.find(pr => pr.id === programId);
    if (!p) return;
    setPurchasingId(programId);
    try {
      await addUserPurchase(user.uid, programId);
      await createOrder({
        userId: user.uid,
        userName: `${userData.name} ${userData.surname}`,
        items: [{ type: "nutrition", name: p.title, price: p.price }],
        total: p.price,
        status: "completed",
        paymentMethod: "simulato",
      });
      setPurchased(prev => [...prev, programId]);
    } catch (e) {
      console.error(e);
    } finally {
      setPurchasingId(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
          <Card key={i} className="bg-neutral-900/50 border-neutral-800 animate-pulse">
            <div className="h-48 bg-neutral-800" />
            <CardHeader><div className="h-6 w-32 bg-neutral-800 rounded" /></CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Piani Alimentari</h1>
        <p className="text-neutral-400">Piani alimentari personalizzati creati da Germano Poleselli. &euro;40 l&apos;uno.</p>
      </div>

      {programs.length === 0 ? (
        <Card className="bg-neutral-900/50 border-neutral-800">
          <CardContent className="flex flex-col items-center py-16 text-neutral-500">
            <Utensils className="h-16 w-16 mb-4 text-neutral-600" />
            <p className="text-xl mb-2">Nessun piano alimentare disponibile</p>
            <p className="text-sm">Torna presto, nuovi piani in arrivo!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map(program => {
            const isAdmin = userData?.role === "admin";
            const isPurchased = isAdmin || purchased.includes(program.id!);
            return (
              <Card key={program.id} className="group overflow-hidden hover:border-green-500/50 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img src={program.image || IMAGE_FALLBACK} alt={program.title} className="h-full w-full object-cover" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge variant="warning">Alimentazione</Badge>
                    <Badge variant="neutral">{program.level}</Badge>
                  </div>
                  {isPurchased && <div className="absolute top-3 left-3"><Badge variant="success">Acquistato</Badge></div>}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-white mb-1">{program.title}</CardTitle>
                  <p className="text-sm text-neutral-400">{program.subtitle}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 text-sm text-neutral-400 mb-4">
                    <span className="flex items-center gap-1"><Target className="h-4 w-4 text-green-500" />{program.target || "Tutti"}</span>
                  </div>
                  <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{program.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">
                      {isPurchased ? "✓ Acquistato" : `€${(program.price || 40).toFixed(2)}`}
                    </span>
                    {isPurchased ? (
                      <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full" onClick={() => router.push(`/trainings/detail?id=${program.id}`)}>
                        Vedi piano
                      </Button>
                    ) : (
                      <Button className="bg-neutral-700 text-neutral-400 rounded-full cursor-not-allowed" disabled>
                        {!user ? "Accedi" : "Stripe in arrivo"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}