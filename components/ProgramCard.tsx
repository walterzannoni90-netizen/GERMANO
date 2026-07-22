"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Lock, Eye, Clock, Target, MapPin } from "lucide-react";
import type { WorkoutProgram } from "@/lib/firebase-firestore";

const IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop";

interface Props {
  program: WorkoutProgram;
  isPurchased: boolean;
  onPurchase: (id: string) => void;
  onView: (id: string) => void;
}

export function ProgramCard({ program, isPurchased, onPurchase, onView }: Props) {
  return (
    <Card className="group overflow-hidden hover:border-purple-500/50 transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={program.image || IMAGE_FALLBACK}
          alt={program.title}
          onError={(e) => {
            if (e.currentTarget.src !== IMAGE_FALLBACK) e.currentTarget.src = IMAGE_FALLBACK;
          }}
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
        {!isPurchased && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Lock className="h-8 w-8 text-white/70" />
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl text-white mb-1">{program.title}</CardTitle>
        <p className="text-sm text-neutral-400">{program.subtitle}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400 mb-4">
          <span className="flex items-center gap-1">
            <Target className="h-4 w-4 text-purple-500" />
            {program.goal}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-purple-500" />
            {program.sessionsPerWeek}gg/sett · {program.totalWeeks} sett
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-purple-500" />
            {program.target}
          </span>
        </div>
        <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{program.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-white">
            {isPurchased ? "✓ Acquistato" : `€${(program.price || 0).toFixed(2)}`}
          </span>
          {isPurchased ? (
            <Button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full" onClick={() => onView(program.id!)}>
              <Eye className="h-4 w-4 mr-2" /> Vedi Scheda
            </Button>
          ) : (
            <Button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full" onClick={() => onPurchase(program.id!)}>
              Acquista ora
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}