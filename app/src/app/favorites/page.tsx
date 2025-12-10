"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ChevronRight, Loader2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { getAnonymousLikedDogs } from "@/lib/anonymous-swipes";

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

export default function FavoritesPage() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoadingSession = status === "loading";

  const [likedDogs, setLikedDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLikedDogs() {
      try {
        if (isAuthenticated) {
          // Authenticated: fetch from API
          const response = await fetch("/api/likes");
          if (response.ok) {
            const data = await response.json();
            setLikedDogs(data);
          }
        } else {
          // Anonymous: get from localStorage and fetch dog details
          const anonymousLikes = getAnonymousLikedDogs();

          if (anonymousLikes.length === 0) {
            setLikedDogs([]);
            return;
          }

          // Fetch dog details for liked dogs
          const dogPromises = anonymousLikes.map((like) =>
            fetch(`/api/dogs/${like.dogId}`)
              .then((res) => (res.ok ? res.json() : null))
              .catch(() => null)
          );

          const dogs = await Promise.all(dogPromises);
          setLikedDogs(dogs.filter(Boolean));
        }
      } catch (err) {
        console.error("Failed to fetch liked dogs:", err);
      } finally {
        setIsLoading(false);
      }
    }

    // Wait for session check before fetching
    if (!isLoadingSession) {
      fetchLikedDogs();
    }
  }, [isAuthenticated, isLoadingSession]);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white px-4 h-14 flex items-center justify-center border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-gray-800">My Favorites</h1>
        </div>
      </header>

      {/* Anonymous user notice */}
      {!isAuthenticated && !isLoadingSession && likedDogs.length > 0 && (
        <div className="mx-4 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Your favorites are saved locally.
            <Link href="/login" className="font-medium underline ml-1">
              Sign in
            </Link>{" "}
            to save them permanently.
          </p>
        </div>
      )}

      {/* Dog List */}
      <div className="px-4 py-4 space-y-3">
        {isLoading || isLoadingSession ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-gray-500 mt-3">Loading favorites...</p>
          </div>
        ) : likedDogs.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No favorites yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Swipe right on dogs you like!
            </p>
            <Link
              href="/swipe"
              className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Start Swiping
            </Link>
          </div>
        ) : (
          likedDogs.map((dog) => (
            <Link
              key={dog.id}
              href={`/dog/${dog.id}`}
              className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#E8D5C4] flex-shrink-0">
                {dog.imageUrl ? (
                  <Image
                    src={dog.imageUrl}
                    alt={dog.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <DogIcon className="w-8 h-8 text-[#C4A98A]" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800">
                  {dog.name}, {dog.age} yrs
                </h3>
                <p className="text-gray-600 text-sm">{dog.breed}</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {dog.shelter.name}
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
            </Link>
          ))
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
