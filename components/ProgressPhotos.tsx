import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProgressPhotos() {
  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Galleria fotografica progressi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group">
            <div className="aspect-video bg-neutral-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <span className="block text-4xl mb-2">📸</span>
                  <span className="text-sm text-neutral-400">Aggiungi foto</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
              <Button variant="secondary" className="rounded-full bg-white text-black hover:bg-neutral-200">
                Carica foto
              </Button>
            </div>
          </div>
          
          <div className="relative group">
            <img
              src="https://images.unsplash.com/photo-1627133755109-5649232a439a?q=80&w=2070&auto=format&fit=crop"
              alt="Prima misurazione"
              className="aspect-video object-cover rounded-xl"
            />
            <div className="absolute top-3 right-3">
              <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">Prima</span>
            </div>
            <div className="absolute bottom-3 left-3">
              <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">21/06/2026</span>
            </div>
          </div>
          
          <div className="relative group">
            <img
              src="https://images.unsplash.com/photo-1599351431202-594586577936?q=80&w=2070&auto=format&fit=crop"
              alt="Ultima misurazione"
              className="aspect-video object-cover rounded-xl"
            />
            <div className="absolute top-3 right-3">
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Ultima</span>
            </div>
            <div className="absolute bottom-3 left-3">
              <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">21/07/2026</span>
            </div>
          </div>
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
