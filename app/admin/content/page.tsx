"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, RotateCcw } from "lucide-react";
import {
  getConsultations,
  getSiteContent,
  saveSiteContent,
  uploadImage,
} from "@/lib/firebase-firestore";

const HERO_DEFAULT =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop";
const CONSULTANT_DEFAULT =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80";

const fileInputClass =
  "h-10 w-full rounded-full bg-neutral-800 px-4 py-2 text-sm text-neutral-300 file:mr-3 file:rounded-full file:border-0 file:bg-green-500 file:px-3 file:py-1 file:text-xs file:font-medium file:text-white hover:file:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500";

interface ConsultantItem {
  name: string;
  specialty: string;
  image: string;
  hasOverride: boolean;
}

export default function AdminContent() {
  const [heroImage, setHeroImage] = useState(HERO_DEFAULT);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroMessage, setHeroMessage] = useState("");
  const [consultants, setConsultants] = useState<ConsultantItem[]>([]);
  const [loadingConsultants, setLoadingConsultants] = useState(true);
  const [uploadingName, setUploadingName] = useState<string | null>(null);
  const [consultantMessage, setConsultantMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const hero = await getSiteContent("hero");
        setHeroImage(hero || HERO_DEFAULT);
      } catch (e) {
        console.error(e);
      }
    })();
    (async () => {
      try {
        const data = await getConsultations();
        const grouped: Record<string, { name: string; specialty: string; image?: string }> = {};
        data.forEach((c: any) => {
          const name = c.professionalName || "Professionista";
          if (!grouped[name]) {
            grouped[name] = { name, specialty: c.specialty || "Fitness", image: c.image };
          }
        });
        const list = await Promise.all(
          Object.values(grouped).map(async (g) => {
            const override = await getSiteContent(`consultant-${g.name}`);
            return {
              name: g.name,
              specialty: g.specialty,
              image: override || g.image || CONSULTANT_DEFAULT,
              hasOverride: !!override,
            };
          })
        );
        setConsultants(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingConsultants(false);
      }
    })();
  }, []);

  const handleHeroUpload = async (file: File) => {
    setHeroUploading(true);
    setHeroMessage("");
    try {
      const url = await uploadImage(file);
      await saveSiteContent("hero", url);
      setHeroImage(url);
      setHeroMessage("Immagine aggiornata!");
    } catch (e) {
      console.error(e);
      setHeroMessage("Errore durante il caricamento dell'immagine.");
    } finally {
      setHeroUploading(false);
    }
  };

  const handleHeroReset = async () => {
    setHeroUploading(true);
    setHeroMessage("");
    try {
      await saveSiteContent("hero", "");
      setHeroImage(HERO_DEFAULT);
      setHeroMessage("Immagine ripristinata al valore predefinito.");
    } catch (e) {
      console.error(e);
      setHeroMessage("Errore durante il ripristino dell'immagine.");
    } finally {
      setHeroUploading(false);
    }
  };

  const handleConsultantUpload = async (name: string, file: File) => {
    setUploadingName(name);
    setConsultantMessage("");
    try {
      const url = await uploadImage(file);
      await saveSiteContent(`consultant-${name}`, url);
      setConsultants((prev) =>
        prev.map((c) => (c.name === name ? { ...c, image: url, hasOverride: true } : c))
      );
      setConsultantMessage(`Foto di ${name} aggiornata!`);
    } catch (e) {
      console.error(e);
      setConsultantMessage(`Errore durante il caricamento della foto di ${name}.`);
    } finally {
      setUploadingName(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Contenuti sito</h1>
        <p className="text-neutral-400 mt-1">Gestisci le immagini statiche e di marketing del sito.</p>
      </div>

      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">Immagine principale (Hero homepage)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative h-48 w-full rounded-xl overflow-hidden bg-neutral-800">
            <img
              src={heroImage || HERO_DEFAULT}
              alt="Hero homepage"
              onError={(e) => {
                if (e.currentTarget.src !== HERO_DEFAULT) e.currentTarget.src = HERO_DEFAULT;
              }}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">Nuova immagine</label>
            <input
              type="file"
              accept="image/*"
              disabled={heroUploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleHeroUpload(f);
                e.target.value = "";
              }}
              className={fileInputClass}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleHeroReset}
              disabled={heroUploading}
              className="text-neutral-300"
            >
              <RotateCcw className="h-4 w-4 mr-2" /> Ripristina predefinita
            </Button>
            {heroUploading && <span className="text-sm text-neutral-400">Caricamento...</span>}
            {!heroUploading && heroMessage && (
              <span className={`text-sm ${heroMessage.includes("Errore") ? "text-red-500" : "text-green-500"}`}>
                {heroMessage}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">Foto consulenti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingConsultants ? (
            <p className="text-sm text-neutral-500">Caricamento...</p>
          ) : consultants.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-neutral-600" />
              Nessun consulente trovato nelle consulenze.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consultants.map((c) => (
                <div
                  key={c.name}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-3"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={c.image || CONSULTANT_DEFAULT}
                      alt={c.name}
                      onError={(e) => {
                        if (e.currentTarget.src !== CONSULTANT_DEFAULT) e.currentTarget.src = CONSULTANT_DEFAULT;
                      }}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{c.name}</p>
                        {c.hasOverride && <Badge variant="success">Personalizzata</Badge>}
                      </div>
                      <p className="text-sm text-green-500">{c.specialty}</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingName === c.name}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleConsultantUpload(c.name, f);
                      e.target.value = "";
                    }}
                    className={fileInputClass}
                  />
                  {uploadingName === c.name && (
                    <p className="text-sm text-neutral-400">Caricamento...</p>
                  )}
                </div>
              ))}
            </div>
          )}
          {consultantMessage && (
            <p className={`text-sm ${consultantMessage.includes("Errore") ? "text-red-500" : "text-green-500"}`}>
              {consultantMessage}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
