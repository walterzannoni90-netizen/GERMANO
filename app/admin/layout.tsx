"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userData, loading, isAdmin, refreshUserData } = useAuth();
  const router = useRouter();
  const [promoting, setPromoting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && userData && !isAdmin && user.email === "ptgermanopoleselli@gmail.com") {
      updateDoc(doc(db, "users", user.uid), { role: "admin" }).then(() => refreshUserData()).catch(() => {});
    }
  }, [user, userData, isAdmin]);

  const handleMakeAdmin = async () => {
    if (!user || promoting) return;
    setPromoting(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { role: "admin" });
      await refreshUserData();
    } catch (e) {
      alert("Errore: non puoi diventare admin. Contatta il supporto.");
    } finally {
      setPromoting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark">
        <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark p-4">
        <div className="text-center max-w-md space-y-6">
          <div className="text-6xl">🔐</div>
          <h1 className="text-3xl font-bold text-white">Accesso Admin</h1>
          <p className="text-neutral-400">
            Non hai i permessi di amministratore.
          </p>
          <p className="text-sm text-neutral-500">
            Se sei il proprietario della piattaforma, clicca il pulsante qui sotto per diventare amministratore.
          </p>
          <Button
            onClick={handleMakeAdmin}
            disabled={promoting}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8"
          >
            {promoting ? "Attivazione..." : "Diventa amministratore"}
          </Button>
          <div>
            <Button variant="ghost" onClick={() => router.push("/dashboard")} className="text-neutral-400">
              Torna alla dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-dark">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
