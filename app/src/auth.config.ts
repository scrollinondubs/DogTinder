import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Routes that REQUIRE authentication (user-specific data)
      const isStrictlyProtectedRoute =
        nextUrl.pathname.startsWith("/appointments") || // User's appointment history
        nextUrl.pathname.startsWith("/messages") || // Messaging requires identity
        nextUrl.pathname.startsWith("/profile"); // User profile

      const isOnShelterRoute = nextUrl.pathname.startsWith("/shelter");
      const isOnAuthRoute =
        nextUrl.pathname === "/login" || nextUrl.pathname === "/signup";

      if (isOnShelterRoute) {
        // Shelter routes require SHELTER_ADMIN or ADMIN role
        // This is a basic check - full role check happens in the page
        return isLoggedIn;
      }

      if (isStrictlyProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }

      // These routes are now PUBLIC (anonymous browsing allowed):
      // /swipe - main browsing
      // /favorites - can show localStorage data for anonymous users
      // /dog/* - dog detail pages
      // /appointment/* - allow form interaction, block submission in UI

      if (isOnAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/swipe", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Providers are configured in auth.ts
} satisfies NextAuthConfig;
