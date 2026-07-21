import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Wallet() {
  return (
    <Card className="bg-gradient-to-br from-green-500 to-green-600 border-none text-white">
      <CardHeader>
        <CardTitle className="text-xl">Portafoglio interno</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-green-100 text-sm mb-1">Saldo disponibile</p>
          <p className="text-4xl font-bold">1280 <span className="text-lg">punti</span></p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-sm font-semibold">Livello 3</div>
            <div className="text-xs text-green-100">Gold Member</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-sm font-semibold">1280</div>
            <div className="text-xs text-green-100">Punti totali</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-green-100">Sconto attivo</span>
            <span className="font-semibold">FIDELITY20</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-green-100">Referral</span>
            <span className="font-semibold">€10 guadagnati</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button className="w-full bg-white text-green-600 hover:bg-green-50 hover:text-green-700 rounded-full">
            Riscatta punti
          </Button>
          <Button variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white rounded-full">
            Condividi amico
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
