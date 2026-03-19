"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session after OAuth callback
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        
        if (session?.user) {
          const role = session.user.role;
          let redirectUrl = "/dashboard";
          
          if (role === "ADMIN") {
            redirectUrl = "/admin/dashboard";
          } else if (role === "TEACHER") {
            redirectUrl = "/teacher/dashboard";
          } else if (role === "RECRUITER") {
            redirectUrl = "/recruiter/dashboard";
          }
          
          router.push(redirectUrl);
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        router.push("/auth/login");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-surface-primary to-[#050508]">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin mx-auto mb-4" />
        <p className="text-white">Completing authentication...</p>
      </div>
    </div>
  );
}
