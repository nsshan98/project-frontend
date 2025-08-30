import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  const path = req.nextUrl.pathname;

  // Public Routes
  const publicRoutes = ["/auth/login"];

  const isAuthenticated = !!req.auth;
  const isPublicRoute = publicRoutes.includes(path);

  console.log(isAuthenticated, 'isAuthenticated')
  console.log(req.auth);

  // Redirect unauthenticated users ONLY if not on a public route
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Redirect authenticated users away from public routes
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
