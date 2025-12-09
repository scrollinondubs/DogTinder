import { NextResponse } from "next/server";
import { db } from "@/db";
import { dogs, dogImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getShelterForAdmin, isAuthError, verifyDogOwnership } from "@/lib/shelter-auth";
import { dogSchema, dogStatusSchema } from "@/lib/validations/dog";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get a single dog with all images
export async function GET(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { shelter } = result;

  // Verify ownership
  const isOwner = await verifyDogOwnership(id, shelter.id);
  if (!isOwner) {
    return NextResponse.json(
      { error: "Dog not found or access denied" },
      { status: 404 }
    );
  }

  // Get dog with images
  const [dog] = await db.select().from(dogs).where(eq(dogs.id, id)).limit(1);

  if (!dog) {
    return NextResponse.json({ error: "Dog not found" }, { status: 404 });
  }

  const images = await db
    .select()
    .from(dogImages)
    .where(eq(dogImages.dogId, id))
    .orderBy(dogImages.isPrimary);

  return NextResponse.json({ dog, images });
}

// PUT - Update a dog
export async function PUT(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { shelter } = result;

  // Verify ownership
  const isOwner = await verifyDogOwnership(id, shelter.id);
  if (!isOwner) {
    return NextResponse.json(
      { error: "Dog not found or access denied" },
      { status: 404 }
    );
  }

  try {
    const body = await req.json();
    const validatedData = dogSchema.parse(body);

    const [updatedDog] = await db
      .update(dogs)
      .set(validatedData)
      .where(eq(dogs.id, id))
      .returning();

    return NextResponse.json({ dog: updatedDog });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid dog data", details: error },
        { status: 400 }
      );
    }
    console.error("Error updating dog:", error);
    return NextResponse.json(
      { error: "Failed to update dog" },
      { status: 500 }
    );
  }
}

// PATCH - Quick status update
export async function PATCH(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { shelter } = result;

  // Verify ownership
  const isOwner = await verifyDogOwnership(id, shelter.id);
  if (!isOwner) {
    return NextResponse.json(
      { error: "Dog not found or access denied" },
      { status: 404 }
    );
  }

  try {
    const body = await req.json();
    const { status } = dogStatusSchema.parse(body);

    const [updatedDog] = await db
      .update(dogs)
      .set({ status })
      .where(eq(dogs.id, id))
      .returning();

    return NextResponse.json({ dog: updatedDog });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }
    console.error("Error updating dog status:", error);
    return NextResponse.json(
      { error: "Failed to update dog status" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a dog
export async function DELETE(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { shelter } = result;

  // Verify ownership
  const isOwner = await verifyDogOwnership(id, shelter.id);
  if (!isOwner) {
    return NextResponse.json(
      { error: "Dog not found or access denied" },
      { status: 404 }
    );
  }

  // Delete dog (images will cascade delete due to FK constraint)
  await db.delete(dogs).where(eq(dogs.id, id));

  return NextResponse.json({ success: true });
}
