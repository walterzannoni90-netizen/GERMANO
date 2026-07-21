"use client";

import { useState } from "react";
import { MessageList } from "@/components/MessageList";
import { MessageSidebar } from "@/components/MessageSidebar";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | undefined>();

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-80 lg:w-96 bg-neutral-900/50 border border-neutral-800 rounded-2xl flex flex-col overflow-hidden">
        <MessageSidebar onSelectConversation={setSelectedConversation} />
      </div>
      <div className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded-2xl flex flex-col overflow-hidden">
        <MessageList conversationId={selectedConversation} />
      </div>
    </div>
  );
}