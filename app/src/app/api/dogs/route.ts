import { NextRequest, NextResponse } from "next/server";
import { eq, and, notInArray } from "drizzle-orm";
import { db } from "@/db";
import { dogs, dogImages, shelters, likes } from "@/db/schema";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    let swipedDogIds: string[] = [];

    if (userId) {
      // Authenticated: get swiped dogs from database
      const swipedDogs = await db
        .select({ dogId: likes.dogId })
        .from(likes)
        .where(eq(likes.userId, userId));
      swipedDogIds = swipedDogs.map((l) => l.dogId);
    } else {
      // Anonymous: get excluded IDs from query param
      const excludeParam = req.nextUrl.searchParams.get("excludeDogIds");
      if (excludeParam) {
        try {
          const parsed = JSON.parse(excludeParam);
          // Validate it's an array of strings
          if (
            Array.isArray(parsed) &&
            parsed.every((id) => typeof id === "string")
          ) {
            // Limit to prevent abuse
            swipedDogIds = parsed.slice(0, 500);
          }
        } catch {
          // Invalid JSON, ignore
        }
      }
    }

    // Get available dogs that haven't been swiped
    const availableDogs = await db
      .select({
        id: dogs.id,
        name: dogs.name,
        age: dogs.age,
        breed: dogs.breed,
        gender: dogs.gender,
        description: dogs.description,
        status: dogs.status,
        shelterId: dogs.shelterId,
        shelterName: shelters.name,
        shelterAddress: shelters.address,
        shelterCity: shelters.city,
        shelterState: shelters.state,
        shelterImageUrl: shelters.imageUrl,
      })
      .from(dogs)
      .innerJoin(shelters, eq(dogs.shelterId, shelters.id))
      .where(
        swipedDogIds.length > 0
          ? and(
              eq(dogs.status, "available"),
              notInArray(dogs.id, swipedDogIds)
            )
          : eq(dogs.status, "available")
      );

    // Get primary images for these dogs
    const dogIds = availableDogs.map((d) => d.id);

    const images =
      dogIds.length > 0
        ? await db
            .select({
              dogId: dogImages.dogId,
              url: dogImages.url,
            })
            .from(dogImages)
            .where(eq(dogImages.isPrimary, true))
        : [];

    const imageMap = new Map(images.map((img) => [img.dogId, img.url]));

    // Format response to match UI's Dog interface
    const formattedDogs = availableDogs.map((dog) => ({
      id: dog.id,
      name: dog.name,
      age: dog.age,
      breed: dog.breed,
      gender: dog.gender,
      description: dog.description || "",
      status: dog.status,
      imageUrl: imageMap.get(dog.id) || "",
      shelter: {
        id: dog.shelterId,
        name: dog.shelterName,
        address: `${dog.shelterAddress}, ${dog.shelterCity}, ${dog.shelterState}`,
        distance: "2.3 mi", // Placeholder
        imageUrl: dog.shelterImageUrl || "",
      },
    }));

    return NextResponse.json(formattedDogs);
  } catch (error) {
    console.error("Error fetching dogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch dogs" },
      { status: 500 }
    );
  }
}
