import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const payments = [
  { id: "ORD-001", date: "20/07/2026", description: "Programma Full Body HIIT", amount: "€19.99", status: "Completato" },
  { id: "ORD-002", date: "18/07/2026", description: "Consulenza con Dr. Mario Rossi", amount: "€75.00", status: "Completato" },
  { id: "ORD-003", date: "15/07/2026", description: "Programma Yoga Principianti", amount: "€14.99", status: "Completato" },
  { id: "ORD-004", date: "10/07/2026", description: "Bundle健身全套", amount: "€49.99", status: "Completato" },
  { id: "ORD-005", date: "01/07/2026", description: "Abbonamento mensile Premium", amount: "€29.99", status: "Rinnovo previsto" },
];

export function PaymentHistory() {
  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Storico pagamenti</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-neutral-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-xl">
                  💳
                </div>
                <div>
                  <p className="font-semibold text-white">{payment.description}</p>
                  <p className="text-xs text-neutral-400">{payment.id} • {payment.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">{payment.amount}</p>
                <p className={`text-xs ${payment.status.includes("Completato") ? "text-green-500" : "text-orange-500"}`}>
                  {payment.status}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <button className="text-green-500 hover:text-green-400 text-sm font-medium">
            Scarica tutte le ricevute
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
