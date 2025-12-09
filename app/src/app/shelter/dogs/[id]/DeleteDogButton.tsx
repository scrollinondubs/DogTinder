"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteDogButtonProps {
  dogId: string;
  dogName: string;
}

export function DeleteDogButton({ dogId, dogName }: DeleteDogButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/shelter/dogs/${dogId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/shelter/dogs");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete dog:", error);
      setIsDeleting(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-xl p-6 max-w-sm w-full">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Delete {dogName}?</h3>
          <p className="text-gray-600 mb-4">
            This action cannot be undone. All photos and data for this dog will be permanently removed.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
      title="Delete dog"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
