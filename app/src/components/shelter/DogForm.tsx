"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { dogSchema, DogFormData } from "@/lib/validations/dog";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import { ImageUpload, UploadedImage } from "./ImageUpload";

interface DogFormProps {
  initialData?: DogFormData & { id?: string };
  initialImages?: UploadedImage[];
  isEdit?: boolean;
}

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const sizeOptions = [
  { value: "Small", label: "Small (< 25 lbs)" },
  { value: "Medium", label: "Medium (25-50 lbs)" },
  { value: "Large", label: "Large (50-100 lbs)" },
  { value: "Extra Large", label: "Extra Large (> 100 lbs)" },
];

const statusOptions = [
  { value: "available", label: "Available for Adoption" },
  { value: "pending", label: "Adoption Pending" },
  { value: "adopted", label: "Adopted" },
];

export function DogForm({ initialData, initialImages = [], isEdit = false }: DogFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DogFormData>({
    resolver: zodResolver(dogSchema),
    defaultValues: initialData || {
      name: "",
      breed: "",
      age: 1,
      gender: "Male",
      size: "Medium",
      description: "",
      status: "available",
    },
  });

  const onSubmit = async (data: DogFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create or update the dog
      const url = isEdit ? `/api/shelter/dogs/${initialData?.id}` : "/api/shelter/dogs";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save dog");
      }

      const { dog } = await response.json();

      // Save images for new dogs or handle image changes
      if (!isEdit || images.some((img) => img.isNew)) {
        // Add new images to the dog
        for (const image of images.filter((img) => img.isNew)) {
          await fetch(`/api/shelter/dogs/${dog.id}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: image.url, isPrimary: image.isPrimary }),
          });
        }
      }

      // Update primary image if changed
      const primaryImage = images.find((img) => img.isPrimary && img.id);
      if (isEdit && primaryImage && primaryImage.id) {
        await fetch(`/api/shelter/dogs/${dog.id}/images`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageId: primaryImage.id }),
        });
      }

      // Redirect to dogs list or dog detail
      router.push("/shelter/dogs");
      router.refresh();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Image Upload */}
      <ImageUpload
        images={images}
        onImagesChange={setImages}
        disabled={isSubmitting}
      />

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Name"
          placeholder="e.g., Max"
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          label="Breed"
          placeholder="e.g., Golden Retriever"
          {...register("breed")}
          error={errors.breed?.message}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Age (years)"
          type="number"
          min="0"
          max="30"
          {...register("age", { valueAsNumber: true })}
          error={errors.age?.message}
        />
        <Select
          label="Gender"
          options={genderOptions}
          {...register("gender")}
          error={errors.gender?.message}
        />
        <Select
          label="Size"
          options={sizeOptions}
          {...register("size")}
          error={errors.size?.message}
        />
      </div>

      <Textarea
        label="Description"
        placeholder="Tell potential adopters about this dog's personality, history, and what makes them special..."
        rows={4}
        {...register("description")}
        error={errors.description?.message}
      />

      {isEdit && (
        <Select
          label="Adoption Status"
          options={statusOptions}
          {...register("status")}
          error={errors.status?.message}
        />
      )}

      {/* Error Message */}
      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {submitError}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEdit ? "Saving..." : "Adding Dog..."}
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Add Dog"
          )}
        </Button>
      </div>
    </form>
  );
}
