import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { likes, dogs } from "@/db/schema";
import { auth } from "@/auth";
import { z } from "zod";

const mergeSchema = z.object({
  swipes: z
    .array(
      z.object({
        dogId: z.string().min(1),
        liked: z.boolean(),
        timestamp: z.number(),
      })
    )
    .max(500),
});

// POST - Merge anonymous swipes into user's account
export const POST = auth(async function POST(req) {
  try {
    if (!req.auth?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = req.auth.user.id;
    const body = await req.json();

    const parseResult = mergeSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { swipes } = parseResult.data;

    if (swipes.length === 0) {
      return NextResponse.json({ merged: 0, skipped: 0 });
    }

    // Get existing swipes for this user to avoid duplicates
    const existingSwipes = await db
      .select({ dogId: likes.dogId })
      .from(likes)
      .where(eq(likes.userId, userId));

    const existingDogIds = new Set(existingSwipes.map((s) => s.dogId));

    // Validate that all dogIds exist
    const dogIds = Array.from(new Set(swipes.map((s) => s.dogId)));
    const validDogs = await db
      .select({ id: dogs.id })
      .from(dogs)
      .where(inArray(dogs.id, dogIds));

    const validDogIds = new Set(validDogs.map((d) => d.id));

    // Filter to only new, valid swipes
    const newSwipes = swipes.filter(
      (s) => !existingDogIds.has(s.dogId) && validDogIds.has(s.dogId)
    );

    if (newSwipes.length > 0) {
      // Batch insert
      await db.insert(likes).values(
        newSwipes.map((s) => ({
          userId,
          dogId: s.dogId,
          liked: s.liked,
        }))
      );
    }

    return NextResponse.json({
      merged: newSwipes.length,
      skipped: swipes.length - newSwipes.length,
    });
  } catch (error) {
    console.error("Error merging swipes:", error);
    return NextResponse.json(
      { error: "Failed to merge swipes" },
      { status: 500 }
    );
  }
});
