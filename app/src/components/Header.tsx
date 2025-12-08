"use client";

import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showProfile?: boolean;
  showLogo?: boolean;
  backHref?: string;
  className?: string;
}

export function Header({
  title,
  showBack = false,
  showProfile = false,
  showLogo = false,
  backHref = "/",
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <Link
            href={backHref}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
        )}
        {showLogo && (
          <Link href="/swipe" className="flex items-center gap-2">
            <PawIcon className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold text-primary">Dog Tinder</span>
          </Link>
        )}
        {title && !showLogo && (
          <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        )}
      </div>
      {showProfile && (
        <Link
          href="/profile"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <User className="w-5 h-5 text-gray-600" />
        </Link>
      )}
    </header>
  );
}

function PawIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-8 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 8c2.21 0 4-1.79 4-4h-8c0 2.21 1.79 4 4 4z" />
    </svg>
  );
}
