"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserConversations, subscribeToConversations } from "@/lib/firebase-firestore";
import { useAuth } from "@/contexts/AuthContext";

interface MessageSidebarProps {
  onSelectConversation?: (id: string) => void;
}

export function MessageSidebar({ onSelectConversation }: MessageSidebarProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToConversations(user.uid, (convs) => {
      setConversations(convs);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  if (!user) return null;

  const otherParticipant = (conv: any) => {
    const id = conv.participants?.find((p: string) => p !== user.uid) || "";
    return {
      name: conv.participantNames?.[id] || "Utente",
      image: conv.participantImages?.[id] || "",
    };
  };

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
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-neutral-800" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-24 bg-neutral-800 rounded" />
                <div className="h-3 w-40 bg-neutral-800 rounded" />
              </div>
            </div>
          ))
        ) : conversations.length === 0 ? (
          <div className="text-center text-neutral-500 py-8 text-sm">
            Nessuna conversazione
          </div>
        ) : (
          conversations.map((conv) => {
            const other = otherParticipant(conv);
            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation?.(conv.id)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-800/50 cursor-pointer transition-colors"
              >
                <div className="relative">
                  <img
                    src={other.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"}
                    alt={other.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {(conv.unreadCount?.[user.uid] || 0) > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                      {conv.unreadCount?.[user.uid]}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate">{other.name}</h4>
                  <p className="text-sm text-neutral-400 truncate">{conv.lastMessage}</p>
                </div>
                <span className="text-xs text-neutral-500 whitespace-nowrap">
                  {conv.lastMessageTime?.toDate?.()?.toLocaleTimeString?.([], { hour: "2-digit", minute: "2-digit" }) || ""}
                </span>
              </div>
            );
          })
        )}
      </div>
      
      <div className="p-4 border-t border-neutral-800">
        <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={() => alert("Seleziona un utente dalla lista per iniziare una conversazione.")}>
          Nuova conversazione
        </Button>
      </div>
    </div>
  );
}