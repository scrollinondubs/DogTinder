import { z } from "zod";

export const dogSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  breed: z.string().min(1, "Breed is required").max(100, "Breed is too long"),
  age: z.number().int().min(0, "Age must be 0 or greater").max(30, "Age seems too high"),
  gender: z.enum(["Male", "Female"]),
  size: z.enum(["Small", "Medium", "Large", "Extra Large"]),
  description: z.string().max(2000, "Description is too long"),
  status: z.enum(["available", "pending", "adopted"]),
});

export const dogStatusSchema = z.object({
  status: z.enum(["available", "pending", "adopted"]),
});

export const dogImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  isPrimary: z.boolean().default(false),
});

export type DogFormData = z.infer<typeof dogSchema>;
export type DogStatusUpdate = z.infer<typeof dogStatusSchema>;
export type DogImageData = z.infer<typeof dogImageSchema>;
