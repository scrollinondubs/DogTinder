import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, ChevronLeft, AlertCircle } from "lucide-react";
import { db } from "@/db";
import { dogs, dogImages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getShelterForAdmin, isAuthError } from "@/lib/shelter-auth";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import { StatusToggle } from "./StatusToggle";

export default async function ShelterDogsPage() {
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    redirect("/login");
  }

  const { shelter } = result;

  // Get all dogs for this shelter
  const shelterDogs = await db
    .select()
    .from(dogs)
    .where(eq(dogs.shelterId, shelter.id))
    .orderBy(desc(dogs.createdAt));

  // Get primary images
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-primary text-white px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/shelter/dashboard" className="p-1 -ml-1">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Manage Dogs</h1>
            <p className="text-sm text-primary-light">{shelter.name}</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-4">
        {/* Stats Bar */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <StatBadge
            label="Total"
            count={shelterDogs.length}
            active
          />
          <StatBadge
            label="Available"
            count={shelterDogs.filter((d) => d.status === "available").length}
            color="green"
          />
          <StatBadge
            label="Pending"
            count={shelterDogs.filter((d) => d.status === "pending").length}
            color="yellow"
          />
          <StatBadge
            label="Adopted"
            count={shelterDogs.filter((d) => d.status === "adopted").length}
            color="gray"
          />
        </div>

        {/* Dogs List */}
        {shelterDogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-lg font-semibold mb-2">No dogs yet</h2>
            <p className="mb-6">Add your first dog to start matching with potential adopters!</p>
            <Link href="/shelter/dogs/new">
              <Button>
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Dog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3 mb-20">
            {shelterDogs.map((dog) => (
              <div
                key={dog.id}
                className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl"
              >
                {/* Thumbnail */}
                <Link href={`/shelter/dogs/${dog.id}`} className="shrink-0">
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
                </Link>

                {/* Info */}
                <Link href={`/shelter/dogs/${dog.id}`} className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{dog.name}</h3>
                  <p className="text-gray-500 text-sm truncate">
                    {dog.breed} • {dog.age} {dog.age === 1 ? "yr" : "yrs"} • {dog.gender}
                  </p>
                </Link>

                {/* Status Toggle */}
                <StatusToggle dogId={dog.id} currentStatus={dog.status} />
              </div>
            ))}
          </div>
        )}

        {/* Floating Add Button */}
        {shelterDogs.length > 0 && (
          <div className="fixed bottom-20 left-0 right-0 px-4">
            <Link href="/shelter/dogs/new">
              <Button fullWidth size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Add New Dog
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBadge({
  label,
  count,
  color = "primary",
  active = false,
}: {
  label: string;
  count: number;
  color?: "primary" | "green" | "yellow" | "gray";
  active?: boolean;
}) {
  const colorClasses = {
    primary: active ? "bg-primary text-white" : "bg-gray-100 text-gray-600",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <div
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap",
        colorClasses[color]
      )}
    >
      {label}: {count}
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
