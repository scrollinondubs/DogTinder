import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { dogs, dogImages, shelters, likes } from "@/db/schema";
import { auth } from "@/auth";

// POST - Save a swipe action
export const POST = auth(async function POST(req) {
  try {
    if (!req.auth?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = req.auth.user.id;
    const body = await req.json();
    const { dogId, liked } = body;

    if (!dogId || typeof liked !== "boolean") {
      return NextResponse.json(
        { error: "Missing dogId or liked field" },
        { status: 400 }
      );
    }

    // Check if already swiped on this dog
    const existing = await db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.dogId, dogId)))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Already swiped on this dog" },
        { status: 409 }
      );
    }

    // Insert the like/pass
    await db.insert(likes).values({
      userId,
      dogId,
      liked,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving like:", error);
    return NextResponse.json(
      { error: "Failed to save swipe" },
      { status: 500 }
    );
  }
});

// GET - Get user's liked dogs
export const GET = auth(async function GET(req) {
  try {
    if (!req.auth?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = req.auth.user.id;

    // Get liked dogs with shelter info
    const likedDogs = await db
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
      .from(likes)
      .innerJoin(dogs, eq(likes.dogId, dogs.id))
      .innerJoin(shelters, eq(dogs.shelterId, shelters.id))
      .where(and(eq(likes.userId, userId), eq(likes.liked, true)));

    // Get primary images for these dogs
    const dogIds = likedDogs.map((d) => d.id);

    const images = dogIds.length > 0
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
    const formattedDogs = likedDogs.map((dog) => ({
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
    console.error("Error fetching liked dogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch liked dogs" },
      { status: 500 }
    );
  }
});
