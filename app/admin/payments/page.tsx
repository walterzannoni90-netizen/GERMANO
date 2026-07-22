"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOrders, updateOrder } from "@/lib/firebase-firestore";

interface OrderItem {
  id: string;
  userName?: string;
  items?: { name: string; price: number }[];
  total?: number;
  status?: string;
  paymentMethod?: string;
  createdAt?: any;
}

export default function AdminPayments() {
  const [orders, setOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    getOrders().then((data) => setOrders(data as OrderItem[]));
  }, []);

  const toggleStatus = async (o: OrderItem) => {
    const newStatus = o.status === "completed" ? "refunded" : "completed";
    await updateOrder(o.id, { status: newStatus } as any);
    setOrders((prev) =>
      prev.map((x) => (x.id === o.id ? { ...x, status: newStatus } : x))
    );
  };

  const statusColors: Record<string, "success" | "warning" | "danger" | "neutral"> = {
    pending: "warning",
    completed: "success",
    refunded: "danger",
    cancelled: "neutral",
  };

  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Pagamenti</h1>
          <p className="text-neutral-400 mt-1">Monitora ordini e transazioni.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-neutral-400">Fatturato totale</p>
          <p className="text-2xl font-bold text-purple-500">€{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Cliente</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Articoli</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Metodo</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Totale</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Stato</th>
                  <th className="text-right p-4 text-sm font-medium text-neutral-400">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                    <td className="p-4 font-medium text-white">{o.userName}</td>
                    <td className="p-4 text-sm text-neutral-400">
                      {o.items?.map((i) => i.name).join(", ") || "—"}
                    </td>
                    <td className="p-4 text-sm text-neutral-400">{o.paymentMethod || "Stripe"}</td>
                    <td className="p-4 font-semibold text-white">€{o.total?.toFixed(2)}</td>
                    <td className="p-4">
                      <Badge variant={statusColors[o.status || "pending"] as any}>{o.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => toggleStatus(o)}>
                        {o.status === "completed" ? "Rimborsa" : "Completa"}
                      </Button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-500">
                      Nessun ordine trovato.
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
