import { NextResponse } from "next/server";
import { db } from "@/db";
import { appointmentRequests } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getShelterForAdmin, isAuthError } from "@/lib/shelter-auth";
import { z } from "zod";

const appointmentStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get a single appointment
export async function GET(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { shelter } = result;

  const [appointment] = await db
    .select()
    .from(appointmentRequests)
    .where(
      and(
        eq(appointmentRequests.id, id),
        eq(appointmentRequests.shelterId, shelter.id)
      )
    )
    .limit(1);

  if (!appointment) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ appointment });
}

// PATCH - Update appointment status
export async function PATCH(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { shelter } = result;

  // Verify the appointment belongs to this shelter
  const [existingAppointment] = await db
    .select()
    .from(appointmentRequests)
    .where(
      and(
        eq(appointmentRequests.id, id),
        eq(appointmentRequests.shelterId, shelter.id)
      )
    )
    .limit(1);

  if (!existingAppointment) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 }
    );
  }

  try {
    const body = await req.json();
    const { status } = appointmentStatusSchema.parse(body);

    const [updatedAppointment] = await db
      .update(appointmentRequests)
      .set({ status })
      .where(eq(appointmentRequests.id, id))
      .returning();

    return NextResponse.json({ appointment: updatedAppointment });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid status value", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}
