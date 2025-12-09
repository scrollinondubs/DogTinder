"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, Heart, User, Loader2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { SwipeCard, SwipeCardHandle } from "@/components/SwipeCard";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<SwipeCardHandle>(null);

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
  const nextDog = dogs[currentIndex + 1];

  const handleSwipe = async (direction: "left" | "right") => {
    if (!currentDog) return;

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

    // Move to next card
    setCurrentIndex((prev) => prev + 1);
  };

  // Button handlers that trigger programmatic swipes
  const handleButtonSwipe = (direction: "left" | "right") => {
    cardRef.current?.swipe(direction);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white px-4 h-14 flex items-center justify-between border-b border-gray-100">
        <Link href="/swipe" className="flex items-center">
          <Image
            src="/logo.png"
            alt="SwipeDog"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
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
            {/* Card Stack Container - height needs to fit image (3:4 aspect) + info section (~130px) */}
            <div className="relative" style={{ height: "calc((100vw - 32px) * 4 / 3 + 130px)", maxHeight: "680px" }}>
              {/* Next card (background) - rendered first, behind the current card */}
              {nextDog && (
                <SwipeCard
                  key={`next-${nextDog.id}`}
                  dog={nextDog}
                  onSwipe={() => {}}
                  active={false}
                />
              )}

              {/* Current card (foreground) - rendered last, on top */}
              <AnimatePresence mode="wait">
                <SwipeCard
                  key={currentDog.id}
                  ref={cardRef}
                  dog={currentDog}
                  onSwipe={handleSwipe}
                  active={true}
                />
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-8 mt-4">
              <button
                onClick={() => handleButtonSwipe("left")}
                className="w-16 h-16 rounded-full border-2 border-red-300 flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <button
                onClick={() => handleButtonSwipe("right")}
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
