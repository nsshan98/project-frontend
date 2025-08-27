import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isAuthPage = nextUrl.pathname.startsWith("/auth")
  const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard") || nextUrl.pathname.startsWith("/profile")

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl))
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // Handle token refresh errors
  if (req.auth?.error === "RefreshAccessTokenError") {
    return NextResponse.redirect(new URL("/auth/login", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
