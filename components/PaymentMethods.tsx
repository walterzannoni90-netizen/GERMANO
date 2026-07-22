"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const paymentMethods = [
  { id: 1, type: "Visa", number: "•••• •••• •••• 4242", expiry: "12/2025", isDefault: true },
  { id: 2, type: "Mastercard", number: "•••• •••• •••• 8899", expiry: "06/2026", isDefault: false },
];

export function PaymentMethods() {
  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Metodi di pagamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`
              p-4 rounded-xl border transition-all
              ${method.isDefault ? "border-green-500 bg-green-500/5" : "border-neutral-700 hover:border-neutral-600"}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-6 bg-neutral-800 rounded flex items-center justify-center text-sm font-bold text-white">
                  {method.type}
                </div>
                <div>
                  <p className="font-semibold text-white">{method.number}</p>
                  <p className="text-xs text-neutral-400">Scade: {method.expiry}</p>
                </div>
              </div>
              {method.isDefault ? (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Predefinito
                </span>
              ) : (
                <Button variant="outline" className="border-neutral-600 text-xs rounded-full hover:bg-neutral-800" onClick={() => alert("Metodo impostato come predefinito.")}>
                  Imposta predefinito
                </Button>
              )}
            </div>
          </div>
        ))}
        
        <Button className="w-full border border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-400 rounded-full" onClick={() => alert("Integrazione con Stripe in arrivo.")}>
          + Aggiungi nuovo metodo
        </Button>
      </CardContent>
    </Card>
  );
}
