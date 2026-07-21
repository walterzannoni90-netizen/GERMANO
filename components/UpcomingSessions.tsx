import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sessions = [
  { title: "Full Body HIIT", trainer: "Mario Rossi", date: "Domani, 09:30", duration: "45 min", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" },
  { title: "Yoga Serale", trainer: "Giulia Bianchi", date: "Mercoledì, 19:00", duration: "60 min", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop" },
  { title: "Consulenza Nutrizione", trainer: "Dr. Maria Verdi", date: "Giovedì, 14:00", duration: "30 min", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop" },
];

export function UpcomingSessions() {
  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Prossimi appuntamenti</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.map((session, index) => (
          <div key={index} className="flex gap-3 p-3 rounded-xl hover:bg-neutral-800/50 transition-colors">
            <img src={session.image} alt={session.title} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1">
              <h4 className="font-semibold text-white text-sm">{session.title}</h4>
              <p className="text-xs text-neutral-400 mb-1">{session.trainer}</p>
              <div className="flex items-center gap-2 text-xs text-green-500">
                <span>{session.date}</span>
                <span>•</span>
                <span>{session.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
