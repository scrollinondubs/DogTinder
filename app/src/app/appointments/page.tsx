"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";
import { userAppointments } from "@/data/dummy-data";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white px-4 h-14 flex items-center justify-center border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-gray-800">My Appointments</h1>
        </div>
      </header>

      {/* Appointments List */}
      <div className="px-4 py-4 space-y-3">
        {userAppointments.map((appointment) => (
          <Link
            key={appointment.id}
            href={`/dog/${appointment.dog.id}`}
            className="block p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">
                Meet {appointment.dog.name}
              </h3>
              <span
                className={cn(
                  "px-2 py-1 text-xs rounded-full font-medium",
                  appointment.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : appointment.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                )}
              >
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              {appointment.dog.breed} at {appointment.dog.shelter.name}
            </p>
            <div className="flex items-center gap-2 mt-2 text-primary">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">
                {appointment.date} at {appointment.time}
              </span>
            </div>
          </Link>
        ))}

        {userAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No appointments yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Book an appointment to meet a dog!
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
