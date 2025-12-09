import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { dogs, dogImages, shelters } from "@/db/schema";
import { auth } from "@/auth";

export const GET = auth(async function GET(req) {
  try {
    if (!req.auth?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract ID from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    if (!id) {
      return NextResponse.json({ error: "Dog ID required" }, { status: 400 });
    }

    // Get dog with shelter info
    const [dog] = await db
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
      .where(eq(dogs.id, id))
      .limit(1);

    if (!dog) {
      return NextResponse.json({ error: "Dog not found" }, { status: 404 });
    }

    // Get all images for this dog
    const images = await db
      .select({
        id: dogImages.id,
        url: dogImages.url,
        isPrimary: dogImages.isPrimary,
      })
      .from(dogImages)
      .where(eq(dogImages.dogId, id));

    // Get primary image URL
    const primaryImage = images.find((img) => img.isPrimary);
    const imageUrl = primaryImage?.url || images[0]?.url || "";

    // Format response to match UI's Dog interface
    const formattedDog = {
      id: dog.id,
      name: dog.name,
      age: dog.age,
      breed: dog.breed,
      gender: dog.gender,
      description: dog.description || "",
      status: dog.status,
      imageUrl,
      images: images.map((img) => ({ id: img.id, url: img.url })),
      shelter: {
        id: dog.shelterId,
        name: dog.shelterName,
        address: `${dog.shelterAddress}, ${dog.shelterCity}, ${dog.shelterState}`,
        distance: "2.3 mi", // Placeholder
        imageUrl: dog.shelterImageUrl || "",
      },
    };

    return NextResponse.json(formattedDog);
  } catch (error) {
    console.error("Error fetching dog:", error);
    return NextResponse.json(
      { error: "Failed to fetch dog" },
      { status: 500 }
    );
  }
});
