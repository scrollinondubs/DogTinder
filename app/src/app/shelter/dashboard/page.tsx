"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Clock } from "lucide-react";
import { dogs, appointments, shelterStats, shelters } from "@/data/dummy-data";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

export default function ShelterDashboardPage() {
  const shelter = shelters[0]; // Happy Paws Shelter
  const shelterDogs = dogs.filter((d) => d.shelter.id === shelter.id);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-primary text-white px-4 py-6">
        <h1 className="text-2xl font-bold">{shelter.name}</h1>
        <p className="text-primary-light text-sm">Shelter Dashboard</p>

        {/* Stats */}
        <div className="flex gap-3 mt-4">
          <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{shelterStats.totalDogs}</p>
            <p className="text-xs text-primary-light">Dogs</p>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{shelterStats.totalAppointments}</p>
            <p className="text-xs text-primary-light">Appts</p>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{shelterStats.unreadMessages}</p>
            <p className="text-xs text-primary-light">Messages</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-4">
        {/* Your Dogs Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Your Dogs</h2>
            <Link href="/shelter/dogs" className="text-sm text-primary font-medium">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {shelterDogs.slice(0, 2).map((dog) => (
              <Link
                key={dog.id}
                href={`/shelter/dogs/${dog.id}`}
                className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#E8D5C4]">
                  <Image
                    src={dog.imageUrl}
                    alt={dog.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <DogIcon className="w-6 h-6 text-[#C4A98A] opacity-50" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{dog.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {dog.breed} • {dog.age} yrs
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={cn(
                    "px-2 py-1 text-xs rounded-full font-medium",
                    dog.status === "available"
                      ? "bg-green-100 text-green-700"
                      : dog.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  {dog.status === "available" ? "Active" : dog.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Upcoming Appointments
            </h2>
            <Link
              href="/shelter/appointments"
              className="text-sm text-primary font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {appointments.slice(0, 2).map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 bg-white border border-gray-100 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {appointment.userName}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Meeting {appointment.dog.name} • {appointment.date}{" "}
                      {appointment.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Dog Button */}
        <Link href="/shelter/dogs/new">
          <Button fullWidth size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add New Dog
          </Button>
        </Link>
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
