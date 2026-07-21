import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function UserPreferences() {
  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Preferenze e notifiche</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-white">Notifiche</h4>
          
          {[
            { label: "Email per appuntamenti", description: "Ricevi conferma via email per ogni prenotazione", enabled: true },
            { label: "Promemoria allenamenti", description: "Ricevi notifica 1 ora prima dell'allenamento", enabled: true },
            { label: "Report progressi settimanali", description: "Ricevi un riepilogo dei tuoi progressi ogni lunedì", enabled: true },
            { label: "Promozioni e sconti", description: "Ricevi offerte esclusive e codici sconto", enabled: false },
            { label: "Nuovi allenamenti", description: "Ricevi notifica quando aggiungiamo nuovi programmi", enabled: true },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">{item.label}</p>
                <p className="text-sm text-neutral-400">{item.description}</p>
              </div>
              <Switch checked={item.enabled} />
            </div>
          ))}
        </div>
        
        <div className="pt-6 border-t border-neutral-800">
          <h4 className="font-semibold text-white mb-4">Account</h4>
          
          <div className="space-y-3">
            <Button variant="destructive" className="w-full rounded-full">
              Elimina account
            </Button>
            <Button variant="outline" className="w-full rounded-full border-neutral-600 text-white hover:bg-neutral-800">
              Disconnetti da tutti i dispositivi
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
