import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute =
        nextUrl.pathname.startsWith("/swipe") ||
        nextUrl.pathname.startsWith("/favorites") ||
        nextUrl.pathname.startsWith("/appointments") ||
        nextUrl.pathname.startsWith("/messages") ||
        nextUrl.pathname.startsWith("/profile") ||
        nextUrl.pathname.startsWith("/dog/") ||
        nextUrl.pathname.startsWith("/appointment/");

      const isOnShelterRoute = nextUrl.pathname.startsWith("/shelter");
      const isOnAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/signup";

      if (isOnShelterRoute) {
        // Shelter routes require SHELTER_ADMIN or ADMIN role
        // This is a basic check - full role check happens in the page
        return isLoggedIn;
      }

      if (isOnProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }

      if (isOnAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/swipe", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Providers are configured in auth.ts
} satisfies NextAuthConfig;
