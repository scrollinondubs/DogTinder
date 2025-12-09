"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type DogStatus = "available" | "pending" | "adopted";

interface StatusToggleProps {
  dogId: string;
  currentStatus: DogStatus;
}

const statusConfig: Record<DogStatus, { label: string; bgClass: string; textClass: string }> = {
  available: { label: "Available", bgClass: "bg-green-100", textClass: "text-green-700" },
  pending: { label: "Pending", bgClass: "bg-yellow-100", textClass: "text-yellow-700" },
  adopted: { label: "Adopted", bgClass: "bg-gray-100", textClass: "text-gray-700" },
};

const statusOrder: DogStatus[] = ["available", "pending", "adopted"];

export function StatusToggle({ dogId, currentStatus }: StatusToggleProps) {
  const router = useRouter();
  const [status, setStatus] = useState<DogStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleStatusChange = async (newStatus: DogStatus) => {
    if (newStatus === status || isUpdating) return;

    setIsUpdating(true);
    setShowDropdown(false);

    try {
      const response = await fetch(`/api/shelter/dogs/${dogId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const config = statusConfig[status];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isUpdating}
        className={cn(
          "px-3 py-1.5 text-xs rounded-full font-medium transition-opacity",
          config.bgClass,
          config.textClass,
          isUpdating && "opacity-50"
        )}
      >
        {isUpdating ? "..." : config.label}
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 min-w-[120px]">
            {statusOrder.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleStatusChange(s)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2",
                  s === status && "bg-gray-50 font-medium"
                )}
              >
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    s === "available" && "bg-green-500",
                    s === "pending" && "bg-yellow-500",
                    s === "adopted" && "bg-gray-500"
                  )}
                />
                {statusConfig[s].label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
