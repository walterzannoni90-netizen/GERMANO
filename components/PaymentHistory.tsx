"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserOrders } from "@/lib/firebase-firestore";
import { useAuth } from "@/contexts/AuthContext";

export function PaymentHistory() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getUserOrders(user.uid);
        setPayments(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) return null;

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Storico pagamenti</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-800" />
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-neutral-800 rounded" />
                    <div className="h-3 w-24 bg-neutral-800 rounded" />
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="h-4 w-16 bg-neutral-800 rounded" />
                  <div className="h-3 w-20 bg-neutral-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : payments.length === 0 ? (
          <p className="text-center text-neutral-500 py-10">Nessun pagamento effettuato.</p>
        ) : (
          <div className="space-y-4">
            {payments.map((payment: any) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-xl">
                    💳
                  </div>
                  <div>
                    <p className="font-semibold text-white">{payment.items?.[0]?.name || payment.description || "Ordine"}</p>
                    <p className="text-xs text-neutral-400">
                      {payment.id} • {payment.createdAt?.toDate?.()?.toLocaleDateString() || ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">€{(payment.total || 0).toFixed(2)}</p>
                  <p className={`text-xs ${payment.status === "completed" ? "text-green-500" : "text-orange-500"}`}>
                    {payment.status === "completed" ? "Completato" : payment.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 text-center">
          <button className="text-green-500 hover:text-green-400 text-sm font-medium" onClick={() => alert("Funzionalità di download ricevute in arrivo.")}>
            Scarica tutte le ricevute
          </button>
        </div>
      </CardContent>
    </Card>
  );
}