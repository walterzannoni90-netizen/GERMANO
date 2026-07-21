import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, File, Image as ImageIcon } from "lucide-react";

const documents = [
  { id: 1, name: "Programma Full Body HIIT", type: "PDF", date: "20/07/2026", size: "2.4 MB", icon: "📄" },
  { id: 2, name: "Referto analisi sangue", type: "PDF", date: "15/07/2026", size: "1.8 MB", icon: "📄" },
  { id: 3, name: "Foto corpo frontale", type: "JPG", date: "21/07/2026", size: "4.2 MB", icon: "🖼️" },
  { id: 4, name: "Consenso trattamento dati", type: "PDF", date: "10/07/2026", size: "1.1 MB", icon: "📄" },
  { id: 5, name: "Programma Yoga", type: "PDF", date: "01/07/2026", size: "3.1 MB", icon: "📄" },
  { id: 6, name: "Foto corpo laterale", type: "JPG", date: "15/06/2026", size: "3.8 MB", icon: "🖼️" },
];

export function DocumentsList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Documenti</h2>
        <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full">
          + Carica documento
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="bg-neutral-900/50 border-neutral-800 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{doc.icon}</span>
                <span className="text-xs font-semibold text-neutral-500 bg-neutral-800 px-2 py-1 rounded-full">
                  {doc.type}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold text-white mb-2">{doc.name}</h4>
              <div className="flex items-center justify-between text-sm text-neutral-400">
                <span>{doc.date}</span>
                <span>{doc.size}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="border-neutral-600 text-xs rounded-full hover:bg-neutral-800 flex-1">
                  <Download size={14} className="mr-1" /> Scarica
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-neutral-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
