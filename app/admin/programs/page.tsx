"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, Dumbbell, Plus, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getWorkoutPrograms,
  createWorkoutProgram,
  deleteWorkoutProgram,
  updateWorkoutProgram,
  uploadImage,
  uploadPDF,
  type WorkoutProgram,
  type WorkoutDay,
  type WorkoutExercise,
} from "@/lib/firebase-firestore";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop";

const selectClass =
  "h-10 w-full rounded-full bg-neutral-800 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500";

const fileInputClass =
  "h-10 w-full rounded-full bg-neutral-800 px-4 py-2 text-sm text-neutral-300 file:mr-3 file:rounded-full file:border-0 file:bg-purple-500 file:px-3 file:py-1 file:text-xs file:font-medium file:text-white hover:file:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500";

interface ProgramForm {
  title: string;
  subtitle: string;
  goal: string;
  level: string;
  target: string;
  location: string;
  sessionsPerWeek: string;
  totalWeeks: string;
  price: string;
  description: string;
  type: "workout" | "nutrition";
}

const emptyForm: ProgramForm = {
  title: "",
  subtitle: "",
  goal: "",
  level: "Principiante",
  target: "",
  location: "palestra",
  sessionsPerWeek: "3",
  totalWeeks: "4",
  price: "40",
  description: "",
  type: "workout",
};

const emptyExercise = (): WorkoutExercise => ({
  name: "",
  muscleGroup: "",
  sets: "",
  reps: "",
  rest: "",
  notes: "",
});

