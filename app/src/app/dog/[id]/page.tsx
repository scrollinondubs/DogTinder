"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Heart, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";

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

export default function DogDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [dog, setDog] = useState<Dog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDog() {
      try {
        const response = await fetch(`/api/dogs/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Dog not found");
          } else {
            throw new Error("Failed to fetch dog");
          }
          return;
        }
        const data = await response.json();
        setDog(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDog();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 mt-4">Loading dog profile...</p>
      </div>
    );
  }

  if (error || !dog) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <DogIcon className="w-20 h-20 text-gray-300" />
        <p className="text-gray-500 mt-4">{error || "Dog not found"}</p>
        <Link
          href="/swipe"
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Back to Swipe
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative w-full aspect-[4/3] bg-[#E8D5C4]">
        <Image
          src={dog.imageUrl}
          alt={dog.name}
          fill
          className="object-cover"
          sizes="(max-width: 430px) 100vw, 430px"
          priority
        />
        {/* Dog icon placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <DogIcon className="w-24 h-24 text-[#C4A98A] opacity-40" />
        </div>

        {/* Back Button */}
        <Link
          href="/swipe"
          className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>

        {/* Heart Button */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center">
          <Heart className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Name and basic info */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            {dog.name}
            <span className="text-xl font-normal text-gray-500 ml-1">
              {dog.age} years old
            </span>
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            {dog.breed} • {dog.gender}
          </p>
          <div className="flex items-center text-gray-400 mt-2">
            <MapPin className="w-4 h-4 mr-1 text-primary" />
            <span className="text-sm">
              {dog.shelter.name} • {dog.shelter.distance} away
            </span>
          </div>
        </div>

        {/* About section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">About</h2>
          <p className="text-gray-600 leading-relaxed">{dog.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href={`/appointment/${dog.id}`}>
            <Button fullWidth size="lg">
              Book an Appointment
            </Button>
          </Link>
          <Link href={`/messages/${dog.shelter.id}`}>
            <Button variant="outline" fullWidth size="lg">
              Message Shelter
            </Button>
          </Link>
        </div>
      </div>
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
