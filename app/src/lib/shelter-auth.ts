import { auth } from "@/auth";
import { db } from "@/db";
import { users, shelters, dogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export type ShelterAuthResult =
  | { shelter: typeof shelters.$inferSelect; userId: string }
  | { error: string; status: number };

/**
 * Verify the current user is a SHELTER_ADMIN and get their associated shelter.
 * Use this in all shelter API routes and pages.
 */
export async function getShelterForAdmin(): Promise<ShelterAuthResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized - please log in", status: 401 };
  }

  if (session.user.role !== "SHELTER_ADMIN" && session.user.role !== "ADMIN") {
    return { error: "Forbidden - requires SHELTER_ADMIN role", status: 403 };
  }

  // Get user with their shelter ID
  const [user] = await db
    .select({ shelterId: users.shelterId })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user?.shelterId) {
    return { error: "No shelter associated with this admin account", status: 403 };
  }

  // Get the shelter details
  const [shelter] = await db
    .select()
    .from(shelters)
    .where(eq(shelters.id, user.shelterId))
    .limit(1);

  if (!shelter) {
    return { error: "Shelter not found", status: 404 };
  }

  return { shelter, userId: session.user.id };
}

/**
 * Verify that a dog belongs to the admin's shelter.
 * Use this before allowing edit/delete operations on a dog.
 */
export async function verifyDogOwnership(
  dogId: string,
  shelterId: string
): Promise<boolean> {
  const [dog] = await db
    .select({ shelterId: dogs.shelterId })
    .from(dogs)
    .where(eq(dogs.id, dogId))
    .limit(1);

  return dog?.shelterId === shelterId;
}

/**
 * Helper to check if the auth result is an error
 */
export function isAuthError(
  result: ShelterAuthResult
): result is { error: string; status: number } {
  return "error" in result;
}
