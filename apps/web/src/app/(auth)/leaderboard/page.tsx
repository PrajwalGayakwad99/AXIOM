"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Crown,
  Flame,
  Zap,
  TrendingUp,
  ChevronDown,
  Search,
  ArrowUp,
  ArrowDown,
  Minus,
  Star,
  Code2,
} from "lucide-react";

// ─────────────────────────────────────────────
// Mock leaderboard data
// ─────────────────────────────────────────────

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  challengesSolved: number;
  trend: "up" | "down" | "same";
  trendDelta: number;
  badges: string[];
  isCurrentUser?: boolean;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Sarah Chen",
    avatar: "SC",
    xp: 12450,
    level: 24,
    streak: 45,
    challengesSolved: 187,
    trend: "same",
    trendDelta: 0,
    badges: ["🏆", "🔥", "⭐"],
  },
  {
    rank: 2,
    name: "Marcus Williams",
    avatar: "MW",
    xp: 11200,
    level: 22,
    streak: 31,
    challengesSolved: 164,
    trend: "up",
    trendDelta: 1,
    badges: ["🥈", "💎"],
  },
  {
    rank: 3,
    name: "Aiko Tanaka",
    avatar: "AT",
    xp: 10800,
    level: 21,
    streak: 28,
    challengesSolved: 152,
    trend: "up",
    trendDelta: 2,
    badges: ["🥉", "🔥"],
  },
  {
    rank: 4,
    name: "James Rodriguez",
    avatar: "JR",
    xp: 9350,
    level: 19,
    streak: 14,
    challengesSolved: 138,
    trend: "down",
    trendDelta: 1,
    badges: ["⭐"],
  },
  {
    rank: 5,
    name: "Emma Davis",
    avatar: "ED",
    xp: 8700,
    level: 18,
    streak: 22,
    challengesSolved: 129,
    trend: "up",
    trendDelta: 3,
    badges: ["🔥"],
  },
  {
    rank: 6,
    name: "Alex Johnson",
    avatar: "AJ",
    xp: 1250,
    level: 5,
    streak: 7,
    challengesSolved: 15,
    trend: "up",
    trendDelta: 6,
    badges: [],
    isCurrentUser: true,
  },
  {
    rank: 7,
    name: "Priya Patel",
    avatar: "PP",
    xp: 7900,
    level: 16,
    streak: 19,
    challengesSolved: 118,
    trend: "same",
    trendDelta: 0,
    badges: ["💎"],
  },
  {
    rank: 8,
    name: "Lucas Kim",
    avatar: "LK",
    xp: 7200,
    level: 15,
    streak: 9,
    challengesSolved: 105,
    trend: "down",
    trendDelta: 2,
    badges: [],
  },
  {
    rank: 9,
    name: "Nina Sharma",
    avatar: "NS",
    xp: 6800,
    level: 14,
    streak: 12,
    challengesSolved: 98,
    trend: "up",
    trendDelta: 1,
    badges: ["🔥"],
  },
  {
    rank: 10,
    name: "Oliver Brown",
    avatar: "OB",
    xp: 6500,
    level: 13,
    streak: 5,
    challengesSolved: 91,
    trend: "down",
    trendDelta: 3,
    badges: [],
  },
];

type TimeRange = "weekly" | "monthly" | "allTime";
type SortField = "xp" | "streak" | "challenges";

// ─────────────────────────────────────────────
// Rank decoration
// ─────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-yellow-500/20 border border-amber-400/30 flex items-center justify-center">
        <Crown className="w-5 h-5 text-amber-400" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-300/10 to-slate-400/10 border border-slate-300/20 flex items-center justify-center">
        <Medal className="w-5 h-5 text-slate-300" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400/10 to-amber-600/10 border border-orange-400/20 flex items-center justify-center">
        <Medal className="w-5 h-5 text-orange-400" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
      <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    </div>
  );
}

