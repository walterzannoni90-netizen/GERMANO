"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserProgressPhotos, addProgressPhoto, uploadImage } from "@/lib/firebase-firestore";
import { useAuth } from "@/contexts/AuthContext";

export function ProgressPhotos() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getUserProgressPhotos(user.uid);
        setPhotos(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    try {
      const url = await uploadImage(file);
      await addProgressPhoto({
        userId: user.uid,
        photoUrl: url,
        type: "progress",
        date: new Date().toISOString().split("T")[0],
      });
      const data = await getUserProgressPhotos(user.uid);
      setPhotos(data);
    } catch (e) {
      console.error("Upload error:", e);
    }
  };

  const [before, after] = [photos.find((p) => p.type === "before"), photos.find((p) => p.type === "after")];

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Galleria fotografica progressi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group">
            <div
              className="aspect-video bg-neutral-800 rounded-xl overflow-hidden cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <span className="block text-4xl mb-2">📸</span>
                  <span className="text-sm text-neutral-400">Aggiungi foto</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
              <Button
                variant="secondary"
                className="rounded-full bg-white text-black hover:bg-neutral-200"
                onClick={() => fileInputRef.current?.click()}
              >
                Carica foto
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>

          {before ? (
            <div className="relative group">
              <img
                src={before.photoUrl}
                alt="Prima"
                className="aspect-video object-cover rounded-xl"
              />
              <div className="absolute top-3 right-3">
                <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">Prima</span>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">{before.date}</span>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-neutral-800 rounded-xl flex items-center justify-center text-neutral-500 text-sm">
              Nessuna foto prima
            </div>
          )}

          {after ? (
            <div className="relative group">
              <img
                src={after.photoUrl}
                alt="Ultima"
                className="aspect-video object-cover rounded-xl"
              />
              <div className="absolute top-3 right-3">
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Ultima</span>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">{after.date}</span>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-neutral-800 rounded-xl flex items-center justify-center text-neutral-500 text-sm">
              Nessuna foto dopo
            </div>
          )}
        </div>

        <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white mb-1">Confronto immagini</h4>
              <p className="text-sm text-neutral-400">Visualizza le tue foto a confronto con animazioni fluide</p>
            </div>
            <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full">
              Apri comparatore
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}