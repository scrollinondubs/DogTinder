"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { conversations } from "@/data/dummy-data";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white px-4 h-14 flex items-center justify-center border-b border-gray-100">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-gray-800">Messages</h1>
        </div>
      </header>

      {/* Conversations List */}
      <div className="divide-y divide-gray-100">
        {conversations.map((conversation) => (
          <Link
            key={conversation.id}
            href={`/messages/${conversation.id}/chat`}
            className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            {/* Avatar */}
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-primary/10">
              <Image
                src={conversation.shelter.imageUrl}
                alt={conversation.shelter.name}
                fill
                className="object-cover"
                sizes="56px"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <PawIcon className="w-6 h-6 text-primary/30" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 truncate">
                  {conversation.shelter.name}
                </h3>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {conversation.lastMessageTime}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate mt-0.5">
                Re: {conversation.dog.name}
              </p>
              <p className="text-sm text-gray-400 truncate">
                {conversation.messages[conversation.messages.length - 1].content}
              </p>
            </div>

            {/* Unread Badge */}
            {conversation.unreadCount > 0 && (
              <div className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                {conversation.unreadCount}
              </div>
            )}
          </Link>
        ))}

        {conversations.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No messages yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Start a conversation with a shelter!
            </p>
          </div>
        )}
      </div>

      <BottomNav />
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
