import Link from "next/link";
import { Button } from "@/components/Button";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 bg-white">
      {/* Logo area - simplified since mockup shows minimal design */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <PawPrint className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dog Tinder</h1>
          <p className="text-gray-500">Find your perfect furry companion</p>
        </div>
      </div>

      {/* Get Started Button */}
      <div className="w-full pb-16">
        <Link href="/login">
          <Button fullWidth size="lg">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}

function PawPrint({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
      <ellipse cx="32" cy="44" rx="14" ry="12" />
      <circle cx="20" cy="28" r="6" />
      <circle cx="44" cy="28" r="6" />
      <circle cx="14" cy="38" r="5" />
      <circle cx="50" cy="38" r="5" />
    </svg>
  );
}
