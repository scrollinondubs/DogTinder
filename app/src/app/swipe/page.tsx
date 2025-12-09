"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Heart, User, Loader2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";

interface Dog {
  id: string;
  name: string;
  age: number;
  breed: string;
  gender: "Male" | "Female";
  description: string;
  imageUrl: string;
  shelter: {
    id: string;
    name: string;
    address: string;
    distance: string;
    imageUrl: string;
  };
  status: "available" | "pending" | "adopted";
}

export default function SwipePage() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/dogs", {
        credentials: "include",
      });
      if (response.status === 401) {
        // Redirect to login if not authenticated
        window.location.href = "/login";
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch dogs");
      }
      const data = await response.json();
      setDogs(data);
      setCurrentIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDogs();
  }, [fetchDogs]);

  const currentDog = dogs[currentIndex];

  const handleSwipe = async (direction: "left" | "right") => {
    if (!currentDog) return;

    setSwipeDirection(direction);

    // Save the swipe to the backend
    try {
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dogId: currentDog.id,
          liked: direction === "right",
        }),
      });
    } catch (err) {
      console.error("Failed to save swipe:", err);
    }

    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex((prev) => prev + 1);
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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-gray-500 mt-4">Finding dogs near you...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchDogs}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        ) : !currentDog ? (
          <div className="flex flex-col items-center justify-center py-20">
            <DogIcon className="w-20 h-20 text-gray-300" />
            <p className="text-gray-500 mt-4 text-center">
              No more dogs to show!
            </p>
            <p className="text-gray-400 text-sm mt-2 text-center">
              Check back later for new furry friends.
            </p>
            <Link
              href="/favorites"
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              View Your Favorites
            </Link>
          </div>
        ) : (
          <>
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
          </>
        )}
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
