"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { addMeasurement } from "@/lib/firebase-firestore";

export function AddMeasurement() {
  const { user } = useAuth();
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handleAdd = async () => {
    if (!user || saving) return;
    setSaving(true);
    setMsg("");
    try {
      const today = new Date().toISOString().split("T")[0];
      if (weight) {
        await addMeasurement({ userId: user.uid, type: "weight", value: parseFloat(weight), unit: "kg", date: today });
      }
      if (waist) {
        await addMeasurement({ userId: user.uid, type: "waist", value: parseFloat(waist), unit: "cm", date: today });
      }
      setMsg("Misurazioni salvate!");
      setWeight("");
      setWaist("");
    } catch (e) {
      setMsg("Errore durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Registra misurazioni</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-4">
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">Peso (kg)</label>
            <Input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Es. 75.5" />
          </div>
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">Vita (cm)</label>
            <Input type="number" step="0.1" value={waist} onChange={e => setWaist(e.target.value)} placeholder="Es. 82" />
          </div>
          <Button onClick={handleAdd} disabled={saving || (!weight && !waist)} className="bg-green-500 hover:bg-green-600 text-white rounded-full">
            {saving ? "Salvataggio..." : "Salva"}
          </Button>
        </div>
        {msg && <p className={`mt-2 text-sm ${msg.includes("Errore") ? "text-red-500" : "text-green-500"}`}>{msg}</p>}
      </CardContent>
    </Card>
  );
}
