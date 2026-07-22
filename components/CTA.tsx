import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-green-600 p-8 md:p-16 text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700"></div>
      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Pronto a iniziare il tuo percorso?</h2>
        <p className="text-xl text-green-50 mb-10">
          Iscriviti ora e ricevi il tuo primo allenamento gratuito! Accedi a centinaia di programmi, consulenze professionali e strumenti avanzati per monitorare i tuoi progressi.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button className="h-14 px-8 text-lg rounded-full bg-white text-green-600 hover:bg-green-50 hover:text-green-700 shadow-xl w-full sm:w-auto">
              Inizia gratis ora
            </Button>
          </Link>
          <Link href="/consultations">
            <Button variant="outline" className="h-14 px-8 text-lg rounded-full bg-green-700/30 text-white hover:bg-green-700/50 border-green-400 w-full sm:w-auto">
              Prenota consulenza
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-sm text-green-100">
          Nessuna carta di credito richiesta. Cancellazione facilissima.
        </p>
      </div>
    </section>
  );
}
