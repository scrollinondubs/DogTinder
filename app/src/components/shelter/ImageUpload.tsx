"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Upload, X, Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedImage {
  id?: string;
  url: string;
  isPrimary: boolean;
  isNew?: boolean;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled || uploading) return;

      const remainingSlots = maxImages - images.length;
      const filesToUpload = acceptedFiles.slice(0, remainingSlots);

      if (filesToUpload.length === 0) {
        setError(`Maximum ${maxImages} images allowed`);
        return;
      }

      setUploading(true);
      setError(null);

      try {
        const newImages: UploadedImage[] = [];

        for (const file of filesToUpload) {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/shelter/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Upload failed");
          }

          const { url } = await response.json();
          newImages.push({
            url,
            isPrimary: images.length === 0 && newImages.length === 0,
            isNew: true,
          });
        }

        onImagesChange([...images, ...newImages]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [images, onImagesChange, maxImages, disabled, uploading]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: disabled || uploading || images.length >= maxImages,
  });

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // If we removed the primary image, make the first remaining image primary
    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0] = { ...newImages[0], isPrimary: true };
    }
    onImagesChange(newImages);
  };

  const handleSetPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Dog Photos
      </label>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div
              key={image.url}
              className={cn(
                "relative aspect-square rounded-xl overflow-hidden border-2",
                image.isPrimary ? "border-primary" : "border-transparent"
              )}
            >
              <Image
                src={image.url}
                alt={`Dog photo ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 200px"
              />

              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Primary
                </div>
              )}

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.isPrimary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                    title="Set as primary"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-primary/50",
            (disabled || uploading) && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p>Uploading...</p>
            </div>
          ) : isDragActive ? (
            <div className="flex flex-col items-center gap-2 text-primary">
              <Upload className="w-8 h-8" />
              <p>Drop images here</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Upload className="w-8 h-8" />
              <p>Drag & drop images, or click to select</p>
              <p className="text-xs">
                JPEG, PNG, WebP • Max 5MB • {maxImages - images.length} remaining
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
