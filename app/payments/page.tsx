import { PaymentMethods } from "@/components/PaymentMethods";
import { PaymentHistory } from "@/components/PaymentHistory";
import { Wallet } from "@/components/Wallet";

export default function PaymentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">I Tuoi Pagamenti</h1>
        <p className="text-neutral-400">Gestisci i tuoi metodi di pagamento e storico ordini.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PaymentMethods />
          <PaymentHistory />
        </div>
        <div>
          <Wallet />
        </div>
      </div>
    </div>
  );
}
