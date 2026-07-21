import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-green-500 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-black">
              <span className="font-bold text-2xl">G</span>
            </div>
            <span className="text-3xl font-bold text-white">GERMANO</span>
          </div>
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
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Nome</label>
                  <Input type="text" placeholder="Mario" />
                </div>
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Cognome</label>
                  <Input type="text" placeholder="Rossi" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Email</label>
                <Input type="email" placeholder="mario.rossi@email.com" />
              </div>
              
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Password</label>
                <Input type="password" placeholder="••••••••" />
                <p className="text-xs text-neutral-500 mt-1">Minimo 8 caratteri</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Conferma password</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-green-500 focus:ring-green-500" />
                  <span className="text-sm text-neutral-400">
                    Accetto i <a href="#" className="text-green-500 hover:text-green-400">Termini di servizio</a> e la <a href="#" className="text-green-500 hover:text-green-400">Privacy Policy</a>
                  </span>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-green-500 focus:ring-green-500" />
                  <span className="text-sm text-neutral-400">
                    voglio ricevere aggiornamenti e offerte speciali
                  </span>
                </label>
              </div>
              
              <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full">
                Registrati
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-400">
                Hai già un account?{" "}
                <a href="/login" className="text-green-500 hover:text-green-400 font-medium">
                  Accedi
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
