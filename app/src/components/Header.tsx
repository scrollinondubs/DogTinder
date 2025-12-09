"use client";

import Link from "next/link";
import Image from "next/image";
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
          <Link href="/swipe" className="flex items-center">
            <Image
              src="/logo.png"
              alt="SwipeDog"
              width={140}
              height={40}
              className="h-8 w-auto"
              priority
            />
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
