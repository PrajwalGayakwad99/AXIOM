"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

function CallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return

    if (!session?.user) {
      router.push("/auth/login")
      return
    }

    const role = (session.user as any).role
    const callbackUrl = searchParams.get("callbackUrl")

    if (callbackUrl && callbackUrl.startsWith("/")) {
      router.push(callbackUrl)
      return
    }

    if (role === "ADMIN") router.push("/admin/dashboard")
    else if (role === "TEACHER") router.push("/teacher/dashboard")
    else if (role === "RECRUITER") router.push("/recruiter/dashboard")
    else router.push("/dashboard")
  }, [session, status, router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400 text-sm">Redirecting...</p>
      </div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
