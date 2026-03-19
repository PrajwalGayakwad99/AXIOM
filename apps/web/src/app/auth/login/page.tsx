"use client";

import { signIn, getSession } from "next-auth/react";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5 } },
};

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorUrl = searchParams.get("error");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(errorUrl || "");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    
    try {
      const res = await signIn("credentials", { 
        email, 
        password, 
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg("Invalid email or password");
        setIsLoading(false);
      } else {
        // Get session to determine role-based redirect
        const session = await getSession();
        const role = session?.user?.role;
        
        let redirectUrl = "/dashboard";
        if (role === "ADMIN") {
          redirectUrl = "/admin/dashboard";
        } else if (role === "TEACHER") {
          redirectUrl = "/teacher/dashboard";
        } else if (role === "RECRUITER") {
          redirectUrl = "/recruiter/dashboard";
        }
        
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-surface-primary to-[#050508]">
      {/* Background Effects */}
      <div className="glow-orb glow-orb-blue w-[500px] h-[500px] -top-60 -right-40 opacity-30 pointer-events-none absolute rounded-full blur-3xl mix-blend-screen" />
      <div className="glow-orb glow-orb-purple w-[400px] h-[400px] -bottom-40 -left-40 opacity-30 pointer-events-none absolute rounded-full blur-3xl mix-blend-screen" />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              CV
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              CodeVision <span className="text-brand-blue">AI</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground/80">
            Sign in to continue your learning journey
          </p>
        </motion.div>

        {/* Card */}
        <motion.div variants={fadeUp} className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-2xl p-6 shadow-2xl relative">
          
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
              <span className="text-red-400 text-sm">{errorMsg}</span>
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/auth/callback" })}
              className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 transition-colors font-medium border border-transparent shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => signIn("github", { callbackUrl: "/auth/callback" })}
              className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-[#18181B] text-white hover:bg-[#27272A] transition-colors font-medium border border-white/10 shadow-sm"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-[#0A0A0F] text-[10px] text-muted-foreground uppercase tracking-widest font-medium rounded-full border border-white/5">
                or
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-muted-foreground">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] text-brand-blue hover:text-brand-blue/80 transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-90 transition-opacity mt-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(56,189,248,0.4)]"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </span>
            </button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p variants={fadeUp} className="text-center text-sm text-muted-foreground mt-6 font-medium">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-brand-blue hover:text-brand-purple transition-colors bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-purple">
            Register here
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4 py-12 relative overflow-hidden bg-gradient-to-b from-surface-primary to-[#050508]">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
