"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Impostazioni</h1>
        <p className="text-neutral-400 mt-1">Configura la piattaforma Germano.</p>
      </div>

      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Informazioni piattaforma</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">Nome piattaforma</label>
            <Input defaultValue="Germano Fitness" />
          </div>
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">Email di contatto</label>
            <Input defaultValue="info@germanofitness.com" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Configurazione pagamenti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">Chiave pubblica Stripe</label>
            <Input defaultValue="pk_live_..." type="password" />
          </div>
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">Chiave segreta Stripe</label>
            <Input defaultValue="sk_live_..." type="password" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Funzionalità</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Registrazione aperta", desc: "Permetti a nuovi utenti di registrarsi" },
            { label: "Programma fedeltà", desc: "Attiva punti e rewards per i clienti" },
            { label: "Notifiche email", desc: "Invia notifiche email automatiche" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-white">{item.label}</p>
                <p className="text-sm text-neutral-400">{item.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full">
          Salva impostazioni
        </Button>
        <Button variant="outline" className="border-neutral-600 text-white hover:bg-neutral-800 rounded-full">
          Ripristina default
        </Button>
      </div>
    </div>
  );
}
