import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const activities = [
  { title: "Allenamento completato", description: "Full Body HIIT - Mario Rossi", time: "Oggi, 09:30", icon: "🏆", color: "text-green-500" },
  { title: "Nuova misurazione", description: "Peso: 78.5kg -3.2kg dal mese scorso", time: "Oggi, 08:15", icon: "⚖️", color: "text-blue-500" },
  { title: "Consulenza prenotata", description: "Con Maria Verdi - Nutrizione", time: "Domani, 14:00", icon: "📅", color: "text-orange-500" },
  { title: "Messaggio ricevuto", description: "Nuova risposta da Mario Rossi", time: "Ieri, 18:45", icon: "💬", color: "text-purple-500" },
];

export function RecentActivities() {
  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Attività recenti</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-neutral-800/50 transition-colors">
            <div className={`text-2xl ${activity.color}`}>{activity.icon}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-white">{activity.title}</h4>
              <p className="text-sm text-neutral-400">{activity.description}</p>
            </div>
            <span className="text-xs text-neutral-500 whitespace-nowrap">{activity.time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
