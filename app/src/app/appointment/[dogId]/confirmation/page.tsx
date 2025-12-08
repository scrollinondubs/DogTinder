"use client";

import { use } from "react";
import Link from "next/link";
import { Check, Calendar, MapPin, ExternalLink } from "lucide-react";
import { dogs } from "@/data/dummy-data";
import { Button } from "@/components/Button";

interface PageProps {
  params: Promise<{ dogId: string }>;
}

export default function ConfirmationPage({ params }: PageProps) {
  const { dogId } = use(params);
  const dog = dogs.find((d) => d.id === dogId) || dogs[0];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-12">
      {/* Success Icon */}
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <Check className="w-12 h-12 text-green-500" strokeWidth={3} />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Appointment Booked!
      </h1>
      <p className="text-gray-500 mb-8">You&apos;re all set to meet {dog.name}</p>

      {/* Details Card */}
      <div className="w-full bg-gray-50 rounded-2xl p-5 mb-8">
        {/* Date & Time */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="font-semibold text-gray-800">Nov 22, 2025 at 10:30 AM</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-semibold text-gray-800">{dog.shelter.name}</p>
            <p className="text-sm text-gray-500">{dog.shelter.address}</p>
          </div>
        </div>

        {/* Dog */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <DogIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Dog</p>
            <p className="font-semibold text-gray-800">
              {dog.name} - {dog.breed}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        <Button fullWidth size="lg">
          <Calendar className="w-5 h-5 mr-2" />
          Add to Calendar
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth size="lg">
            <ExternalLink className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
          <Link href="/swipe" className="flex-1">
            <Button variant="outline" fullWidth size="lg">
              Back to Home
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
