import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  const path = req.nextUrl.pathname;

  // Public Routes
  const publicRoutes = ["/auth/login"];

  const isAuthenticated = !!req.auth;

  // Check if the path matches any public route
  const isPublicRoute = publicRoutes.includes(path);

  // Check if the path starts with `/profile` (handles `/profile` and `/profile/[name]`)
  const isProfileRoute = path.startsWith("/profile");

  // Redirect unauthenticated users away from protected routes
  if (isProfileRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Redirect authenticated users from public routes
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

// Matcher configuration
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};