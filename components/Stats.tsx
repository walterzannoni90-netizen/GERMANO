"use client";

import { useState, useEffect } from "react";
import { getDashboardStats } from "@/lib/firebase-firestore";

export function Stats() {
  const [stats, setStats] = useState({ totalUsers: 1200, totalTrainings: 500, totalOrders: 2500, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const items = [
    { label: "Clienti Attivi", value: `${(stats.totalUsers > 0 ? stats.totalUsers : 1200).toLocaleString()}+`, icon: "👥" },
    { label: "Allenamenti", value: `${(stats.totalTrainings > 0 ? stats.totalTrainings : 500).toLocaleString()}+`, icon: "💪" },
    { label: "Consulenze", value: `${(stats.totalOrders > 0 ? stats.totalOrders : 2500).toLocaleString()}+`, icon: "📝" },
    { label: "Soddisfazione", value: "4.9/5", icon: "⭐" },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((stat, index) => (
        <div key={index} className="rounded-2xl bg-neutral-800/50 p-6 border border-neutral-700/50 text-center hover:border-green-500/30 transition-all">
          <div className="text-4xl mb-2">{stat.icon}</div>
          <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
          <div className="text-sm text-neutral-400">{stat.label}</div>
        </div>
      ))}
    </section>
  );
}