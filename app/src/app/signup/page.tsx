"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import {
  getAnonymousSwipes,
  clearAnonymousSwipes,
  hasAnonymousSwipes,
} from "@/lib/anonymous-swipes";

async function mergeAnonymousSwipes(): Promise<void> {
  if (!hasAnonymousSwipes()) return;

  const swipes = getAnonymousSwipes();

  try {
    const response = await fetch("/api/likes/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ swipes }),
    });

    if (response.ok) {
      clearAnonymousSwipes();
    } else {
      console.error("Failed to merge swipes:", await response.text());
    }
  } catch (error) {
    console.error("Error merging swipes:", error);
  }
}

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/swipe";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Create account
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        return;
      }

      // Auto sign in after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Account created but sign in failed - redirect to login
        router.push(
          `/login${callbackUrl !== "/swipe" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`
        );
      } else {
        // Merge anonymous swipes after successful signup and login
        await mergeAnonymousSwipes();

        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 bg-white">
      {/* Logo */}
      <div className="text-center mb-8">
        <PawPrint className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
        <p className="text-gray-500 mt-1">Join Dog Tinder today</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Sign Up Form */}
      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        <Input
          label="Name"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          className="mt-6"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      {/* Sign In Link */}
      <p className="text-center mt-8 text-gray-500">
        Already have an account?{" "}
        <Link
          href={`/login${callbackUrl !== "/swipe" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
          className="text-primary font-medium hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpFallback />}>
      <SignUpForm />
    </Suspense>
  );
}

function SignUpFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white">
      <PawPrint className="w-12 h-12 text-primary mx-auto mb-4" />
      <p className="text-gray-500">Loading...</p>
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
