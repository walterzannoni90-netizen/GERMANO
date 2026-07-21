"use client";

import { useState } from "react";
import { Send, Paperclip, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const messages = [
  { id: 1, sender: " Mario Rossi", text: "Ciao Marco! Come stai? Ho visto che hai completato l'allenamento di ieri.", time: "10:30", isMe: false, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80" },
  { id: 2, sender: "Mario Rossi", text: "Ecco il tuo programma settimanale personalizzato. Fai unottima impressione! 👏", time: "10:31", isMe: false, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80" },
  { id: 3, sender: "Me", text: "Grazie mario! Veramente contento dei progressi. Ho anche una domanda sugli esercizi di sabato.", time: "10:35", isMe: true, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80" },
  { id: 4, sender: "Mario Rossi", text: "Certamente! Cosa ti preoccupa? Posso chiarirti ogni dubbio.", time: "10:36", isMe: false, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80" },
];

const currentConversation = {
  name: "Mario Rossi",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
};

export function MessageList() {
  const [message, setMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center gap-4 bg-neutral-900/50">
        <div className="relative">
          <img
            src={currentConversation.image}
            alt={currentConversation.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900"></span>
        </div>
        <div>
          <h3 className="font-semibold text-white">{currentConversation.name}</h3>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.isMe ? "flex-row-reverse" : "flex-row"}`}
          >
            <img
              src={msg.image}
              alt={msg.sender}
              className={`w-10 h-10 rounded-full object-cover ${msg.isMe ? "order-2" : "order-1"}`}
            />
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${msg.isMe ? "bg-green-500 text-white rounded-tr-sm" : "bg-neutral-800 text-white rounded-tl-sm"}`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.isMe ? "text-green-100" : "text-neutral-500"}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-900/50">
        <form onSubmit={handleSend} className="flex gap-3">
          <div className="relative flex-1">
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Scrivi un messaggio..."
              className="bg-neutral-800 border-neutral-700 text-white pr-10"
            />
            <Paperclip className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          </div>
          <Button type="button" variant="ghost" size="icon" className="rounded-full text-neutral-400">
            <Mic size={20} />
          </Button>
          <Button
            type="submit"
            className="rounded-full bg-green-500 hover:bg-green-600 text-white"
          >
            <Send size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
}
