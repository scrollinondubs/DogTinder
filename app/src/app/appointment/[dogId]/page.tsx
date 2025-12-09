"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Textarea } from "@/components/Textarea";
import { cn } from "@/lib/utils";

interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  imageUrl: string;
  shelter: {
    id: string;
    name: string;
  };
}

const timeSlots = [
  "9:00 AM",
  "10:30 AM",
  "12:00 PM",
  "2:00 PM",
  "3:30 PM",
  "5:00 PM",
];

function formatDateToISO(month: Date, day: number): string {
  const date = new Date(month.getFullYear(), month.getMonth(), day);
  return date.toISOString().split("T")[0];
}

export default function AppointmentPage() {
  const params = useParams();
  const dogId = params.dogId as string;
  const router = useRouter();

  const [dog, setDog] = useState<Dog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth());
  });
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch dog data
  useEffect(() => {
    async function fetchDog() {
      try {
        const response = await fetch(`/api/dogs/${dogId}`);
        if (!response.ok) {
          throw new Error("Dog not found");
        }
        const data = await response.json();
        setDog(data); // API returns dog directly, not wrapped
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dog");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDog();
  }, [dogId]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  // Determine which days are in the past
  const today = new Date();
  const isCurrentMonth =
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();
  const isPastMonth =
    currentMonth < new Date(today.getFullYear(), today.getMonth());

  const isDayPast = (day: number) => {
    if (isPastMonth) return true;
    if (isCurrentMonth && day <= today.getDate()) return true;
    return false;
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dogId,
          preferredDate: formatDateToISO(currentMonth, selectedDate),
          preferredTime: selectedTime,
          message: message.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create appointment");
      }

      router.push(`/appointment/${dogId}/confirmation?id=${data.appointment.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !dog) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">{error || "Dog not found"}</p>
        <Link href="/swipe">
          <Button>Back to Swipe</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white px-4 h-14 flex items-center border-b border-gray-100">
        <Link
          href={`/dog/${dog.id}`}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-800 pr-8">
          Book Appointment
        </h1>
      </header>

      <div className="px-4 py-4">
        {/* Dog Info Card */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-6">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#E8D5C4]">
            {dog.imageUrl ? (
              <Image
                src={dog.imageUrl}
                alt={dog.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <DogIcon className="w-6 h-6 text-[#C4A98A]" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Meet {dog.name}</h3>
            <p className="text-gray-500 text-sm">at {dog.shelter.name}</p>
          </div>
        </div>

        {/* Error Display */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {submitError}
          </div>
        )}

        {/* Calendar */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Date</h2>
          <div className="border border-gray-200 rounded-xl p-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                  )
                }
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="font-medium text-gray-800">
                {monthName} {year}
              </span>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                  )
                }
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div
                  key={i}
                  className="text-center text-xs text-gray-400 font-medium py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate === day;
                const isPast = isDayPast(day);
                return (
                  <button
                    key={day}
                    onClick={() => !isPast && setSelectedDate(day)}
                    disabled={isPast}
                    className={cn(
                      "aspect-square flex items-center justify-center text-sm rounded-full transition-colors",
                      isSelected
                        ? "bg-primary text-white"
                        : isPast
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Time</h2>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={cn(
                  "py-3 rounded-lg text-sm font-medium transition-colors border",
                  selectedTime === time
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Message */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Message (Optional)
          </h2>
          <Textarea
            placeholder="Add a message for the shelter..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">
            {message.length}/500
          </p>
        </div>

        {/* Selected Summary */}
        {selectedDate && selectedTime && (
          <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-xl mb-6 border border-primary/20">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">
              Selected: {monthName} {selectedDate}, {year} at {selectedTime}
            </span>
          </div>
        )}

        {/* Confirm Button */}
        <Button
          fullWidth
          size="lg"
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime || isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </span>
          ) : (
            "Confirm Appointment"
          )}
        </Button>
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
