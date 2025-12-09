import { NextResponse } from "next/server";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/db";
import { dogs, dogImages, shelters, appointmentRequests } from "@/db/schema";
import { auth } from "@/auth";
import { appointmentRequestSchema } from "@/lib/validations/appointment";

// POST - Create appointment request
export const POST = auth(async function POST(req) {
  try {
    if (!req.auth?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = req.auth.user.id;
    const body = await req.json();

    // Validate request body
    const parseResult = appointmentRequestSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid request data" },
        { status: 400 }
      );
    }

    const { dogId, preferredDate, preferredTime, message } = parseResult.data;

    // Verify dog exists and get shelterId
    const [dog] = await db
      .select({
        id: dogs.id,
        name: dogs.name,
        shelterId: dogs.shelterId,
        status: dogs.status,
      })
      .from(dogs)
      .where(eq(dogs.id, dogId))
      .limit(1);

    if (!dog) {
      return NextResponse.json({ error: "Dog not found" }, { status: 404 });
    }

    if (dog.status !== "available") {
      return NextResponse.json(
        { error: "This dog is not currently available for appointments" },
        { status: 400 }
      );
    }

    // Check for duplicate pending appointments (same user + dog)
    const existingPending = await db
      .select()
      .from(appointmentRequests)
      .where(
        and(
          eq(appointmentRequests.userId, userId),
          eq(appointmentRequests.dogId, dogId),
          eq(appointmentRequests.status, "pending")
        )
      )
      .limit(1);

    if (existingPending.length > 0) {
      return NextResponse.json(
        { error: "You already have a pending appointment request for this dog" },
        { status: 409 }
      );
    }

    // Insert appointment request
    const [newAppointment] = await db
      .insert(appointmentRequests)
      .values({
        userId,
        dogId,
        shelterId: dog.shelterId,
        preferredDate,
        preferredTime,
        message: message || null,
        status: "pending",
      })
      .returning();

    // Get shelter info for response
    const [shelter] = await db
      .select({
        id: shelters.id,
        name: shelters.name,
        address: shelters.address,
        city: shelters.city,
        state: shelters.state,
      })
      .from(shelters)
      .where(eq(shelters.id, dog.shelterId))
      .limit(1);

    return NextResponse.json({
      appointment: {
        id: newAppointment.id,
        preferredDate: newAppointment.preferredDate,
        preferredTime: newAppointment.preferredTime,
        message: newAppointment.message,
        status: newAppointment.status,
        dog: {
          id: dog.id,
          name: dog.name,
        },
        shelter: shelter
          ? {
              id: shelter.id,
              name: shelter.name,
              address: `${shelter.address}, ${shelter.city}, ${shelter.state}`,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
});

// GET - List user's appointments
export const GET = auth(async function GET(req) {
  try {
    if (!req.auth?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = req.auth.user.id;

    // Get user's appointments with dog and shelter info
    const appointments = await db
      .select({
        id: appointmentRequests.id,
        preferredDate: appointmentRequests.preferredDate,
        preferredTime: appointmentRequests.preferredTime,
        message: appointmentRequests.message,
        status: appointmentRequests.status,
        createdAt: appointmentRequests.createdAt,
        dogId: dogs.id,
        dogName: dogs.name,
        dogBreed: dogs.breed,
        shelterId: shelters.id,
        shelterName: shelters.name,
        shelterAddress: shelters.address,
        shelterCity: shelters.city,
        shelterState: shelters.state,
      })
      .from(appointmentRequests)
      .innerJoin(dogs, eq(appointmentRequests.dogId, dogs.id))
      .innerJoin(shelters, eq(appointmentRequests.shelterId, shelters.id))
      .where(eq(appointmentRequests.userId, userId))
      .orderBy(desc(appointmentRequests.createdAt));

    // Get primary images for these dogs
    const dogIds = Array.from(new Set(appointments.map((a) => a.dogId)));

    const images =
      dogIds.length > 0
        ? await db
            .select({
              dogId: dogImages.dogId,
              url: dogImages.url,
            })
            .from(dogImages)
            .where(eq(dogImages.isPrimary, true))
        : [];

    const imageMap = new Map(images.map((img) => [img.dogId, img.url]));

    // Format response
    const formattedAppointments = appointments.map((apt) => ({
      id: apt.id,
      preferredDate: apt.preferredDate,
      preferredTime: apt.preferredTime,
      message: apt.message,
      status: apt.status,
      createdAt: apt.createdAt?.toISOString() || null,
      dog: {
        id: apt.dogId,
        name: apt.dogName,
        breed: apt.dogBreed,
        imageUrl: imageMap.get(apt.dogId) || "",
      },
      shelter: {
        id: apt.shelterId,
        name: apt.shelterName,
        address: `${apt.shelterAddress}, ${apt.shelterCity}, ${apt.shelterState}`,
      },
    }));

    return NextResponse.json({ appointments: formattedAppointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
});
