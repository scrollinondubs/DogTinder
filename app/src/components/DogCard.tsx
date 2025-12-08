"use client";

import Image from "next/image";
import { Dog } from "@/data/dummy-data";
import { cn } from "@/lib/utils";

interface DogCardProps {
  dog: Dog;
  className?: string;
  showFullInfo?: boolean;
}

export function DogCard({ dog, className, showFullInfo = false }: DogCardProps) {
  return (
    <div
      className={cn(
        "relative bg-white rounded-2xl overflow-hidden shadow-lg",
        className
      )}
    >
      {/* Image */}
      <div className="relative w-full aspect-[3/4] bg-[#E8D5C4]">
        <Image
          src={dog.imageUrl}
          alt={dog.name}
          fill
          className="object-cover"
          sizes="(max-width: 430px) 100vw, 430px"
        />
        {/* Dog icon placeholder overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <DogIcon className="w-16 h-16 text-[#C4A98A] opacity-50" />
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-2xl font-bold text-gray-800">
          {dog.name}, {dog.age} yrs
        </h3>
        <p className="text-gray-600 font-medium">{dog.breed}</p>
        <p className="text-gray-400 text-sm mt-1">
          {dog.shelter.name} • {dog.shelter.distance}
        </p>
        {showFullInfo && (
          <p className="text-gray-500 text-sm mt-2 line-clamp-2">
            {dog.description}
          </p>
        )}
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
