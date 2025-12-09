"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Calendar, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";

interface Appointment {
  id: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  dog: {
    id: string;
    name: string;
    breed: string;
    age: number;
    gender: string;
  };
  shelter: {
    id: string;
    name: string;
    address: string;
    phone: string | null;
  };
}

function formatDateForDisplay(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("id");

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAppointment() {
      if (!appointmentId) {
        setError("No appointment ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/appointments/${appointmentId}`);
        if (!response.ok) {
          throw new Error("Appointment not found");
        }
        const data = await response.json();
        setAppointment(data.appointment);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load appointment");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAppointment();
  }, [appointmentId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">{error || "Appointment not found"}</p>
        <Link href="/swipe">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-12">
      {/* Success Icon */}
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <Check className="w-12 h-12 text-green-500" strokeWidth={3} />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Appointment Requested!
      </h1>
      <p className="text-gray-500 mb-8 text-center">
        Your request to meet {appointment.dog.name} has been submitted.
        <br />
        The shelter will confirm your appointment soon.
      </p>

      {/* Details Card */}
      <div className="w-full bg-gray-50 rounded-2xl p-5 mb-8">
        {/* Date & Time */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Requested Date & Time</p>
            <p className="font-semibold text-gray-800">
              {formatDateForDisplay(appointment.preferredDate)} at{" "}
              {appointment.preferredTime}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-semibold text-gray-800">{appointment.shelter.name}</p>
            <p className="text-sm text-gray-500">{appointment.shelter.address}</p>
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
              {appointment.dog.name} - {appointment.dog.breed}
            </p>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-sm text-yellow-700 font-medium">
            Status: Pending Confirmation
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        <Link href="/appointments" className="block">
          <Button fullWidth size="lg">
            View My Appointments
          </Button>
        </Link>
        <Link href="/swipe" className="block">
          <Button variant="outline" fullWidth size="lg">
            Back to Home
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
