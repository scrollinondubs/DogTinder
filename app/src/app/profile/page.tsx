"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Settings, LogOut, Heart, Calendar, MessageCircle, ChevronRight, Bell, Shield, HelpCircle } from "lucide-react";
import { Button } from "@/components/Button";
import { signOut, useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState(true);

  const user = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    imageUrl: session?.user?.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    joinedDate: "November 2024",
    stats: {
      liked: 0,
      appointments: 0,
      messages: 0,
    },
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white px-4 h-14 flex items-center justify-between border-b border-gray-100">
        <Link
          href="/swipe"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-lg font-semibold text-gray-800">Profile</h1>
        <Link
          href="/settings"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </Link>
      </header>

      {/* Profile Card */}
      <div className="bg-white px-6 py-6 mb-3">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-primary/10">
            <Image
              src={user.imageUrl}
              alt={user.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <p className="text-gray-400 text-xs mt-1">
              Member since {user.joinedDate}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-6">
          <Link href="/favorites" className="flex-1 bg-gray-50 rounded-xl p-3 text-center hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Heart className="w-4 h-4" />
              <span className="text-xl font-bold">{user.stats.liked}</span>
            </div>
            <p className="text-xs text-gray-500">Liked</p>
          </Link>
          <Link href="/appointments" className="flex-1 bg-gray-50 rounded-xl p-3 text-center hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xl font-bold">{user.stats.appointments}</span>
            </div>
            <p className="text-xs text-gray-500">Appointments</p>
          </Link>
          <Link href="/messages" className="flex-1 bg-gray-50 rounded-xl p-3 text-center hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xl font-bold">{user.stats.messages}</span>
            </div>
            <p className="text-xs text-gray-500">Messages</p>
          </Link>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="bg-white mb-3">
        <h3 className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Preferences
        </h3>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <span className="text-gray-800">Notifications</span>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-7 rounded-full transition-colors ${
              notifications ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                notifications ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Privacy */}
        <Link href="/privacy" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-gray-800">Privacy Settings</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </Link>
      </div>

      {/* Support Section */}
      <div className="bg-white mb-3">
        <h3 className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Support
        </h3>

        <Link href="/help" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-gray-800">Help Center</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </Link>
      </div>

      {/* Shelter Admin Link */}
      <div className="bg-white mb-3">
        <Link href="/shelter/dashboard" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <PawIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="text-gray-800 block">Shelter Dashboard</span>
              <span className="text-xs text-gray-400">For shelter administrators</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </Link>
      </div>

      {/* Logout Button */}
      <div className="px-6 py-4">
        <Button
          variant="outline"
          fullWidth
          className="text-red-500 border-red-200 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* App Version */}
      <p className="text-center text-xs text-gray-400 pb-6">
        Dog Tinder v1.0.0
      </p>
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
