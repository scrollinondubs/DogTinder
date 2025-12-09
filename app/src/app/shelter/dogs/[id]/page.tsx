import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ChevronLeft, Trash2 } from "lucide-react";
import { db } from "@/db";
import { dogs, dogImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getShelterForAdmin, isAuthError, verifyDogOwnership } from "@/lib/shelter-auth";
import { DogForm } from "@/components/shelter/DogForm";
import { DeleteDogButton } from "./DeleteDogButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDogPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    redirect("/login");
  }

  const { shelter } = result;

  // Verify ownership
  const isOwner = await verifyDogOwnership(id, shelter.id);
  if (!isOwner) {
    notFound();
  }

  // Get the dog
  const [dog] = await db.select().from(dogs).where(eq(dogs.id, id)).limit(1);

  if (!dog) {
    notFound();
  }

  // Get dog images
  const images = await db
    .select()
    .from(dogImages)
    .where(eq(dogImages.dogId, id))
    .orderBy(dogImages.isPrimary);

  const formattedImages = images.map((img) => ({
    id: img.id,
    url: img.url,
    isPrimary: img.isPrimary,
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-primary text-white px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/shelter/dogs" className="p-1 -ml-1">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Edit {dog.name}</h1>
              <p className="text-sm text-primary-light">{shelter.name}</p>
            </div>
          </div>
          <DeleteDogButton dogId={dog.id} dogName={dog.name} />
        </div>
      </header>

      <div className="px-4 py-6">
        <DogForm
          initialData={{
            id: dog.id,
            name: dog.name,
            breed: dog.breed,
            age: dog.age,
            gender: dog.gender as "Male" | "Female",
            size: dog.size as "Small" | "Medium" | "Large" | "Extra Large",
            description: dog.description || "",
            status: dog.status as "available" | "pending" | "adopted",
          }}
          initialImages={formattedImages}
          isEdit
        />
      </div>
    </div>
  );
}
