"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Loader2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  preferredDate: string;
  preferredTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  dog: {
    id: string;
    name: string;
    breed: string;
    imageUrl: string;
  };
  shelter: {
    id: string;
    name: string;
    address: string;
  };
}

function formatDateForDisplay(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-gray-100 text-gray-700",
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await fetch("/api/appointments");
        if (!response.ok) {
          throw new Error("Failed to load appointments");
        }
        const data = await response.json();
        setAppointments(data.appointments);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white px-4 h-14 flex items-center justify-center border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-gray-800">My Appointments</h1>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary text-sm underline"
            >
              Try again
            </button>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No appointments yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Book an appointment to meet a dog!
            </p>
            <Link
              href="/swipe"
              className="inline-block mt-4 text-primary font-medium text-sm"
            >
              Browse Dogs
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <Link
                key={appointment.id}
                href={`/dog/${appointment.dog.id}`}
                className="block p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex gap-3">
                  {/* Dog Image */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {appointment.dog.imageUrl ? (
                      <Image
                        src={appointment.dog.imageUrl}
                        alt={appointment.dog.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <DogIcon className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800 truncate">
                        Meet {appointment.dog.name}
                      </h3>
                      <span
                        className={cn(
                          "px-2 py-1 text-xs rounded-full font-medium capitalize flex-shrink-0 ml-2",
                          statusStyles[appointment.status]
                        )}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm truncate">
                      {appointment.dog.breed} at {appointment.shelter.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-primary">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        {formatDateForDisplay(appointment.preferredDate)} at{" "}
                        {appointment.preferredTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
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
