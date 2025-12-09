import { z } from "zod";

export const appointmentRequestSchema = z.object({
  dogId: z.string().min(1, "Dog ID is required"),
  preferredDate: z.string().min(1, "Preferred date is required"), // ISO date string: "2025-11-22"
  preferredTime: z.string().min(1, "Preferred time is required"), // e.g., "10:30 AM"
  message: z.string().max(500, "Message is too long").optional(),
});

export type AppointmentRequestData = z.infer<typeof appointmentRequestSchema>;
