"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { updateUser } from "@/lib/firebase-firestore";

const preferences = [
  { label: "Email per appuntamenti", description: "Ricevi conferma via email per ogni prenotazione", key: "notifyAppointments" },
  { label: "Promemoria allenamenti", description: "Ricevi notifica 1 ora prima dell'allenamento", key: "notifyWorkouts" },
  { label: "Report progressi settimanali", description: "Ricevi un riepilogo dei tuoi progressi ogni lunedì", key: "notifyReports" },
  { label: "Promozioni e sconti", description: "Ricevi offerte esclusive e codici sconto", key: "notifyPromotions" },
  { label: "Nuovi allenamenti", description: "Ricevi notifica quando aggiungiamo nuovi programmi", key: "notifyNewTrainings" },
];

export function UserPreferences() {
  const { user, userData, refreshUserData } = useAuth();
  const [settings, setSettings] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (userData) {
      const prefs: Record<string, boolean> = {};
      preferences.forEach((p) => {
        prefs[p.key] = (userData as Record<string, any>)[p.key] ?? true;
      });
      setSettings(prefs);
    }
  }, [userData]);

  const handleToggle = async (key: string) => {
    if (!user) return;
    const newVal = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: newVal }));
    try {
      await updateUser(user.uid, { [key]: newVal });
      await refreshUserData();
    } catch (e) {
      setSettings((prev) => ({ ...prev, [key]: !newVal }));
    }
  };

  if (!user) return null;

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Preferenze e notifiche</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-white">Notifiche</h4>
          
          {preferences.map((pref, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">{pref.label}</p>
                <p className="text-sm text-neutral-400">{pref.description}</p>
              </div>
              <Switch
                checked={settings[pref.key] ?? true}
                onCheckedChange={() => handleToggle(pref.key)}
              />
            </div>
          ))}
        </div>
        
        <div className="pt-6 border-t border-neutral-800">
          <h4 className="font-semibold text-white mb-4">Account</h4>
          
          <div className="space-y-3">
            <Button variant="destructive" className="w-full rounded-full" onClick={() => { if (confirm("Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.")) alert("Richiesta di eliminazione inviata. Ti contatteremo per conferma."); }}>
              Elimina account
            </Button>
            <Button variant="outline" className="w-full rounded-full border-neutral-600 text-white hover:bg-neutral-800" onClick={() => alert("Disconnessione da tutti i dispositivi in arrivo.")}>
              Disconnetti da tutti i dispositivi
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}