import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const notifications = [
  { id: 1, type: "appointment", title: "Domani alle 09:30", description: "Allenamento Full Body HIIT con Mario Rossi", time: "Oggi, 18:00", read: false, icon: "📅", color: "border-l-green-500" },
  { id: 2, type: "payment", title: "Pagamento completato", description: "Ricevuta per consulenza con Dr. Mario Rossi", time: "Ieri, 14:30", read: true, icon: "💳", color: "border-l-blue-500" },
  { id: 3, type: "message", title: "Nuova risposta", description: "Mario Rossi ha risposto al tuo messaggio", time: "Ieri, 10:15", read: false, icon: "💬", color: "border-l-purple-500" },
  { id: 4, type: "progress", title: "Progresso settimanale", description: "Hai completato 4 allenamenti su 7 questa settimana", time: "Lunedì, 08:00", read: true, icon: "📊", color: "border-l-orange-500" },
  { id: 5, type: "reminder", title: "Promemoria pagamento", description: "Il tuo abbonamento Premium scade fra 3 giorni", time: "Domenica, 22:00", read: true, icon: "🔔", color: "border-l-pink-500" },
];

export function NotificationsList() {
  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Tutte le notifiche</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex gap-4 p-4 rounded-xl transition-colors ${notification.read ? "bg-neutral-800/30 hover:bg-neutral-800/50" : "bg-green-500/5 hover:bg-green-500/10"} ${notification.color} border-l-4`}
          >
            <div className={`text-2xl ${notification.read ? "text-neutral-500" : "text-green-500"}`}>
              {notification.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-white">{notification.title}</h4>
                <span className="text-xs text-neutral-500">{notification.time}</span>
              </div>
              <p className="text-sm text-neutral-400">{notification.description}</p>
            </div>
            {!notification.read && (
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
