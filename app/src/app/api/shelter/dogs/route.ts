import { NextResponse } from "next/server";
import { db } from "@/db";
import { dogs, dogImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getShelterForAdmin, isAuthError } from "@/lib/shelter-auth";
import { dogSchema } from "@/lib/validations/dog";

// GET - List all dogs for the shelter
export async function GET() {
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { shelter } = result;

  // Get all dogs for this shelter
  const shelterDogs = await db
    .select()
    .from(dogs)
    .where(eq(dogs.shelterId, shelter.id))
    .orderBy(dogs.createdAt);

  // Get primary images for each dog
  const dogIds = shelterDogs.map((d) => d.id);
  const images = await db
    .select()
    .from(dogImages)
    .where(eq(dogImages.isPrimary, true));

  const imageMap = new Map(
    images
      .filter((img) => dogIds.includes(img.dogId))
      .map((img) => [img.dogId, img.url])
  );

  // Combine dogs with their primary images
  const dogsWithImages = shelterDogs.map((dog) => ({
    ...dog,
    imageUrl: imageMap.get(dog.id) || null,
  }));

  return NextResponse.json({ dogs: dogsWithImages });
}

// POST - Create a new dog
export async function POST(req: Request) {
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { shelter } = result;

  try {
    const body = await req.json();
    const validatedData = dogSchema.parse(body);

    const [newDog] = await db
      .insert(dogs)
      .values({
        ...validatedData,
        shelterId: shelter.id,
      })
      .returning();

    return NextResponse.json({ dog: newDog }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid dog data", details: error },
        { status: 400 }
      );
    }
    console.error("Error creating dog:", error);
    return NextResponse.json(
      { error: "Failed to create dog" },
      { status: 500 }
    );
  }
}
