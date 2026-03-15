import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const routePermissions: Record<string, string[]> = {
  "/dashboard": ["STUDENT"],
  "/learn": ["STUDENT"],
  "/playground": ["STUDENT"],
  "/challenges": ["STUDENT"],
  "/leaderboard": ["STUDENT"],
  "/ai-tutor": ["STUDENT"],
  "/community": ["STUDENT", "TEACHER", "ADMIN"],
  "/groups": ["STUDENT", "TEACHER", "ADMIN"],
  "/portfolio": ["STUDENT", "TEACHER", "ADMIN"],
  "/teacher": ["TEACHER", "ADMIN"],
  "/admin": ["ADMIN"],
}

const roleDashboards: Record<string, string> = {
  STUDENT: "/dashboard",
  TEACHER: "/teacher/dashboard",
  ADMIN: "/admin/dashboard",
}

export default auth((req) => {
  const { nextUrl, auth: session } = req as any
  const pathname = nextUrl.pathname
  const isLoggedIn = !!session?.user
  const role = session?.user?.role ?? "STUDENT"

  const isAuthPage = pathname.startsWith("/auth")
  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(
        new URL(roleDashboards[role] ?? "/dashboard", nextUrl)
      )
    }
    return NextResponse.next()
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl))
  }

  for (const [route, allowedRoles] of Object.entries(routePermissions)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(role)) {
        return NextResponse.redirect(
          new URL(roleDashboards[role] ?? "/dashboard", nextUrl)
        )
      }
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
