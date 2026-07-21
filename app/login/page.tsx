import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
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
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Email</label>
                <Input type="email" placeholder="tua@email.com" />
              </div>
              
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Password</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-green-500 focus:ring-green-500" />
                  <label htmlFor="remember" className="ml-2 text-sm text-neutral-400">Ricordami</label>
                </div>
                <a href="#" className="text-sm text-green-500 hover:text-green-400">Hai dimenticato la password?</a>
              </div>
              
              <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full">
                Accedi
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-400">
                Non hai un account?{" "}
                <a href="/register" className="text-green-500 hover:text-green-400 font-medium">
                  Registrati
                </a>
              </p>
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-dark px-2 text-neutral-500">O continua con</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800 rounded-full">
                  Google
                </Button>
                <Button variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800 rounded-full">
                  Apple
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
