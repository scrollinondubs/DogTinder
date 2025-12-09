import Image from "next/image";
import Link from "next/link";
import { Plus, Clock, AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { dogs, dogImages, appointmentRequests, users, conversations, messages } from "@/db/schema";
import { eq, and, desc, isNull, count } from "drizzle-orm";
import { getShelterForAdmin, isAuthError } from "@/lib/shelter-auth";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

export default async function ShelterDashboardPage() {
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    redirect("/login");
  }

  const { shelter } = result;

  // Get dogs for this shelter
  const shelterDogs = await db
    .select()
    .from(dogs)
    .where(eq(dogs.shelterId, shelter.id))
    .orderBy(desc(dogs.createdAt));

  // Get primary images for dogs
  const dogIds = shelterDogs.map((d) => d.id);
  const allImages = await db
    .select()
    .from(dogImages)
    .where(eq(dogImages.isPrimary, true));

  const imageMap = new Map(
    allImages
      .filter((img) => dogIds.includes(img.dogId))
      .map((img) => [img.dogId, img.url])
  );

  // Get dog stats
  const stats = {
    total: shelterDogs.length,
    available: shelterDogs.filter((d) => d.status === "available").length,
    pending: shelterDogs.filter((d) => d.status === "pending").length,
    adopted: shelterDogs.filter((d) => d.status === "adopted").length,
  };

  // Get pending appointments with user info
  const pendingAppointments = await db
    .select({
      id: appointmentRequests.id,
      preferredDate: appointmentRequests.preferredDate,
      preferredTime: appointmentRequests.preferredTime,
      status: appointmentRequests.status,
      userName: users.name,
      userEmail: users.email,
      dogId: appointmentRequests.dogId,
    })
    .from(appointmentRequests)
    .innerJoin(users, eq(appointmentRequests.userId, users.id))
    .where(
      and(
        eq(appointmentRequests.shelterId, shelter.id),
        eq(appointmentRequests.status, "pending")
      )
    )
    .orderBy(desc(appointmentRequests.createdAt))
    .limit(5);

  // Create dog lookup map for appointments
  const appointmentDogIds = Array.from(new Set(pendingAppointments.map((a) => a.dogId)));
  const appointmentDogs = appointmentDogIds.length > 0
    ? await db
        .select({ id: dogs.id, name: dogs.name })
        .from(dogs)
        .where(eq(dogs.shelterId, shelter.id))
    : [];
  const dogNameMap = new Map(appointmentDogs.map((d) => [d.id, d.name]));

  // Get unread messages count
  const shelterConversations = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(eq(conversations.shelterId, shelter.id));

  let unreadCount = 0;
  for (const conv of shelterConversations) {
    const [unread] = await db
      .select({ count: count() })
      .from(messages)
      .where(
        and(
          eq(messages.conversationId, conv.id),
          eq(messages.senderType, "user"),
          isNull(messages.readAt)
        )
      );
    unreadCount += unread.count;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-primary text-white px-4 py-6">
        <h1 className="text-2xl font-bold">{shelter.name}</h1>
        <p className="text-primary-light text-sm">Shelter Dashboard</p>

        {/* Stats */}
        <div className="flex gap-3 mt-4">
          <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-primary-light">Dogs</p>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{pendingAppointments.length}</p>
            <p className="text-xs text-primary-light">Pending</p>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{unreadCount}</p>
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

          {shelterDogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No dogs yet. Add your first dog to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shelterDogs.slice(0, 3).map((dog) => (
                <Link
                  key={dog.id}
                  href={`/shelter/dogs/${dog.id}`}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#E8D5C4]">
                    {imageMap.get(dog.id) ? (
                      <Image
                        src={imageMap.get(dog.id)!}
                        alt={dog.name}
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
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{dog.name}</h3>
                    <p className="text-gray-500 text-sm">
                      {dog.breed} • {dog.age} {dog.age === 1 ? "yr" : "yrs"}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={cn(
                      "px-2 py-1 text-xs rounded-full font-medium capitalize",
                      dog.status === "available"
                        ? "bg-green-100 text-green-700"
                        : dog.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {dog.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Pending Appointments
            </h2>
            <Link
              href="/shelter/appointments"
              className="text-sm text-primary font-medium"
            >
              View All
            </Link>
          </div>

          {pendingAppointments.length === 0 ? (
            <div className="text-center py-6 text-gray-500 border border-dashed border-gray-200 rounded-xl">
              <Clock className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No pending appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingAppointments.slice(0, 3).map((appointment) => (
                <Link
                  key={appointment.id}
                  href="/shelter/appointments"
                  className="block p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {appointment.userName || appointment.userEmail}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Meeting {dogNameMap.get(appointment.dogId) || "Unknown"} •{" "}
                        {appointment.preferredDate} at {appointment.preferredTime}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
