"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Star } from "lucide-react";
import {
  getTrainings,
  createTraining,
  updateTraining,
  deleteTraining,
  uploadImage,
} from "@/lib/firebase-firestore";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop";

interface TrainingItem {
  id: string;
  title?: string;
  trainer?: string;
  duration?: string;
  level?: string;
  price?: number;
  rating?: number;
  active?: boolean;
  image?: string;
}

const fileInputClass =
  "h-10 w-full rounded-full bg-neutral-800 px-4 py-2 text-sm text-neutral-300 file:mr-3 file:rounded-full file:border-0 file:bg-green-500 file:px-3 file:py-1 file:text-xs file:font-medium file:text-white hover:file:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500";

export default function AdminTrainings() {
  const [trainings, setTrainings] = useState<TrainingItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newTrainer, setNewTrainer] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newLevel, setNewLevel] = useState("Intermedio");
  const [newPrice, setNewPrice] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    getTrainings().then((data) => setTrainings(data as TrainingItem[]));
  }, []);

  const handleCreate = async () => {
    if (!newTitle || !newPrice || creating) return;
    setCreating(true);
    try {
      let image = DEFAULT_IMAGE;
      if (newImageFile) {
        image = await uploadImage(newImageFile);
      }
      const created = await createTraining({
        title: newTitle,
        trainer: newTrainer || "Germano Team",
        duration: newDuration || "30 min",
        level: newLevel,
        category: "Generale",
        price: parseFloat(newPrice),
        description: "",
        image,
        rating: 0,
        active: true,
      });
      setTrainings((prev) => [
        { id: created.id, title: newTitle, trainer: newTrainer || "Germano Team", duration: newDuration || "30 min", level: newLevel, price: parseFloat(newPrice), rating: 0, active: true, image },
        ...prev,
      ]);
      setNewTitle("");
      setNewTrainer("");
      setNewDuration("");
      setNewPrice("");
      setNewImageFile(null);
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (t: TrainingItem) => {
    await updateTraining(t.id, { active: !t.active });
    setTrainings((prev) =>
      prev.map((x) => (x.id === t.id ? { ...x, active: !x.active } : x))
    );
  };

  const handleChangeImage = async (t: TrainingItem, file: File) => {
    setUploadingId(t.id);
    try {
      const url = await uploadImage(file);
      await updateTraining(t.id, { image: url });
      setTrainings((prev) =>
        prev.map((x) => (x.id === t.id ? { ...x, image: url } : x))
      );
    } finally {
      setUploadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Eliminare questo allenamento?")) {
      await deleteTraining(id);
      setTrainings((prev) => prev.filter((x) => x.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Allenamenti</h1>
        <p className="text-neutral-400 mt-1">Gestisci il catalogo allenamenti.</p>
      </div>

      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">Nuovo allenamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input placeholder="Titolo" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <Input placeholder="Trainer" value={newTrainer} onChange={(e) => setNewTrainer(e.target.value)} />
            <Input placeholder="Durata (es. 45 min)" value={newDuration} onChange={(e) => setNewDuration(e.target.value)} />
            <select
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value)}
              className="h-10 rounded-full bg-neutral-800 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>Principiante</option>
              <option>Intermedio</option>
              <option>Avanzato</option>
            </select>
            <Input placeholder="Prezzo (es. 19.99)" type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
          </div>
          <div className="mt-4">
            <label className="text-sm text-neutral-400 mb-1 block">Immagine (opzionale)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImageFile(e.target.files?.[0] || null)}
              className={fileInputClass}
            />
          </div>
          <Button
            onClick={handleCreate}
            disabled={creating}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white rounded-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {creating ? "Caricamento..." : "Aggiungi allenamento"}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Immagine</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Titolo</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Trainer</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Durata</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Livello</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Prezzo</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Stato</th>
                  <th className="text-right p-4 text-sm font-medium text-neutral-400">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {trainings.map((t) => (
                  <tr key={t.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                    <td className="p-4">
                      <img
                        src={t.image || DEFAULT_IMAGE}
                        alt={t.title || "Allenamento"}
                        onError={(e) => {
                          if (e.currentTarget.src !== DEFAULT_IMAGE) e.currentTarget.src = DEFAULT_IMAGE;
                        }}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{t.title}</p>
                        {t.rating && t.rating > 0 && (
                          <span className="flex items-center text-yellow-400 text-xs">
                            <Star className="h-3 w-3 fill-current" /> {t.rating}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-neutral-400">{t.trainer}</td>
                    <td className="p-4 text-sm text-neutral-400">{t.duration}</td>
                    <td className="p-4">
                      <Badge variant="neutral">{t.level}</Badge>
                    </td>
                    <td className="p-4 text-sm font-semibold text-white">€{t.price?.toFixed(2)}</td>
                    <td className="p-4">
                      <Badge variant={t.active !== false ? "success" : "danger"}>
                        {t.active !== false ? "Attivo" : "Nascosto"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <label
                          className={`inline-flex items-center justify-center whitespace-nowrap rounded-full h-9 px-3 text-xs font-medium transition-all cursor-pointer hover:bg-neutral-800 hover:text-neutral-50 ${
                            uploadingId === t.id ? "opacity-50 pointer-events-none" : ""
                          }`}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingId === t.id}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleChangeImage(t, f);
                              e.target.value = "";
                            }}
                          />
                          {uploadingId === t.id ? "Caricamento..." : "Cambia immagine"}
                        </label>
                        <Button variant="ghost" size="sm" onClick={() => toggleActive(t)} disabled={uploadingId === t.id}>
                          {t.active !== false ? "Nascondi" : "Mostra"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)} disabled={uploadingId === t.id} className="text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {trainings.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-neutral-500">
                      Nessun allenamento trovato. Aggiungine uno sopra.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
