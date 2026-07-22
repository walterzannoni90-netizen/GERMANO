"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Target, MapPin, Dumbbell, CheckCircle, Lock, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkoutProgram, hasUserPurchased, addUserPurchase, createOrder, type WorkoutProgram, type WorkoutDay } from "@/lib/firebase-firestore";

const IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop";

function DetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const { user, userData } = useAuth();
  const [program, setProgram] = useState<WorkoutProgram | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [day, setDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) { setLoading(false); return; }
      try {
        const p = await getWorkoutProgram(id);
        setProgram(p);
        const admin = userData?.role === "admin";
        if (admin) { setIsPurchased(true); }
        else if (user && p) {
          const purchased = await hasUserPurchased(user.uid, p.id!);
          setIsPurchased(purchased);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user, userData]);

  const handlePurchase = async () => {
    if (!user || !program || !userData) return;
    setPurchasing(true);
    try {
      await addUserPurchase(user.uid, program.id!);
      await createOrder({
        userId: user.uid,
        userName: `${userData.name} ${userData.surname}`,
        items: [{ type: "training", name: program.title, price: program.price }],
        total: program.price,
        status: "completed",
        paymentMethod: "simulato",
      });
      setIsPurchased(true);
    } catch (e) {
      console.error(e);
    } finally {
      setPurchasing(false);
    }
  };

  if (!id) {
    return (
      <div className="text-center py-20 text-neutral-500">
        <Dumbbell className="h-16 w-16 mx-auto mb-4 text-neutral-600" />
        <p className="text-xl">Nessun programma specificato</p>
        <Button onClick={() => router.push("/trainings")} className="mt-4 rounded-full bg-purple-500 hover:bg-purple-600">
          Torna al catalogo
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="text-center py-20 text-neutral-500">
        <Dumbbell className="h-16 w-16 mx-auto mb-4 text-neutral-600" />
        <p className="text-xl">Programma non trovato</p>
        <Button onClick={() => router.push("/trainings")} className="mt-4 rounded-full bg-purple-500 hover:bg-purple-600">
          Torna al catalogo
        </Button>
      </div>
    );
  }

  const days: WorkoutDay[] = program.days?.sort((a, b) => a.dayNumber - b.dayNumber) || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Indietro
      </button>

      <div className="relative h-64 rounded-2xl overflow-hidden">
        <img
          src={program.image || IMAGE_FALLBACK}
          alt={program.title}
          onError={(e) => {
            if (e.currentTarget.src !== IMAGE_FALLBACK) e.currentTarget.src = IMAGE_FALLBACK;
          }}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <div className="flex gap-2 mb-3">
            <Badge variant="neutral">{program.level}</Badge>
            <Badge variant={program.location === "casa" ? "warning" : "success"}>
              {program.location === "casa" ? "Casa" : "Palestra"}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-white">{program.title}</h1>
          <p className="text-neutral-300 mt-1">{program.subtitle}</p>
        </div>
        {!isPurchased && (
          <div className="absolute top-4 right-4">
            <Lock className="h-6 w-6 text-white/60" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800 text-neutral-300">
          <Target className="h-4 w-4 text-purple-500" /> {program.goal}
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800 text-neutral-300">
          <Clock className="h-4 w-4 text-purple-500" /> {program.sessionsPerWeek}gg/sett · {program.totalWeeks} settimane
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800 text-neutral-300">
          <MapPin className="h-4 w-4 text-purple-500" /> {program.target}
        </div>
      </div>

      <p className="text-neutral-400">{program.description}</p>

      {!isPurchased ? (
        <Card className="bg-neutral-900/50 border-purple-500/30">
          <CardContent className="p-8 text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-neutral-500" />
            <h2 className="text-2xl font-bold text-white mb-2">Contenuto Bloccato</h2>
            <p className="text-neutral-400 mb-6">Acquista questo programma per visualizzare la scheda completa con tutti gli esercizi giorno per giorno.</p>
            <div className="text-3xl font-bold text-white mb-6">€{program.price.toFixed(2)}</div>
            <Button
              disabled
              className="bg-neutral-700 text-neutral-400 rounded-full px-8 py-6 text-lg cursor-not-allowed"
            >
              {!user ? "Accedi per acquistare" : "Stripe in arrivo"}
            </Button>
            {!user && (
              <div className="mt-4 flex gap-2 justify-center">
                <Button variant="outline" onClick={() => router.push("/login")} className="rounded-full">Accedi</Button>
                <Button variant="outline" onClick={() => router.push("/register")} className="rounded-full">Registrati</Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <CheckCircle className="h-6 w-6 text-purple-500" />
            <span className="text-purple-500 font-semibold">Programma acquistato · {days.length} giorni</span>
            {program.pdfData && (
              <a
                href={program.pdfData}
                download={program.pdfName || "scheda-allenamento.pdf"}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-all text-sm font-medium"
              >
                <FileText className="h-4 w-4" />
                Scarica PDF {program.pdfName ? `(${program.pdfName})` : ""}
              </a>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map((d) => (
              <button
                key={d.dayNumber}
                onClick={() => setDay(d.dayNumber - 1)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  day === d.dayNumber - 1
                    ? "bg-purple-500 text-black"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                Giorno {d.dayNumber}{d.name ? ` - ${d.name}` : ""}
              </button>
            ))}
          </div>

          {days.length > 0 && days[day] && (
            <Card className="bg-neutral-900/50 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Giorno {days[day].dayNumber}{days[day].name ? `: ${days[day].name}` : ""}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-800 text-left text-sm text-neutral-400">
                        <th className="pb-3 pr-4">Esercizio</th>
                        <th className="pb-3 pr-4">Gruppo</th>
                        <th className="pb-3 pr-4">Serie</th>
                        <th className="pb-3 pr-4">Reps</th>
                        <th className="pb-3 pr-4">Rec.</th>
                        <th className="pb-3">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {days[day].exercises.map((ex, i) => (
                        <tr key={i} className="border-b border-neutral-800/50 text-sm hover:bg-neutral-800/30 transition-colors">
                          <td className="py-3 pr-4 font-medium text-white">{ex.name}</td>
                          <td className="py-3 pr-4 text-neutral-400">{ex.muscleGroup}</td>
                          <td className="py-3 pr-4 text-neutral-300">{ex.sets}</td>
                          <td className="py-3 pr-4 text-neutral-300">{ex.reps}</td>
                          <td className="py-3 pr-4 text-neutral-400">{ex.rest}</td>
                          <td className="py-3 text-neutral-500 text-xs max-w-[200px]">{ex.notes || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export default function TrainingDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    }>
      <DetailContent />
    </Suspense>
  );
}