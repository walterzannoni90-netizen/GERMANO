import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const conversations = [
  { id: 1, name: "Mario Rossi", lastMessage: "Ecco il tuo programma settimanale", time: "10:30", unread: 2, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80" },
  { id: 2, name: "Giulia Bianchi", lastMessage: "A che ora è la tua prossima lezione?", time: "09:15", unread: 0, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80" },
  { id: 3, name: "Dr. Luca Verdi", lastMessage: "Hai ricevuto i tuoi report", time: "Ieri", unread: 1, image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=80" },
  { id: 4, name: "Sofia Romano", lastMessage: "Nuovo messaggio automatico", time: "Ieri", unread: 0, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80" },
  { id: 5, name: "Team Germano", lastMessage: "Promemoria: Allenamento del giorno", time: "2 giorni", unread: 3, image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80" },
];

export function MessageSidebar() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-neutral-800">
        <h2 className="text-xl font-bold text-white mb-4">Messaggi</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Cerca conversazione..."
            className="w-full h-10 rounded-full bg-neutral-800 px-4 pr-10 text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-800/50 cursor-pointer transition-colors"
          >
            <div className="relative">
              <img
                src={conversation.image}
                alt={conversation.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {conversation.unread > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {conversation.unread}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white truncate">{conversation.name}</h4>
              <p className="text-sm text-neutral-400 truncate">{conversation.lastMessage}</p>
            </div>
            <span className="text-xs text-neutral-500 whitespace-nowrap">{conversation.time}</span>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-neutral-800">
        <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
          Nuova conversazione
        </Button>
      </div>
    </div>
  );
}
