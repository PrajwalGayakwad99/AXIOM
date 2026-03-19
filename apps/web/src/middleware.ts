import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify",
  "/api/auth",
]

const TEACHER_ROUTES = ["/teacher"]
const ADMIN_ROUTES   = ["/admin"]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Allow all public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Allow public portfolio pages
  if (pathname.startsWith("/portfolio") && !pathname.startsWith("/portfolio/edit")) {
    return NextResponse.next()
  }

  // Not logged in — redirect to login
  if (!session?.user) {
    const loginUrl = new URL("/auth/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Logged in but wrong role — redirect
  const role = (session.user as any).role

  if (TEACHER_ROUTES.some((r) => pathname.startsWith(r)) && role !== "TEACHER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r)) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)",
  ],
}
