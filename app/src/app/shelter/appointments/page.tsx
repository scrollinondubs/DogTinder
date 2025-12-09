import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, Calendar, Clock, User, Mail, MessageSquare } from "lucide-react";
import { db } from "@/db";
import { appointmentRequests, users, dogs, dogImages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getShelterForAdmin, isAuthError } from "@/lib/shelter-auth";
import { cn } from "@/lib/utils";
import { AppointmentActions } from "./AppointmentActions";

export default async function ShelterAppointmentsPage() {
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    redirect("/login");
  }

  const { shelter } = result;

  // Get all appointments with user and dog info
  const appointments = await db
    .select({
      id: appointmentRequests.id,
      preferredDate: appointmentRequests.preferredDate,
      preferredTime: appointmentRequests.preferredTime,
      message: appointmentRequests.message,
      status: appointmentRequests.status,
      createdAt: appointmentRequests.createdAt,
      userName: users.name,
      userEmail: users.email,
      userImage: users.image,
      dogId: dogs.id,
      dogName: dogs.name,
      dogBreed: dogs.breed,
    })
    .from(appointmentRequests)
    .innerJoin(users, eq(appointmentRequests.userId, users.id))
    .innerJoin(dogs, eq(appointmentRequests.dogId, dogs.id))
    .where(eq(appointmentRequests.shelterId, shelter.id))
    .orderBy(desc(appointmentRequests.createdAt));

  // Get dog images
  const dogIds = Array.from(new Set(appointments.map((a) => a.dogId)));
  const allImages = await db
    .select()
    .from(dogImages)
    .where(eq(dogImages.isPrimary, true));

  const imageMap = new Map(
    allImages
      .filter((img) => dogIds.includes(img.dogId))
      .map((img) => [img.dogId, img.url])
  );

  // Group by status
  const pending = appointments.filter((a) => a.status === "pending");
  const confirmed = appointments.filter((a) => a.status === "confirmed");
  const other = appointments.filter((a) => a.status !== "pending" && a.status !== "confirmed");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/shelter/dashboard" className="p-1 -ml-1">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Appointments</h1>
            <p className="text-sm text-primary-light">{shelter.name}</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-6">
        {/* Pending Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full" />
            Pending ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <div className="text-center py-6 bg-white rounded-xl border border-gray-100">
              <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500 text-sm">No pending appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  dogImageUrl={imageMap.get(apt.dogId) || null}
                  showActions
                />
              ))}
            </div>
          )}
        </section>

        {/* Confirmed Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Confirmed ({confirmed.length})
          </h2>
          {confirmed.length === 0 ? (
            <div className="text-center py-6 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500 text-sm">No confirmed appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {confirmed.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  dogImageUrl={imageMap.get(apt.dogId) || null}
                  showActions
                />
              ))}
            </div>
          )}
        </section>

        {/* Past/Cancelled Section */}
        {other.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              Past & Cancelled ({other.length})
            </h2>
            <div className="space-y-3">
              {other.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  dogImageUrl={imageMap.get(apt.dogId) || null}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

interface AppointmentData {
  id: string;
  preferredDate: string;
  preferredTime: string;
  message: string | null;
  status: string;
  createdAt: Date | null;
  userName: string | null;
  userEmail: string;
  userImage: string | null;
  dogId: string;
  dogName: string;
  dogBreed: string;
}

function AppointmentCard({
  appointment,
  dogImageUrl,
  showActions = false,
}: {
  appointment: AppointmentData;
  dogImageUrl: string | null;
  showActions?: boolean;
}) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex gap-3">
          {/* Dog Image */}
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#E8D5C4] shrink-0">
            {dogImageUrl ? (
              <Image
                src={dogImageUrl}
                alt={appointment.dogName}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <DogIcon className="w-8 h-8 text-[#C4A98A]" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-800">{appointment.dogName}</h3>
                <p className="text-gray-500 text-sm">{appointment.dogBreed}</p>
              </div>
              <span
                className={cn(
                  "px-2 py-0.5 text-xs rounded-full font-medium capitalize shrink-0",
                  statusColors[appointment.status as keyof typeof statusColors] || statusColors.pending
                )}
              >
                {appointment.status}
              </span>
            </div>

            {/* User Info */}
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{appointment.userName || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              <span className="truncate">{appointment.userEmail}</span>
            </div>

            {/* Date/Time */}
            <div className="mt-2 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-primary">
                <Calendar className="w-4 h-4" />
                <span>{appointment.preferredDate}</span>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Clock className="w-4 h-4" />
                <span>{appointment.preferredTime}</span>
              </div>
            </div>

            {/* Message */}
            {appointment.message && (
              <div className="mt-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="line-clamp-2">{appointment.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (appointment.status === "pending" || appointment.status === "confirmed") && (
        <AppointmentActions
          appointmentId={appointment.id}
          currentStatus={appointment.status as "pending" | "confirmed"}
        />
      )}
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
