import { NextResponse } from "next/server";
import { db } from "@/db";
import { dogImages } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getShelterForAdmin, isAuthError, verifyDogOwnership } from "@/lib/shelter-auth";
import { dogImageSchema } from "@/lib/validations/dog";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get all images for a dog
export async function GET(req: Request, { params }: RouteParams) {
  const { id: dogId } = await params;
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { shelter } = result;

  // Verify ownership
  const isOwner = await verifyDogOwnership(dogId, shelter.id);
  if (!isOwner) {
    return NextResponse.json(
      { error: "Dog not found or access denied" },
      { status: 404 }
    );
  }

  const images = await db
    .select()
    .from(dogImages)
    .where(eq(dogImages.dogId, dogId))
    .orderBy(dogImages.isPrimary);

  return NextResponse.json({ images });
}

// POST - Add an image to a dog
export async function POST(req: Request, { params }: RouteParams) {
  const { id: dogId } = await params;
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { shelter } = result;

  // Verify ownership
  const isOwner = await verifyDogOwnership(dogId, shelter.id);
  if (!isOwner) {
    return NextResponse.json(
      { error: "Dog not found or access denied" },
      { status: 404 }
    );
  }

  try {
    const body = await req.json();
    const { url, isPrimary } = dogImageSchema.parse(body);

    // If this is set as primary, unset other primary images
    if (isPrimary) {
      await db
        .update(dogImages)
        .set({ isPrimary: false })
        .where(eq(dogImages.dogId, dogId));
    }

    // Check if this is the first image (should be primary by default)
    const existingImages = await db
      .select()
      .from(dogImages)
      .where(eq(dogImages.dogId, dogId));

    const shouldBePrimary = isPrimary || existingImages.length === 0;

    const [newImage] = await db
      .insert(dogImages)
      .values({
        dogId,
        url,
        isPrimary: shouldBePrimary,
      })
      .returning();

    return NextResponse.json({ image: newImage }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid image data", details: error },
        { status: 400 }
      );
    }
    console.error("Error adding image:", error);
    return NextResponse.json(
      { error: "Failed to add image" },
      { status: 500 }
    );
  }
}

// PATCH - Update image (set as primary)
export async function PATCH(req: Request, { params }: RouteParams) {
  const { id: dogId } = await params;
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { shelter } = result;

  // Verify ownership
  const isOwner = await verifyDogOwnership(dogId, shelter.id);
  if (!isOwner) {
    return NextResponse.json(
      { error: "Dog not found or access denied" },
      { status: 404 }
    );
  }

  try {
    const body = await req.json();
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json(
        { error: "imageId is required" },
        { status: 400 }
      );
    }

    // Unset all primary images for this dog
    await db
      .update(dogImages)
      .set({ isPrimary: false })
      .where(eq(dogImages.dogId, dogId));

    // Set the new primary image
    const [updatedImage] = await db
      .update(dogImages)
      .set({ isPrimary: true })
      .where(and(eq(dogImages.id, imageId), eq(dogImages.dogId, dogId)))
      .returning();

    if (!updatedImage) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ image: updatedImage });
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}

// DELETE - Remove an image
export async function DELETE(req: Request, { params }: RouteParams) {
  const { id: dogId } = await params;
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { shelter } = result;

  // Verify ownership
  const isOwner = await verifyDogOwnership(dogId, shelter.id);
  if (!isOwner) {
    return NextResponse.json(
      { error: "Dog not found or access denied" },
      { status: 404 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json(
        { error: "imageId is required" },
        { status: 400 }
      );
    }

    // Get the image to check if it's primary
    const [image] = await db
      .select()
      .from(dogImages)
      .where(and(eq(dogImages.id, imageId), eq(dogImages.dogId, dogId)))
      .limit(1);

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete the image
    await db.delete(dogImages).where(eq(dogImages.id, imageId));

    // If deleted image was primary, set another image as primary
    if (image.isPrimary) {
      const [remainingImage] = await db
        .select()
        .from(dogImages)
        .where(eq(dogImages.dogId, dogId))
        .limit(1);

      if (remainingImage) {
        await db
          .update(dogImages)
          .set({ isPrimary: true })
          .where(eq(dogImages.id, remainingImage.id));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
