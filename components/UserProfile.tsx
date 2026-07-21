"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { updateUser, uploadFile } from "@/lib/firebase-firestore";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AVATAR_FALLBACK =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80";

export function UserProfile() {
  const { user, userData, refreshUserData } = useAuth();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setSurname(userData.surname || "");
      setEmail(userData.email || "");
      setBirthDate((userData as any).birthDate || "");
      setSex((userData as any).sex || "Maschio");
      setHeight((userData as any).height?.toString() || "");
      setWeight((userData as any).weight?.toString() || "");
      setGoal((userData as any).goal || "Perdere peso");
    }
  }, [userData]);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingPhoto(true);
    setPhotoMessage("");
    try {
      const url = await uploadFile(`avatars/${user.uid}-${Date.now()}`, file);
      await updateUser(user.uid, { photoURL: url });
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: url });
      }
      await refreshUserData();
      setPhotoMessage("Foto aggiornata!");
    } catch (err) {
      console.error(err);
      setPhotoMessage("Errore durante il caricamento della foto.");
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage("");
    try {
      await updateUser(user.uid, {
        name,
        surname,
        birthDate,
        sex,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        goal,
      });
      setMessage("Modifiche salvate con successo!");
    } catch (e) {
      setMessage("Errore durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Informazioni personali</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative">
            <img
              src={userData?.photoURL || user.photoURL || AVATAR_FALLBACK}
              alt={`${name} ${surname}`}
              onError={(e) => {
                if (e.currentTarget.src !== AVATAR_FALLBACK) e.currentTarget.src = AVATAR_FALLBACK;
              }}
              className="w-32 h-32 rounded-full object-cover"
            />
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoSelect}
            />
            <Button
              variant="secondary"
              onClick={() => photoInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="absolute bottom-0 right-0 rounded-full bg-green-500 hover:bg-green-600 text-white h-8 w-8 p-0"
            >
              📷
            </Button>
            {(uploadingPhoto || photoMessage) && (
              <p className={`mt-2 text-xs ${photoMessage.includes("Errore") ? "text-red-500" : "text-green-500"}`}>
                {uploadingPhoto ? "Caricamento..." : photoMessage}
              </p>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 rounded-full bg-neutral-800 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Cognome</label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full h-10 rounded-full bg-neutral-800 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-neutral-400 mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full h-10 rounded-full bg-neutral-800 px-4 text-sm text-neutral-500 cursor-not-allowed"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Data di nascita</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full h-10 rounded-full bg-neutral-800 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Sesso</label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="w-full h-10 rounded-full bg-neutral-800 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                >
                  <option>Maschio</option>
                  <option>Femmina</option>
                  <option>Altro</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Altezza (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full h-10 rounded-full bg-neutral-800 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Peso (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full h-10 rounded-full bg-neutral-800 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Obiettivo</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full h-10 rounded-full bg-neutral-800 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                >
                  <option>Perdere peso</option>
                  <option>Guadagnare massa muscolare</option>
                  <option>Mantenimento</option>
                  <option>Migliorare resistenza</option>
                </select>
              </div>
            </div>
            
            {message && (
              <p className={`text-sm ${message.includes("Errore") ? "text-red-500" : "text-green-500"}`}>
                {message}
              </p>
            )}
            
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full w-full md:w-auto"
            >
              {saving ? "Salvataggio..." : "Salva modifiche"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}