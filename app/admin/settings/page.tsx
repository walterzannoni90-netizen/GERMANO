"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { getSettings, saveSettings } from "@/lib/firebase-firestore";

export default function AdminSettings() {
  const [platformName, setPlatformName] = useState("Germano Fitness");
  const [contactEmail, setContactEmail] = useState("info@germanofitness.com");
  const [stripePublicKey, setStripePublicKey] = useState("pk_live_...");
  const [stripeSecretKey, setStripeSecretKey] = useState("sk_live_...");
  const [openRegistration, setOpenRegistration] = useState(true);
  const [loyaltyProgram, setLoyaltyProgram] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const settings = await getSettings();
        if (settings) {
          setPlatformName(settings.platformName);
          setContactEmail(settings.contactEmail);
          setStripePublicKey(settings.stripePublicKey);
          setStripeSecretKey(settings.stripeSecretKey);
          setOpenRegistration(settings.features?.openRegistration ?? true);
          setLoyaltyProgram(settings.features?.loyaltyProgram ?? true);
          setEmailNotifications(settings.features?.emailNotifications ?? true);
        }
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await saveSettings({
        platformName,
        contactEmail,
        stripePublicKey,
        stripeSecretKey,
        features: { openRegistration, loyaltyProgram, emailNotifications },
      });
      setMessage("Impostazioni salvate con successo!");
    } catch (e) {
      setMessage("Errore durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPlatformName("Germano Fitness");
    setContactEmail("info@germanofitness.com");
    setStripePublicKey("pk_live_...");
    setStripeSecretKey("sk_live_...");
    setOpenRegistration(true);
    setLoyaltyProgram(true);
    setEmailNotifications(true);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Impostazioni</h1>
        <p className="text-neutral-400 mt-1">Configura la piattaforma Germano.</p>
      </div>

      {message && (
        <p className={`text-sm ${message.includes("Errore") ? "text-red-500" : "text-purple-500"}`}>
          {message}
        </p>
      )}

      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Informazioni piattaforma</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">Nome piattaforma</label>
            <Input value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">Email di contatto</label>
            <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
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
            <Input value={stripePublicKey} onChange={(e) => setStripePublicKey(e.target.value)} type="password" />
          </div>
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">Chiave segreta Stripe</label>
            <Input value={stripeSecretKey} onChange={(e) => setStripeSecretKey(e.target.value)} type="password" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Funzionalità</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-white">Registrazione aperta</p>
              <p className="text-sm text-neutral-400">Permetti a nuovi utenti di registrarsi</p>
            </div>
            <Switch checked={openRegistration} onCheckedChange={setOpenRegistration} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-white">Programma fedeltà</p>
              <p className="text-sm text-neutral-400">Attiva punti e rewards per i clienti</p>
            </div>
            <Switch checked={loyaltyProgram} onCheckedChange={setLoyaltyProgram} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-white">Notifiche email</p>
              <p className="text-sm text-neutral-400">Invia notifiche email automatiche</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-purple-500 hover:bg-purple-600 text-white rounded-full"
        >
          {saving ? "Salvataggio..." : "Salva impostazioni"}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-neutral-600 text-white hover:bg-neutral-800 rounded-full"
        >
          Ripristina default
        </Button>
      </div>
    </div>
  );
}