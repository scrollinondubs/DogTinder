import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { dogs, dogImages, shelters, appointmentRequests } from "@/db/schema";
import { auth } from "@/auth";

// GET - Fetch single appointment by ID
export const GET = auth(async function GET(
  req,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!req.auth?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = req.auth.user.id;
    const { id } = await params;

    // Get appointment with dog and shelter info
    const [appointment] = await db
      .select({
        id: appointmentRequests.id,
        preferredDate: appointmentRequests.preferredDate,
        preferredTime: appointmentRequests.preferredTime,
        message: appointmentRequests.message,
        status: appointmentRequests.status,
        createdAt: appointmentRequests.createdAt,
        userId: appointmentRequests.userId,
        dogId: dogs.id,
        dogName: dogs.name,
        dogBreed: dogs.breed,
        dogAge: dogs.age,
        dogGender: dogs.gender,
        shelterId: shelters.id,
        shelterName: shelters.name,
        shelterAddress: shelters.address,
        shelterCity: shelters.city,
        shelterState: shelters.state,
        shelterPhone: shelters.phone,
      })
      .from(appointmentRequests)
      .innerJoin(dogs, eq(appointmentRequests.dogId, dogs.id))
      .innerJoin(shelters, eq(appointmentRequests.shelterId, shelters.id))
      .where(eq(appointmentRequests.id, id))
      .limit(1);

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Verify appointment belongs to current user
    if (appointment.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to view this appointment" },
        { status: 403 }
      );
    }

    // Get primary image for the dog
    const [primaryImage] = await db
      .select({ url: dogImages.url })
      .from(dogImages)
      .where(
        and(eq(dogImages.dogId, appointment.dogId), eq(dogImages.isPrimary, true))
      )
      .limit(1);

    return NextResponse.json({
      appointment: {
        id: appointment.id,
        preferredDate: appointment.preferredDate,
        preferredTime: appointment.preferredTime,
        message: appointment.message,
        status: appointment.status,
        createdAt: appointment.createdAt?.toISOString() || null,
        dog: {
          id: appointment.dogId,
          name: appointment.dogName,
          breed: appointment.dogBreed,
          age: appointment.dogAge,
          gender: appointment.dogGender,
          imageUrl: primaryImage?.url || "",
        },
        shelter: {
          id: appointment.shelterId,
          name: appointment.shelterName,
          address: `${appointment.shelterAddress}, ${appointment.shelterCity}, ${appointment.shelterState}`,
          phone: appointment.shelterPhone,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
});
