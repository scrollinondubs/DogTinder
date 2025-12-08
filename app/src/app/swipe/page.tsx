"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Heart, User } from "lucide-react";
import { dogs } from "@/data/dummy-data";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";

export default function SwipePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

  const currentDog = dogs[currentIndex];

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction);
    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex((prev) => (prev + 1) % dogs.length);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white px-4 h-14 flex items-center justify-between border-b border-gray-100">
        <Link href="/swipe" className="flex items-center gap-2">
          <PawPrint className="w-6 h-6 text-primary" />
          <span className="text-lg font-semibold text-primary">Dog Tinder</span>
        </Link>
        <Link
          href="/profile"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <User className="w-5 h-5 text-gray-600" />
        </Link>
      </header>

      {/* Swipe Card */}
      <div className="px-4 pt-4">
        <div
          className={cn(
            "relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ease-out",
            swipeDirection === "left" && "-translate-x-[120%] rotate-[-20deg] opacity-0",
            swipeDirection === "right" && "translate-x-[120%] rotate-[20deg] opacity-0"
          )}
        >
          {/* Image */}
          <Link href={`/dog/${currentDog.id}`}>
            <div className="relative w-full aspect-[3/4] bg-[#E8D5C4]">
              <Image
                src={currentDog.imageUrl}
                alt={currentDog.name}
                fill
                className="object-cover"
                sizes="(max-width: 430px) 100vw, 430px"
                priority
              />
              {/* Dog icon placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <DogIcon className="w-20 h-20 text-[#C4A98A] opacity-40" />
              </div>
            </div>
          </Link>

          {/* Info */}
          <div className="p-4">
            <h3 className="text-2xl font-bold text-gray-800">
              {currentDog.name}, {currentDog.age} yrs
            </h3>
            <p className="text-gray-600 font-medium">{currentDog.breed}</p>
            <p className="text-gray-400 text-sm mt-1">
              {currentDog.shelter.name} • {currentDog.shelter.distance}
            </p>
            <p className="text-gray-500 text-sm mt-2 line-clamp-2">
              {currentDog.description.split(".")[0]}.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-8 mt-6">
          <button
            onClick={() => handleSwipe("left")}
            className="w-16 h-16 rounded-full border-2 border-red-300 flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={() => handleSwipe("right")}
            className="w-16 h-16 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors"
          >
            <Heart className="w-8 h-8" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function PawPrint({ className }: { className?: string }) {
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

function DogIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
      <circle cx="24" cy="20" r="4" />
      <circle cx="40" cy="20" r="4" />
      <ellipse cx="32" cy="38" rx="12" ry="10" />
      <circle cx="28" cy="36" r="2" fill="white" />
      <circle cx="36" cy="36" r="2" fill="white" />
      <ellipse cx="32" cy="42" rx="3" ry="2" />
    </svg>
  );
}
