"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Dumbbell, CreditCard, TrendingUp } from "lucide-react";
import { getDashboardStats } from "@/lib/firebase-firestore";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalTrainings: 0, totalOrders: 0, totalRevenue: 0 });

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  const cards = [
    { title: "Utenti totali", value: stats.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Allenamenti", value: stats.totalTrainings, icon: Dumbbell, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Ordini totali", value: stats.totalOrders, icon: CreditCard, color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Fatturato", value: `€${stats.totalRevenue.toFixed(2)}`, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
        <p className="text-neutral-400 mt-1">Panoramica della piattaforma Germano.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} className="bg-neutral-900/50 border-neutral-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">{card.title}</CardTitle>
                <div className={`h-10 w-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-neutral-900/50 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Attività recenti</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-400 text-sm">Connetti Firebase per visualizzare le attività in tempo reale.</p>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900/50 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Accessi rapidi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a href="/admin/users" className="block p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-all">
              <p className="font-semibold text-white">Gestisci utenti</p>
              <p className="text-sm text-neutral-400">Visualizza, modifica e gestisci gli account</p>
            </a>
            <a href="/admin/trainings" className="block p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-all">
              <p className="font-semibold text-white">Gestisci allenamenti</p>
              <p className="text-sm text-neutral-400">Aggiungi e modifica i programmi fitness</p>
            </a>
            <a href="/admin/payments" className="block p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-all">
              <p className="font-semibold text-white">Vedi pagamenti</p>
              <p className="text-sm text-neutral-400">Monitora ordini e transazioni</p>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
