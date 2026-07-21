import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function UserProfile() {
  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Informazioni personali</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80"
              alt="Marco Rossi"
              className="w-32 h-32 rounded-full object-cover"
            />
            <Button
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full bg-green-500 hover:bg-green-600 text-white h-8 w-8 p-0"
            >
              📷
            </Button>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Nome</label>
                <input
                  type="text"
                  defaultValue="Marco"
                  className="w-full h-10 rounded-full bg-neutral-800 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Cognome</label>
                <input
                  type="text"
                  defaultValue="Rossi"
                  className="w-full h-10 rounded-full bg-neutral-800 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-neutral-400 mb-1 block">Email</label>
              <input
                type="email"
                defaultValue="marco.rossi@email.com"
                className="w-full h-10 rounded-full bg-neutral-800 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Data di nascita</label>
                <input
                  type="date"
                  defaultValue="1990-05-15"
                  className="w-full h-10 rounded-full bg-neutral-800 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Sesso</label>
                <select className="w-full h-10 rounded-full bg-neutral-800 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900">
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
                  defaultValue="180"
                  className="w-full h-10 rounded-full bg-neutral-800 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Peso (kg)</label>
                <input
                  type="number"
                  defaultValue="78.5"
                  className="w-full h-10 rounded-full bg-neutral-800 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Obiettivo</label>
                <select className="w-full h-10 rounded-full bg-neutral-800 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900">
                  <option>Perdere peso</option>
                  <option>Guadagnare massa muscolare</option>
                  <option>Mantenimento</option>
                  <option>Migliorare resistenza</option>
                </select>
              </div>
            </div>
            
            <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full w-full md:w-auto">
              Salva modifiche
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
