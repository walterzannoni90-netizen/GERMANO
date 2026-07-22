"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { signUp } from "@/lib/firebase-auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Le password non coincidono");
      return;
    }
    if (password.length < 8) {
      setError("La password deve essere di almeno 8 caratteri");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name, surname);
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Errore durante la registrazione");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark p-4">
        <Card className="bg-neutral-900/50 border-neutral-800 w-full max-w-md text-center p-8">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-white mb-2">Registrazione completata!</h2>
          <p className="text-neutral-400 mb-6">
            Ti abbiamo inviato un&apos;email di conferma a <strong className="text-white">{email}</strong>.
            Clicca il link nell&apos;email per attivare il tuo account e accedere.
          </p>
          <Link href="/login">
            <Button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-8">
              Vai al login
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-purple-500 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-black">
              <span className="font-bold text-2xl">G</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Inizia il tuo viaggio!</h1>
          <p className="text-neutral-400">Crea il tuo account e raggiungi i tuoi obiettivi fitness.</p>
        </div>

        <Card className="bg-neutral-900/50 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Crea il tuo account</CardTitle>
            <CardDescription className="text-neutral-400">
              Compila i dati per iniziare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Nome</label>
                  <Input type="text" placeholder="Mario" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Cognome</label>
                  <Input type="text" placeholder="Rossi" value={surname} onChange={(e) => setSurname(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Email</label>
                <Input type="email" placeholder="mario.rossi@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Password</label>
                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <p className="text-xs text-neutral-500 mt-1">Minimo 8 caratteri</p>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Conferma password</label>
                <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="space-y-2">
                <p className="text-xs text-neutral-500">
                  Registrandoti accetti i Termini di Servizio e la Privacy Policy di Germano Poleselli.
                </p>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-full">
                {loading ? "Registrazione in corso..." : "Registrati"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-400">
                Hai già un account?{" "}
                <Link href="/login" className="text-purple-500 hover:text-purple-400 font-medium">
                  Accedi
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
