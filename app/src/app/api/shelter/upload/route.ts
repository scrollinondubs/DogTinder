import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { getShelterForAdmin, isAuthError } from "@/lib/shelter-auth";

// POST - Upload an image to Vercel Blob
export async function POST(req: Request) {
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { shelter } = result;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `dogs/${shelter.id}/${timestamp}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: true, // Prevents filename collisions
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an image from Vercel Blob
export async function DELETE(req: Request) {
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Delete from Vercel Blob
    await del(url);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
