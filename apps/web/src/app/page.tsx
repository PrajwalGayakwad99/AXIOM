"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import {
  Brain,
  Code2,
  Trophy,
  Users,
  Zap,
  Eye,
  MessageSquare,
  BarChart3,
  ChevronDown,
  Play,
  Sparkles,
  Globe,
} from "lucide-react";
import { ParticleBackground } from "@/components/shared/particle-background";
import { TypewriterText } from "@/components/shared/typewriter-text";
import { FloatingCodeWindow } from "@/components/shared/floating-code-window";

/* ── Animation Variants ───────────────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 30, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6 },
  },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

/* ── Features Data ────────────────────────────────── */
const features = [
  {
    icon: Eye,
    title: "Visual Code Execution",
    description:
      "Watch your code come alive. See variables change, stacks grow, and algorithms unfold in real-time animated visualizations.",
    gradient: "from-brand-blue to-brand-cyan",
    span: "col-span-2",
  },
  {
    icon: Brain,
    title: "AI Tutor",
    description:
      "A Socratic tutor that guides you with questions, not answers. Powered by Claude, DeepSeek, and GPT.",
    gradient: "from-brand-purple to-brand-pink",
    span: "col-span-1",
  },
  {
    icon: Code2,
    title: "Live Playground",
    description:
      "Full Monaco editor with Docker-sandboxed execution. Write, run, and debug in 10+ languages.",
    gradient: "from-brand-cyan to-brand-blue",
    span: "col-span-1",
  },
  {
    icon: Trophy,
    title: "Challenges & XP",
    description:
      "Compete on the leaderboard, earn badges, and level up with our gamified challenge system.",
    gradient: "from-brand-pink to-brand-purple",
    span: "col-span-2",
  },
  {
    icon: Users,
    title: "Live Collaboration",
    description:
      "Code together in real-time with multi-cursor editing, voice chat, and shared execution.",
    gradient: "from-brand-blue to-brand-purple",
    span: "col-span-1",
  },
  {
    icon: BarChart3,
    title: "Teacher Analytics",
    description:
      "Track student performance, detect skill gaps, and get AI-powered insights for your class.",
    gradient: "from-brand-cyan to-brand-purple",
    span: "col-span-1",
  },
  {
    icon: MessageSquare,
    title: "Community Forums",
    description:
      "Share solutions, ask questions, and learn from peers. AI auto-answers common questions.",
    gradient: "from-brand-purple to-brand-blue",
    span: "col-span-1",
  },
];

/* ── Stats Data ───────────────────────────────────── */
const stats = [
  { value: 12500, suffix: "+", label: "Students Learning" },
  { value: 150, suffix: "+", label: "Interactive Courses" },
  { value: 2000, suffix: "+", label: "Coding Challenges" },
  { value: 45, suffix: "", label: "Countries" },
];

/* ══════════════════════════════════════════════════ */
export default function LandingPage() {
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div className="relative min-h-screen bg-surface-primary overflow-hidden">
      {/* ── Navbar ──────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-surface-primary/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white text-sm font-bold">
              CV
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              CodeVision <span className="text-brand-blue">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#stats" className="hover:text-white transition-colors">Stats</a>
            <Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/auth/login" className="btn-glow text-sm px-5 py-2">
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ───────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background layers */}
        <ParticleBackground />
        <div className="glow-orb glow-orb-blue w-[600px] h-[600px] -top-40 -left-40" />
        <div className="glow-orb glow-orb-purple w-[500px] h-[500px] top-1/4 right-0" />
        <div className="glow-orb glow-orb-pink w-[300px] h-[300px] bottom-20 left-1/3" />
        <div className="absolute inset-0 grid-bg" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-8">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-brand-blue" />
                AI-Powered Visual Learning Platform
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-white">
                Learn Code.
                <br />
                <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent">
                  See It Move.
                </span>
              </motion.h1>

              <motion.div variants={fadeUp} className="text-xl md:text-2xl text-muted-foreground h-8">
                <TypewriterText />
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-2">
                <Link href="/auth/login" className="btn-glow text-base px-8 py-3.5">
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Start Learning Free
                  </span>
                </Link>
                <button className="btn-ghost text-base px-8 py-3.5 flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue/60 to-brand-purple/60 border-2 border-surface-primary" />
                  ))}
                </div>
                <span>12,500+ students already learning</span>
              </motion.div>
            </motion.div>

            {/* Right: code window */}
            <div className="hidden lg:block">
              <FloatingCodeWindow />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs">Scroll to explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features Bento Grid ────────────────── */}
      <section id="features" className="relative py-32 noise-overlay">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16 space-y-4"
          >
            <motion.p variants={fadeUp} className="text-sm font-medium text-brand-blue tracking-wider uppercase">
              Features
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-white">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
                master coding
              </span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-4"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`glass-card p-6 group ${feature.span}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats Section ──────────────────────── */}
      <section id="stats" ref={statsRef} className="relative py-24 border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-glow" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-2"
              >
                <p className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
                  {statsInView ? (
                    <CountUp end={stat.value} duration={2.5} separator="," suffix={stat.suffix} />
                  ) : (
                    "0"
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white text-[10px] font-bold">
              CV
            </div>
            <span>CodeVision AI © 2026</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            <span>Available worldwide</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
