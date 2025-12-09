"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";

interface AppointmentActionsProps {
  appointmentId: string;
  currentStatus: "pending" | "confirmed";
}

export function AppointmentActions({ appointmentId, currentStatus }: AppointmentActionsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (newStatus: "confirmed" | "cancelled" | "completed") => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/shelter/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update appointment:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isUpdating) {
    return (
      <div className="px-4 py-3 border-t border-gray-100 flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (currentStatus === "pending") {
    return (
      <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
        <button
          onClick={() => handleUpdateStatus("confirmed")}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Confirm
        </button>
        <button
          onClick={() => handleUpdateStatus("cancelled")}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Decline
        </button>
      </div>
    );
  }

  if (currentStatus === "confirmed") {
    return (
      <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
        <button
          onClick={() => handleUpdateStatus("completed")}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Mark Completed
        </button>
        <button
          onClick={() => handleUpdateStatus("cancelled")}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    );
  }

  return null;
}