function TrendIndicator({
  trend,
  delta,
}: {
  trend: string;
  delta: number;
}) {
  if (trend === "up") {
    return (
      <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
        <ArrowUp className="w-3 h-3" />
        {delta}
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span className="flex items-center gap-0.5 text-[10px] text-rose-400">
        <ArrowDown className="w-3 h-3" />
        {delta}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/50">
      <Minus className="w-3 h-3" />
    </span>
  );
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function LeaderboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  const [sortField, setSortField] = useState<SortField>("xp");
  const [search, setSearch] = useState("");

  const filteredAndSorted = useMemo(() => {
    let result = [...mockLeaderboard];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.name.toLowerCase().includes(q));
    }

    switch (sortField) {
      case "streak":
        result.sort((a, b) => b.streak - a.streak);
        break;
      case "challenges":
        result.sort((a, b) => b.challengesSolved - a.challengesSolved);
        break;
      default:
        result.sort((a, b) => b.xp - a.xp);
    }

    return result.map((e, i) => ({ ...e, rank: i + 1 }));
  }, [search, sortField]);

  // Find current user
  const currentUser = mockLeaderboard.find((e) => e.isCurrentUser);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          See how you rank among the top coders on CodeVision AI
        </p>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        {/* 2nd Place */}
        <div className="glass-card p-5 text-center mt-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-slate-300/20 to-slate-500/20 flex items-center justify-center text-xl font-bold text-slate-300 border-2 border-slate-300/20 mb-3">
            {mockLeaderboard[1].avatar}
          </div>
          <Medal className="w-5 h-5 text-slate-300 mx-auto mb-1" />
          <p className="text-sm font-semibold text-white">
            {mockLeaderboard[1].name}
          </p>
          <p className="text-xs text-muted-foreground">
            Level {mockLeaderboard[1].level}
          </p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-sm font-bold text-amber-400">
              {mockLeaderboard[1].xp.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* 1st Place */}
        <div className="glass-card p-5 text-center relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-400/5 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-400/30 to-yellow-600/30 flex items-center justify-center text-2xl font-bold text-amber-300 border-2 border-amber-400/30 mb-3 shadow-lg shadow-amber-400/10">
              {mockLeaderboard[0].avatar}
            </div>
            <Crown className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <p className="text-base font-bold text-white">
              {mockLeaderboard[0].name}
            </p>
            <p className="text-xs text-muted-foreground">
              Level {mockLeaderboard[0].level}
            </p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-lg font-bold text-amber-400">
                {mockLeaderboard[0].xp.toLocaleString()} XP
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {mockLeaderboard[0].badges.map((badge, i) => (
                <span key={i} className="text-sm">{badge}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="glass-card p-5 text-center mt-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-orange-400/20 to-amber-600/20 flex items-center justify-center text-xl font-bold text-orange-400 border-2 border-orange-400/20 mb-3">
            {mockLeaderboard[2].avatar}
          </div>
          <Medal className="w-5 h-5 text-orange-400 mx-auto mb-1" />
          <p className="text-sm font-semibold text-white">
            {mockLeaderboard[2].name}
          </p>
          <p className="text-xs text-muted-foreground">
            Level {mockLeaderboard[2].level}
          </p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-sm font-bold text-amber-400">
              {mockLeaderboard[2].xp.toLocaleString()} XP
            </span>
          </div>
        </div>
      </motion.div>

      {/* Your Ranking Card */}
      {currentUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="glass-card p-4 bg-gradient-to-r from-brand-blue/[0.06] to-brand-purple/[0.06] border-brand-blue/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-lg font-bold text-white">
                {currentUser.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">
                    Your Ranking
                  </p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
                    #{currentUser.rank}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Level {currentUser.level} · {currentUser.xp.toLocaleString()}{" "}
                  XP
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Streak
                </p>
                <div className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-sm font-bold text-rose-400">
                    {currentUser.streak}d
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Solved
                </p>
                <div className="flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">
                    {currentUser.challengesSolved}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Trend
                </p>
                <TrendIndicator
                  trend={currentUser.trend}
                  delta={currentUser.trendDelta}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {/* Time range */}
          {(["weekly", "monthly", "allTime"] as TimeRange[]).map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                timeRange === t
                  ? "bg-brand-blue/20 text-brand-blue border border-brand-blue/20"
                  : "bg-white/[0.03] text-muted-foreground hover:text-white border border-white/5"
              }`}
            >
              {t === "weekly"
                ? "This Week"
                : t === "monthly"
                  ? "This Month"
                  : "All Time"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-48 bg-white/[0.03] border border-white/5 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="appearance-none bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5 pr-7 text-xs text-muted-foreground focus:outline-none focus:border-brand-blue/50 transition-colors"
            >
              <option value="xp" className="bg-[#13131D]">
                Sort by XP
              </option>
              <option value="streak" className="bg-[#13131D]">
                Sort by Streak
              </option>
              <option value="challenges" className="bg-[#13131D]">
                Sort by Challenges
              </option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass-card overflow-hidden"
      >
        {/* Table header */}
        <div className="grid grid-cols-[60px_1fr_100px_100px_80px_80px_60px] gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.01]">
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium">
            Rank
          </span>
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium">
            User
          </span>
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium text-right">
            XP
          </span>
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium text-right">
            Challenges
          </span>
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium text-right">
            Streak
          </span>
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium text-right">
            Level
          </span>
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium text-center">
            Trend
          </span>
        </div>

        {/* Rows */}
        {filteredAndSorted.map((entry, i) => (
          <motion.div
            key={entry.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`grid grid-cols-[60px_1fr_100px_100px_80px_80px_60px] gap-2 px-4 py-3 items-center border-b border-white/[0.03] transition-colors hover:bg-white/[0.02] ${
              entry.isCurrentUser
                ? "bg-brand-blue/[0.04] border-l-2 border-l-brand-blue"
                : ""
            }`}
          >
            {/* Rank */}
            <div>
              <RankBadge rank={entry.rank} />
            </div>

            {/* User */}
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  entry.isCurrentUser
                    ? "bg-gradient-to-br from-brand-blue to-brand-purple text-white"
                    : entry.rank <= 3
                      ? "bg-gradient-to-br from-amber-400/10 to-amber-600/10 text-amber-400 border border-amber-400/10"
                      : "bg-white/5 text-muted-foreground border border-white/5"
                }`}
              >
                {entry.avatar}
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${
                    entry.isCurrentUser ? "text-brand-blue" : "text-white"
                  }`}
                >
                  {entry.name}
                  {entry.isCurrentUser && (
                    <span className="text-[9px] ml-1.5 text-brand-blue/70">
                      (You)
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-1">
                  {entry.badges.map((badge, j) => (
                    <span key={j} className="text-[10px]">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* XP */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="text-sm font-semibold text-white">
                  {entry.xp.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Challenges */}
            <div className="text-right">
              <span className="text-sm text-muted-foreground">
                {entry.challengesSolved}
              </span>
            </div>

            {/* Streak */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Flame className="w-3 h-3 text-rose-400" />
                <span className="text-sm text-white font-medium">
                  {entry.streak}d
                </span>
              </div>
            </div>

            {/* Level */}
            <div className="text-right">
              <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-muted-foreground border border-white/5">
                Lv.{entry.level}
              </span>
            </div>

            {/* Trend */}
            <div className="flex justify-center">
              <TrendIndicator trend={entry.trend} delta={entry.trendDelta} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
