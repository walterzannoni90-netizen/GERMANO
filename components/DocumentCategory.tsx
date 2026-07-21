"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getUserDocuments } from "@/lib/firebase-firestore";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  { name: "Tutti i documenti", icon: "📁", key: "all" },
  { name: "Programmi allenamento", icon: "💪", key: "program" },
  { name: "Referti medici", icon: "🩺", key: "medical" },
  { name: "Ricevute", icon: "💳", key: "receipt" },
  { name: "Consensi", icon: "📝", key: "consent" },
  { name: "Certificati", icon: "📜", key: "certificate" },
];

export function DocumentCategory() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getUserDocuments(user.uid);
        const total = data.length;
        const byCategory: Record<string, number> = { all: total };
        data.forEach((d: any) => {
          const cat = d.category || "other";
          byCategory[cat] = (byCategory[cat] || 0) + 1;
        });
        setCounts(byCategory);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [user]);

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold text-white mb-4">Categorie</h2>
      {categories.map((category) => (
        <Button
          key={category.name}
          variant="secondary"
          className="w-full justify-between rounded-xl hover:bg-neutral-800 text-left"
        >
          <div className="flex items-center gap-3">
            <span>{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </div>
          <span className="bg-neutral-700 text-white text-xs px-2 py-1 rounded-full">
            {counts[category.key] || 0}
          </span>
        </Button>
      ))}
    </div>
  );
}