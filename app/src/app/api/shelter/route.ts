import { NextResponse } from "next/server";
import { db } from "@/db";
import { dogs, appointmentRequests, conversations, messages } from "@/db/schema";
import { eq, and, isNull, count } from "drizzle-orm";
import { getShelterForAdmin, isAuthError } from "@/lib/shelter-auth";

export async function GET() {
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { shelter } = result;

  // Get dog counts by status
  const allDogs = await db
    .select({ status: dogs.status })
    .from(dogs)
    .where(eq(dogs.shelterId, shelter.id));

  const dogStats = {
    total: allDogs.length,
    available: allDogs.filter((d) => d.status === "available").length,
    pending: allDogs.filter((d) => d.status === "pending").length,
    adopted: allDogs.filter((d) => d.status === "adopted").length,
  };

  // Get pending appointment requests count
  const [appointmentCount] = await db
    .select({ count: count() })
    .from(appointmentRequests)
    .where(
      and(
        eq(appointmentRequests.shelterId, shelter.id),
        eq(appointmentRequests.status, "pending")
      )
    );

  // Get unread messages count
  const shelterConversations = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(eq(conversations.shelterId, shelter.id));

  const conversationIds = shelterConversations.map((c) => c.id);

  let unreadCount = 0;
  if (conversationIds.length > 0) {
    for (const convId of conversationIds) {
      const [unread] = await db
        .select({ count: count() })
        .from(messages)
        .where(
          and(
            eq(messages.conversationId, convId),
            eq(messages.senderType, "user"),
            isNull(messages.readAt)
          )
        );
      unreadCount += unread.count;
    }
  }

  return NextResponse.json({
    shelter,
    stats: {
      dogs: dogStats,
      pendingAppointments: appointmentCount?.count || 0,
      unreadMessages: unreadCount,
    },
  });
}
