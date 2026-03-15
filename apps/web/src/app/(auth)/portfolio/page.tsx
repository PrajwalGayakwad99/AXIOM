"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  User,
  Github,
  Globe,
  MapPin,
  Calendar,
  Zap,
  Trophy,
  Flame,
  Code2,
  CheckCircle2,
  Star,
  BookOpen,
  BarChart3,
  ExternalLink,
  Edit,
  Share2,
  Copy,
  Check,
} from "lucide-react";

// ─────────────────────────────────────────────
// Mock profile data
// ─────────────────────────────────────────────

const profileData = {
  name: "Alex Johnson",
  username: "@alexjohnson",
  avatar: "AJ",
  bio: "Full-stack developer & CS student. Passionate about algorithms, AI, and building things that matter.",
  location: "Mumbai, India",
  joinDate: "Jan 2026",
  github: "github.com/alexjohnson",
  portfolio: "alexjohnson.dev",
  level: 5,
  xp: 1250,
  xpToNextLevel: 2000,
  rank: 142,
  streak: 7,
  maxStreak: 14,
  challengesSolved: 15,
  totalChallenges: 120,
  lessonsCompleted: 8,
  totalLessons: 45,
  hoursLearned: 32,
};

const stats = {
  languages: [
    { name: "Python", solved: 10, percentage: 67 },
    { name: "JavaScript", solved: 3, percentage: 20 },
    { name: "TypeScript", solved: 2, percentage: 13 },
  ],
  difficulties: [
    { name: "Easy", solved: 8, total: 40, color: "text-emerald-400", bg: "bg-emerald-400" },
    { name: "Medium", solved: 5, total: 50, color: "text-amber-400", bg: "bg-amber-400" },
    { name: "Hard", solved: 2, total: 30, color: "text-rose-400", bg: "bg-rose-400" },
  ],
  recentActivity: [
    {
      type: "challenge",
      title: "Reverse Linked List",
      result: "solved",
      xp: 20,
      time: "2h ago",
    },
    {
      type: "lesson",
      title: "Singly Linked Lists",
      result: "completed",
      xp: 25,
      time: "5h ago",
    },
    {
      type: "challenge",
      title: "Two Sum",
      result: "solved",
      xp: 15,
      time: "1d ago",
    },
    {
      type: "challenge",
      title: "Valid Parentheses",
      result: "attempted",
      xp: 0,
      time: "1d ago",
    },
    {
      type: "lesson",
      title: "Hash Maps & Dictionaries",
      result: "completed",
      xp: 20,
      time: "2d ago",
    },
  ],
  badges: [
    { name: "First Steps", icon: "🎯", description: "Complete your first lesson", earned: true },
    { name: "Code Warrior", icon: "⚔️", description: "Solve 10 challenges", earned: true },
    { name: "Hot Streak", icon: "🔥", description: "Maintain a 7-day streak", earned: true },
    { name: "Polyglot", icon: "🌍", description: "Code in 3+ languages", earned: true },
    { name: "Centurion", icon: "💯", description: "Solve 100 challenges", earned: false },
    { name: "Night Owl", icon: "🦉", description: "Code after midnight", earned: false },
    { name: "Mentor", icon: "🧑‍🏫", description: "Help 10 community members", earned: false },
    { name: "Speed Demon", icon: "⚡", description: "Solve a hard problem in < 10 min", earned: false },
  ],
  // Contribution heatmap data (last 12 weeks)
  contributions: Array.from({ length: 84 }, (_, i) => ({
    day: i,
    count: Math.random() > 0.4 ? Math.floor(Math.random() * 5) : 0,
  })),
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "badges" | "activity">(
    "overview"
  );
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const xpProgress =
    (profileData.xp / profileData.xpToNextLevel) * 100;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-6 relative overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/5 via-brand-purple/5 to-transparent pointer-events-none" />

        <div className="relative flex items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-brand-blue/20 shrink-0">
            {profileData.avatar}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-white">
                {profileData.name}
              </h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-brand-blue/10 text-brand-blue border border-brand-blue/20 font-semibold">
                Level {profileData.level}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                #{profileData.rank}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {profileData.username}
            </p>
            <p className="text-xs text-muted-foreground mt-2 max-w-lg">
              {profileData.bio}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {profileData.location}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Calendar className="w-3 h-3" />
                Joined {profileData.joinDate}
              </span>
              <a
                href={`https://${profileData.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-brand-blue transition-colors"
              >
                <Github className="w-3 h-3" />
                {profileData.github}
              </a>
              <a
                href={`https://${profileData.portfolio}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-brand-blue transition-colors"
              >
                <Globe className="w-3 h-3" />
                {profileData.portfolio}
              </a>
            </div>

            {/* XP progress */}
            <div className="mt-3 max-w-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground">
                  {profileData.xp} / {profileData.xpToNextLevel} XP
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Level {profileData.level + 1}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-purple"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/settings"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-muted-foreground hover:text-white border border-white/5 transition-colors"
            >
              <Edit className="w-3 h-3" />
              Edit Profile
            </Link>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-muted-foreground hover:text-white border border-white/5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3" />
                  Share
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        {[
          {
            label: "Challenges Solved",
            value: profileData.challengesSolved,
            icon: Code2,
            color: "text-brand-blue",
          },
          {
            label: "Lessons Done",
            value: profileData.lessonsCompleted,
            icon: BookOpen,
            color: "text-emerald-400",
          },
          {
            label: "Current Streak",
            value: `${profileData.streak}d`,
            icon: Flame,
            color: "text-rose-400",
          },
          {
            label: "Hours Learned",
            value: profileData.hoursLearned,
            icon: BarChart3,
            color: "text-amber-400",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex items-center gap-1 border-b border-white/5 pb-0"
      >
        {(["overview", "badges", "activity"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-medium transition-colors relative ${
              activeTab === tab
                ? "text-brand-blue"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <motion.div
                layoutId="portfolio-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full"
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Contribution Heatmap */}
            <div className="col-span-2 glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3">
                Activity Heatmap
              </h3>
              <div className="flex flex-wrap gap-[3px]">
                {stats.contributions.map((day, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-sm transition-colors ${
                      day.count === 0
                        ? "bg-white/[0.03]"
                        : day.count === 1
                          ? "bg-brand-blue/20"
                          : day.count === 2
                            ? "bg-brand-blue/40"
                            : day.count === 3
                              ? "bg-brand-blue/60"
                              : "bg-brand-blue/80"
                    }`}
                    title={`${day.count} contributions`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-[9px] text-muted-foreground/50">
                  Less
                </span>
                {[0.03, 0.2, 0.4, 0.6, 0.8].map((opacity, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor:
                        opacity === 0.03
                          ? "rgba(255,255,255,0.03)"
                          : `rgba(59,130,246,${opacity})`,
                    }}
                  />
                ))}
                <span className="text-[9px] text-muted-foreground/50">
                  More
                </span>
              </div>
            </div>

            {/* Languages */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3">
                Languages Used
              </h3>
              <div className="space-y-3">
                {stats.languages.map((lang) => (
                  <div key={lang.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white font-medium">
                        {lang.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {lang.solved} solved ({lang.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-purple"
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3">
                Difficulty Breakdown
              </h3>
              <div className="space-y-3">
                {stats.difficulties.map((diff) => (
                  <div key={diff.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${diff.color}`}>
                        {diff.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {diff.solved}/{diff.total}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${diff.bg}`}
                        style={{
                          width: `${(diff.solved / diff.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="text-sm font-bold text-white">
                  {profileData.challengesSolved}/{profileData.totalChallenges}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── BADGES TAB ── */}
        {activeTab === "badges" && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-4 gap-3">
              {stats.badges.map((badge, i) => (
                <motion.div
                  key={badge.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className={`glass-card p-4 text-center transition-all ${
                    badge.earned
                      ? "hover:border-brand-blue/20"
                      : "opacity-40 grayscale"
                  }`}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <p className="text-xs font-semibold text-white mb-0.5">
                    {badge.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {badge.description}
                  </p>
                  {badge.earned && (
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span className="text-[9px] text-emerald-400 font-medium">
                        Earned
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground/50 text-center mt-4">
              {stats.badges.filter((b) => b.earned).length} of{" "}
              {stats.badges.length} badges earned
            </p>
          </motion.div>
        )}

        {/* ── ACTIVITY TAB ── */}
        {activeTab === "activity" && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="glass-card divide-y divide-white/5">
              {stats.recentActivity.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 p-4"
                >
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      item.result === "solved" || item.result === "completed"
                        ? "bg-emerald-500/10 border border-emerald-500/20"
                        : "bg-amber-500/10 border border-amber-500/20"
                    }`}
                  >
                    {item.type === "challenge" ? (
                      <Code2
                        className={`w-4 h-4 ${
                          item.result === "solved"
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      />
                    ) : (
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {item.type === "challenge" ? "Challenge" : "Lesson"} ·{" "}
                      {item.result === "solved"
                        ? "Solved"
                        : item.result === "completed"
                          ? "Completed"
                          : "Attempted"}
                    </p>
                  </div>

                  {/* XP */}
                  {item.xp > 0 && (
                    <div className="flex items-center gap-1 text-amber-400">
                      <Zap className="w-3 h-3" />
                      <span className="text-xs font-semibold">
                        +{item.xp} XP
                      </span>
                    </div>
                  )}

                  {/* Time */}
                  <span className="text-[10px] text-muted-foreground/60 shrink-0">
                    {item.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
