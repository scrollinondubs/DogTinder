import { NextResponse } from "next/server";
import { db } from "@/db";
import { appointmentRequests, users, dogs, dogImages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getShelterForAdmin, isAuthError } from "@/lib/shelter-auth";

// GET - List all appointment requests for the shelter
export async function GET(req: Request) {
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { shelter } = result;

  // Get query params for filtering
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  // Get all appointment requests for this shelter
  const appointments = await db
    .select({
      appointment: appointmentRequests,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      },
      dog: {
        id: dogs.id,
        name: dogs.name,
        breed: dogs.breed,
      },
    })
    .from(appointmentRequests)
    .innerJoin(users, eq(appointmentRequests.userId, users.id))
    .innerJoin(dogs, eq(appointmentRequests.dogId, dogs.id))
    .where(eq(appointmentRequests.shelterId, shelter.id))
    .orderBy(desc(appointmentRequests.createdAt));

  // Filter by status if provided
  const filteredAppointments = status
    ? appointments.filter((a) => a.appointment.status === status)
    : appointments;

  // Get primary images for dogs
  const dogIds = Array.from(new Set(filteredAppointments.map((a) => a.dog.id)));
  const images = await db
    .select()
    .from(dogImages)
    .where(eq(dogImages.isPrimary, true));

  const imageMap = new Map(
    images
      .filter((img) => dogIds.includes(img.dogId))
      .map((img) => [img.dogId, img.url])
  );

  // Format the response
  const formattedAppointments = filteredAppointments.map((a) => ({
    id: a.appointment.id,
    preferredDate: a.appointment.preferredDate,
    preferredTime: a.appointment.preferredTime,
    message: a.appointment.message,
    status: a.appointment.status,
    createdAt: a.appointment.createdAt,
    user: a.user,
    dog: {
      ...a.dog,
      imageUrl: imageMap.get(a.dog.id) || null,
    },
  }));

  return NextResponse.json({ appointments: formattedAppointments });
}
