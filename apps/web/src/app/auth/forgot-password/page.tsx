// PATH: src/app/auth/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  Loader2,
  KeyRound,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { ForgotPasswordFormSchema, type ForgotPasswordFormData } from "@/types";

const fadeUp = {
  initial: { opacity: 0, y: 20, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5 },
  },
};

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      // In production, this would call a password reset API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="glow-orb glow-orb-blue w-[500px] h-[500px] -top-60 -left-40" />
      <div className="glow-orb glow-orb-purple w-[400px] h-[400px] -bottom-40 -right-40" />
      <div className="absolute inset-0 grid-bg" />

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="relative z-10 w-full max-w-md"
      >
        {/* Back Link */}
        <motion.div variants={fadeUp} className="mb-8">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to sign in
          </Link>
        </motion.div>

        {/* Logo */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold animate-pulse-glow">
              CV
            </div>
            <span className="text-xl font-bold text-white">
              CodeVision <span className="text-brand-blue">AI</span>
            </span>
          </Link>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            /* ── Request Form ── */
            <motion.div
              key="form"
              variants={fadeUp}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 border border-white/5 flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-7 h-7 text-brand-blue" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Reset your password
                </h1>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Enter the email address linked to your account and we&apos;ll
                  send you a reset link
                </p>
              </div>

              {/* Card */}
              <div className="glass-card p-6 space-y-5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="you@example.com"
                        autoFocus
                        className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
                      />
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] text-rose-400"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-glow w-full py-3 text-sm"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Send Reset Link
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Security note */}
                <div className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
                    For security, the reset link will expire in 15 minutes. If
                    you don&apos;t receive an email, check your spam folder or
                    contact support.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ── Success State ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.5 },
              }}
              className="text-center"
            >
              {/* Success animation */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                {/* Outer ring */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
                  className="absolute inset-0 rounded-full border-2 border-emerald-500/20"
                />
                {/* Inner ring */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                  className="absolute inset-2 rounded-full border border-emerald-500/10"
                />
                {/* Icon circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, type: "spring", bounce: 0.4 }}
                  className="absolute inset-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </motion.div>
                {/* Sparkle particles */}
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: [0, (i % 2 === 0 ? 1 : -1) * 30],
                      y: [0, (i < 2 ? -1 : 1) * 25],
                    }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    className="absolute top-1/2 left-1/2"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-400/60" />
                  </motion.div>
                ))}
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-white mb-2"
              >
                Check your email
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto"
              >
                We&apos;ve sent a password reset link to{" "}
                <span className="text-white font-medium">{submittedEmail}</span>.
                Please check your inbox.
              </motion.p>

              {/* Action cards */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-5 space-y-3"
              >
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSubmittedEmail("");
                  }}
                  className="w-full py-2.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 text-sm text-muted-foreground hover:text-white transition-all"
                >
                  Try a different email
                </button>

                <Link
                  href="/auth/login"
                  className="btn-glow w-full py-2.5 text-sm block text-center"
                >
                  <span className="flex items-center justify-center gap-2">
                    Return to Sign In
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>

              {/* Resend timer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-[11px] text-muted-foreground/50 mt-4"
              >
                Didn&apos;t receive the email? You can request a new one in 60 seconds.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
