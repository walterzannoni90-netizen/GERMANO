"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { addMeasurement, type Measurement } from "@/lib/firebase-firestore";

const MEASUREMENT_FIELDS = [
  { key: "weight", label: "Peso", unit: "kg", placeholder: "Es. 75.5", step: "0.1" },
  { key: "bodyFat", label: "Grasso corporeo", unit: "%", placeholder: "Es. 15", step: "0.1" },
  { key: "arm", label: "Braccio", unit: "cm", placeholder: "Es. 35", step: "0.1" },
  { key: "waist", label: "Vita", unit: "cm", placeholder: "Es. 82", step: "0.1" },
  { key: "thigh", label: "Coscia", unit: "cm", placeholder: "Es. 50", step: "0.1" },
  { key: "steps", label: "Passi", unit: "", placeholder: "Es. 10000", step: "1" },
];

export function AddMeasurement() {
  const { user } = useAuth();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const setVal = (key: string, val: string) => setValues(prev => ({ ...prev, [key]: val }));

  const handleAdd = async () => {
    if (!user || saving) return;
    setSaving(true);
    setMsg("");
    const today = new Date().toISOString().split("T")[0];
    try {
      for (const field of MEASUREMENT_FIELDS) {
        const v = values[field.key];
        if (v) {
          await addMeasurement({ userId: user.uid, type: field.key as Measurement["type"], value: parseFloat(v), unit: field.unit, date: today });
        }
      }
      setMsg("Misurazioni salvate!");
      setValues({});
    } catch (e) {
      setMsg("Errore durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const hasAny = MEASUREMENT_FIELDS.some(f => values[f.key]);

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Registra misurazioni</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
          {MEASUREMENT_FIELDS.map(field => (
            <div key={field.key}>
              <label className="text-sm text-neutral-400 mb-1 block">{field.label} {field.unit && `(${field.unit})`}</label>
              <Input
                type="number"
                step={field.step}
                value={values[field.key] || ""}
                onChange={e => setVal(field.key, e.target.value)}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleAdd} disabled={saving || !hasAny} className="bg-purple-500 hover:bg-purple-600 text-white rounded-full">
            {saving ? "Salvataggio..." : "Salva misurazioni"}
          </Button>
          {msg && <p className={`text-sm ${msg.includes("Errore") ? "text-red-500" : "text-purple-500"}`}>{msg}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
