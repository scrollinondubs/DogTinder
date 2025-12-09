"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { conversations } from "@/data/dummy-data";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const params = useParams();
  const id = params.id as string;
  const conversation = conversations.find((c) => c.id === id) || conversations[0];
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      // In real app, would send message to API
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white px-4 h-16 flex items-center gap-3 border-b border-gray-100">
        <Link
          href="/messages"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>

        {/* Shelter Avatar */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary/10">
          <Image
            src={conversation.shelter.imageUrl}
            alt={conversation.shelter.name}
            fill
            className="object-cover"
            sizes="40px"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <PawIcon className="w-5 h-5 text-primary/30" />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="font-semibold text-gray-800">
            {conversation.shelter.name}
          </h1>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {conversation.messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex flex-col",
              message.isFromUser ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] px-4 py-3 rounded-2xl",
                message.isFromUser
                  ? "bg-primary text-white rounded-br-md"
                  : "bg-gray-100 text-gray-800 rounded-bl-md"
              )}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
            <span className="text-xs text-gray-400 mt-1 px-1">
              {message.timestamp}
            </span>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={handleSend}
            className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
      <ellipse cx="32" cy="44" rx="14" ry="12" />
      <circle cx="20" cy="28" r="6" />
      <circle cx="44" cy="28" r="6" />
      <circle cx="14" cy="38" r="5" />
      <circle cx="50" cy="38" r="5" />
    </svg>
  );
}
