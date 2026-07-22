"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { signIn, resetPassword } from "@/lib/firebase-auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Errore durante l'accesso");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email) {
      setError("Inserisci la tua email per resettare la password");
      return;
    }
    try {
      await resetPassword(email);
      setError("Email di reset inviata! Controlla la tua casella.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-green-500 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-black">
              <span className="font-bold text-2xl">G</span>
            </div>
            <span className="text-3xl font-bold text-white">GERMANO</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Benvenuto di nuovo!</h1>
          <p className="text-neutral-400">Accedi alla tua piattaforma fitness personale.</p>
        </div>

        <Card className="bg-neutral-900/50 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Accedi al tuo account</CardTitle>
            <CardDescription className="text-neutral-400">
              Usa le tue credenziali per accedere
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Email</label>
                <Input
                  type="email"
                  placeholder="tua@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className={`text-sm ${error.includes("inviata") ? "text-green-500" : "text-red-400"}`}>
                  {error}
                </p>
              )}

              <div className="flex items-center justify-end">
                <button type="button" onClick={handleReset} className="text-sm text-green-500 hover:text-green-400">
                  Hai dimenticato la password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full"
              >
                {loading ? "Accesso in corso..." : "Accedi"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-400">
                Non hai un account?{" "}
                <Link href="/register" className="text-green-500 hover:text-green-400 font-medium">
                  Registrati
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
