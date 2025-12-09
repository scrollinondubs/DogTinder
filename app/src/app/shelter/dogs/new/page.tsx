import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getShelterForAdmin, isAuthError } from "@/lib/shelter-auth";
import { DogForm } from "@/components/shelter/DogForm";

export default async function NewDogPage() {
  const result = await getShelterForAdmin();

  if (isAuthError(result)) {
    redirect("/login");
  }

  const { shelter } = result;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-primary text-white px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/shelter/dogs" className="p-1 -ml-1">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Add New Dog</h1>
            <p className="text-sm text-primary-light">{shelter.name}</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        <DogForm />
      </div>
    </div>
  );
}