export default function AdminPrograms() {
  const router = useRouter();
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProgramForm>(emptyForm);
  const [days, setDays] = useState<WorkoutDay[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    getWorkoutPrograms().then(setPrograms);
  }, []);

  const setField = (field: keyof ProgramForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // === Days / exercises editor ===
  const addDay = () =>
    setDays((prev) => [...prev, { dayNumber: prev.length + 1, name: "", exercises: [] }]);

  const removeDay = (dayIdx: number) =>
    setDays((prev) =>
      prev.filter((_, i) => i !== dayIdx).map((d, i) => ({ ...d, dayNumber: i + 1 }))
    );

  const updateDayName = (dayIdx: number, name: string) =>
    setDays((prev) => prev.map((d, i) => (i === dayIdx ? { ...d, name } : d)));

  const addExercise = (dayIdx: number) =>
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx ? { ...d, exercises: [...d.exercises, emptyExercise()] } : d
      )
    );

  const updateExercise = (
    dayIdx: number,
    exIdx: number,
    field: keyof WorkoutExercise,
    value: string
  ) =>
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx
          ? {
              ...d,
              exercises: d.exercises.map((ex, j) =>
                j === exIdx ? { ...ex, [field]: value } : ex
              ),
            }
          : d
      )
    );

  const removeExercise = (dayIdx: number, exIdx: number) =>
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx
          ? { ...d, exercises: d.exercises.filter((_, j) => j !== exIdx) }
          : d
      )
    );

  const resetForm = () => {
    setForm(emptyForm);
    setDays([]);
    setImageFile(null);
    setPdfFile(null);
    setPdfFileName("");
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (p: WorkoutProgram) => {
    setForm({
      title: p.title || "",
      subtitle: p.subtitle || "",
      goal: p.goal || "",
      level: p.level || "Principiante",
      target: p.target || "",
      location: p.location || "palestra",
      sessionsPerWeek: p.sessionsPerWeek?.toString() || "3",
      totalWeeks: p.totalWeeks?.toString() || "4",
      price: p.price?.toString() || "40",
      description: p.description || "",
      type: p.type || "workout",
    });
    setDays(p.days ? p.days.map((d) => ({ ...d, exercises: d.exercises.map((ex) => ({ ...ex })) })) : []);
    setImageFile(null);
    setPdfFile(null);
    setPdfFileName(p.pdfName || "");
    setEditingId(p.id!);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    if (!form.title || saving) return;
    setSaving(true);
    setSaveError("");
    try {
      const existing = editingId ? programs.find((p) => p.id === editingId) : null;
      let image = existing?.image || DEFAULT_IMAGE;
      if (imageFile) {
        image = await uploadImage(imageFile);
      }
      let pdfName = existing?.pdfName || "";
      let pdfData = existing?.pdfData || "";
      if (pdfFile) {
        const result = await uploadPDF(pdfFile);
        pdfName = result.pdfName;
        pdfData = result.pdfData;
      }
      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        goal: form.goal,
        level: form.level,
        target: form.target,
        location: form.location,
        sessionsPerWeek: parseInt(form.sessionsPerWeek, 10) || 0,
        totalWeeks: parseInt(form.totalWeeks, 10) || 0,
        price: parseFloat(form.price) || 0,
        description: form.description,
        image,
        active: existing ? existing.active !== false : true,
        days,
        pdfName,
        pdfData,
        type: form.type,
      };
      if (editingId) {
        await updateWorkoutProgram(editingId, payload);
        setPrograms((prev) =>
          prev.map((p) => (p.id === editingId ? ({ ...p, ...payload } as WorkoutProgram) : p))
        );
      } else {
        const created = await createWorkoutProgram(payload);
        setPrograms((prev) => [{ id: created.id, ...payload } as WorkoutProgram, ...prev]);
      }
      resetForm();
    } catch (e: any) {
      setSaveError(e?.message || "Errore durante il salvataggio. Riprova.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Eliminare questo programma?")) {
      await deleteWorkoutProgram(id);
      setPrograms(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleActive = async (p: WorkoutProgram) => {
    await updateWorkoutProgram(p.id!, { active: !p.active });
    setPrograms(prev => prev.map(x => x.id === p.id ? { ...x, active: !x.active } : x));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Programmi / Schede</h1>
          <p className="text-neutral-400 mt-1">Gestisci le schede di allenamento complete.</p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-full"
          >
            <Plus className="h-4 w-4 mr-2" /> Nuovo programma
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="bg-neutral-900/50 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-white">
              {editingId ? "Modifica programma" : "Nuovo programma"}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Titolo</label>
                <Input placeholder="Es. Scheda Massa 8 settimane" value={form.title} onChange={(e) => setField("title", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Sottotitolo</label>
                <Input placeholder="Es. Programma completo per la massa" value={form.subtitle} onChange={(e) => setField("subtitle", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Obiettivo</label>
                <Input placeholder="Es. Aumentare la massa muscolare" value={form.goal} onChange={(e) => setField("goal", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Livello</label>
                <select value={form.level} onChange={(e) => setField("level", e.target.value)} className={selectClass}>
                  <option>Principiante</option>
                  <option>Intermedio</option>
                  <option>Avanzato</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Target / Genere</label>
                <select value={form.target} onChange={(e) => setField("target", e.target.value)} className={selectClass}>
                  <option value="">Seleziona...</option>
                  <option value="Uomo">Uomo</option>
                  <option value="Donna">Donna</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Tipo</label>
                <select value={form.type} onChange={(e) => setField("type", e.target.value)} className={selectClass}>
                  <option value="workout">Scheda Allenamento</option>
                  <option value="nutrition">Piano Alimentare</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Luogo</label>
                <select value={form.location} onChange={(e) => setField("location", e.target.value)} className={selectClass}>
                  <option value="palestra">Palestra</option>
                  <option value="casa">Casa</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Sessioni a settimana</label>
                <Input type="number" min={1} value={form.sessionsPerWeek} onChange={(e) => setField("sessionsPerWeek", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Settimane totali</label>
                <Input type="number" min={1} value={form.totalWeeks} onChange={(e) => setField("totalWeeks", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Prezzo (€)</label>
                <Input type="number" placeholder="Es. 49.99" value={form.price} onChange={(e) => setField("price", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Immagine (opzionale)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className={fileInputClass}
                />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">PDF scheda (opzionale, max 900 KB)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className={fileInputClass}
                />
                {pdfFileName && (
                  <p className="text-xs text-purple-500 mt-1">PDF: {pdfFileName}</p>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm text-neutral-400 mb-1 block">Descrizione</label>
              <textarea
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={3}
                placeholder="Descrivi il programma..."
                className="w-full rounded-2xl bg-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* === Days / exercises editor === */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">Giorni ed esercizi</h3>
                <Button variant="ghost" size="sm" onClick={addDay} className="text-purple-500">
                  <Plus className="h-4 w-4 mr-1" /> Aggiungi giorno
                </Button>
              </div>
              {days.length === 0 && (
                <p className="text-sm text-neutral-500">Nessun giorno. Aggiungine uno per definire la scheda.</p>
              )}
              {days.map((day, dayIdx) => (
                <div key={dayIdx} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-purple-500 whitespace-nowrap">
                      Giorno {day.dayNumber}
                    </span>
                    <Input
                      placeholder="Nome giorno (es. Push, Gambe)"
                      value={day.name || ""}
                      onChange={(e) => updateDayName(dayIdx, e.target.value)}
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeDay(dayIdx)} className="text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {day.exercises.map((ex, exIdx) => (
                    <div key={exIdx} className="grid grid-cols-2 md:grid-cols-6 gap-2 items-center rounded-xl bg-neutral-800/50 p-3">
                      <Input
                        placeholder="Esercizio"
                        value={ex.name}
                        onChange={(e) => updateExercise(dayIdx, exIdx, "name", e.target.value)}
                        className="col-span-2"
                      />
                      <Input
                        placeholder="Gruppo muscolare"
                        value={ex.muscleGroup}
                        onChange={(e) => updateExercise(dayIdx, exIdx, "muscleGroup", e.target.value)}
                      />
                      <Input
                        placeholder="Serie (es. 4)"
                        value={ex.sets}
                        onChange={(e) => updateExercise(dayIdx, exIdx, "sets", e.target.value)}
                      />
                      <Input
                        placeholder="Reps (es. 8-10)"
                        value={ex.reps}
                        onChange={(e) => updateExercise(dayIdx, exIdx, "reps", e.target.value)}
                      />
                      <div className="col-span-2 md:col-span-1 flex gap-2">
                        <Input
                          placeholder="Rec. (es. 90s)"
                          value={ex.rest}
                          onChange={(e) => updateExercise(dayIdx, exIdx, "rest", e.target.value)}
                        />
                        <Button variant="ghost" size="sm" onClick={() => removeExercise(dayIdx, exIdx)} className="text-red-400 shrink-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Note (opzionale)"
                        value={ex.notes || ""}
                        onChange={(e) => updateExercise(dayIdx, exIdx, "notes", e.target.value)}
                        className="col-span-2 md:col-span-6"
                      />
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={() => addExercise(dayIdx)} className="text-purple-500">
                    <Plus className="h-4 w-4 mr-1" /> Aggiungi esercizio
                  </Button>
                </div>
              ))}
            </div>

            {saveError && (
              <p className="text-sm text-red-500 bg-red-500/10 rounded-xl px-4 py-2">{saveError}</p>
            )}
            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={saving || !form.title}
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-full"
              >
                {saving ? "Caricamento..." : editingId ? "Salva modifiche" : "Crea programma"}
              </Button>
              <Button variant="ghost" onClick={resetForm} disabled={saving}>
                Annulla
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Immagine</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Titolo</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Target</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Tipo</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Livello</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Obiettivo</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Prezzo</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Stato</th>
                  <th className="text-right p-4 text-sm font-medium text-neutral-400">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {programs.map(p => (
                  <tr key={p.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                    <td className="p-4">
                      <img
                        src={p.image || DEFAULT_IMAGE}
                        alt={p.title}
                        onError={(e) => {
                          if (e.currentTarget.src !== DEFAULT_IMAGE) e.currentTarget.src = DEFAULT_IMAGE;
                        }}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-white">{p.title}</p>
                      <p className="text-xs text-neutral-500">{p.subtitle}</p>
                    </td>
                    <td className="p-4 text-sm text-neutral-400">{p.target}</td>
                    <td className="p-4"><Badge variant={p.type === "nutrition" ? "warning" : "success"}>{p.type === "nutrition" ? "Alimentazione" : "Scheda"}</Badge></td>
                    <td className="p-4"><Badge variant="neutral">{p.level}</Badge></td>
                    <td className="p-4 text-sm text-neutral-400">{p.goal}</td>
                    <td className="p-4 text-sm font-semibold text-white">€{p.price?.toFixed(2)}</td>
                    <td className="p-4">
                      <Badge variant={p.active !== false ? "success" : "danger"}>
                        {p.active !== false ? "Attivo" : "Nascosto"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/trainings/detail?id=${p.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => startEdit(p)}>
                          <Pencil className="h-4 w-4 mr-1" /> Modifica
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toggleActive(p)}>
                          {p.active !== false ? "Nascondi" : "Mostra"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id!)} className="text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {programs.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-neutral-500">
                      <Dumbbell className="h-8 w-8 mx-auto mb-2 text-neutral-600" />
                      Nessun programma trovato.
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
