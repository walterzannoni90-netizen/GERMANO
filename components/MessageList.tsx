"use client";

import { useState, useEffect } from "react";
import { Send, Paperclip, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMessages, sendMessage, getConversation } from "@/lib/firebase-firestore";
import { useAuth } from "@/contexts/AuthContext";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface MessageListProps {
  conversationId?: string;
}

export function MessageList({ conversationId }: MessageListProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId || !user) return;
    const q = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    getConversation(conversationId).then(setConversation);
    return () => unsub();
  }, [conversationId, user]);

  const otherUser = conversation
    ? {
        name: conversation.participantNames?.[Object.keys(conversation.participantNames || {}).find(
          (id) => id !== user?.uid
        ) || ""] || "Utente",
        image: conversation.participantImages?.[Object.keys(conversation.participantImages || {}).find(
          (id) => id !== user?.uid
        ) || ""] || "",
      }
    : { name: "", image: "" };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || !conversationId) return;
    await sendMessage(conversationId, {
      conversationId,
      senderId: user.uid,
      senderName: user.displayName || user.email || "Utente",
      text: message.trim(),
      read: false,
    });
    setMessage("");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-500">
        Accedi per visualizzare i messaggi.
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-500">
        Seleziona una conversazione
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-neutral-800 flex items-center gap-4 bg-neutral-900/50">
        <div className="relative">
          <img
            src={otherUser.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"}
            alt={otherUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900"></span>
        </div>
        <div>
          <h3 className="font-semibold text-white">{otherUser.name}</h3>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-neutral-800" />
              <div className="h-12 w-48 bg-neutral-800 rounded-2xl" />
            </div>
          ))
        ) : messages.length === 0 ? (
          <div className="text-center text-neutral-500 py-10">
            Nessun messaggio. Inizia una conversazione!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user.uid;
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}
              >
                <img
                  src={otherUser.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"}
                  alt={msg.senderName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    isMe
                      ? "bg-green-500 text-white rounded-tr-sm"
                      : "bg-neutral-800 text-white rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? "text-green-100" : "text-neutral-500"}`}>
                    {msg.createdAt?.toDate?.()?.toLocaleTimeString?.([], { hour: "2-digit", minute: "2-digit" }) || ""}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

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