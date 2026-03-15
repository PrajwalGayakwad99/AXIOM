"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Filter,
  Trophy,
  Flame,
  Clock,
  CheckCircle2,
  ChevronDown,
  Zap,
  Star,
  Code2,
  ArrowRight,
  TrendingUp,
  Target,
  Lock,
  Sparkles,
} from "lucide-react";

// ─────────────────────────────────────────────
// Mock Challenge Data
// ─────────────────────────────────────────────

interface Challenge {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  category: string;
  xpReward: number;
  completionRate: number;
  totalSubmissions: number;
  tags: string[];
  isSolved: boolean;
  isNew: boolean;
  isPremium: boolean;
}

const mockChallenges: Challenge[] = [
  {
    id: "c1",
    title: "Two Sum",
    difficulty: "EASY",
    category: "Arrays",
    xpReward: 15,
    completionRate: 92,
    totalSubmissions: 12500,
    tags: ["arrays", "hash-map"],
    isSolved: true,
    isNew: false,
    isPremium: false,
  },
  {
    id: "c2",
    title: "Reverse Linked List",
    difficulty: "EASY",
    category: "Linked Lists",
    xpReward: 20,
    completionRate: 85,
    totalSubmissions: 8700,
    tags: ["linked-list", "pointers"],
    isSolved: true,
    isNew: false,
    isPremium: false,
  },
  {
    id: "c3",
    title: "Valid Parentheses",
    difficulty: "EASY",
    category: "Stacks",
    xpReward: 15,
    completionRate: 88,
    totalSubmissions: 10200,
    tags: ["stack", "strings"],
    isSolved: false,
    isNew: false,
    isPremium: false,
  },
  {
    id: "c4",
    title: "Longest Substring Without Repeating",
    difficulty: "MEDIUM",
    category: "Strings",
    xpReward: 30,
    completionRate: 65,
    totalSubmissions: 9100,
    tags: ["sliding-window", "strings", "hash-map"],
    isSolved: false,
    isNew: true,
    isPremium: false,
  },
  {
    id: "c5",
    title: "Binary Tree Level Order Traversal",
    difficulty: "MEDIUM",
    category: "Trees",
    xpReward: 35,
    completionRate: 60,
    totalSubmissions: 6400,
    tags: ["trees", "bfs", "queue"],
    isSolved: false,
    isNew: false,
    isPremium: false,
  },
  {
    id: "c6",
    title: "Merge Intervals",
    difficulty: "MEDIUM",
    category: "Arrays",
    xpReward: 30,
    completionRate: 58,
    totalSubmissions: 7800,
    tags: ["arrays", "sorting"],
    isSolved: false,
    isNew: false,
    isPremium: false,
  },
  {
    id: "c7",
    title: "LRU Cache",
    difficulty: "HARD",
    category: "Design",
    xpReward: 50,
    completionRate: 35,
    totalSubmissions: 4200,
    tags: ["design", "hash-map", "linked-list"],
    isSolved: false,
    isNew: false,
    isPremium: true,
  },
  {
    id: "c8",
    title: "Median of Two Sorted Arrays",
    difficulty: "HARD",
    category: "Arrays",
    xpReward: 60,
    completionRate: 28,
    totalSubmissions: 3500,
    tags: ["binary-search", "arrays", "divide-conquer"],
    isSolved: false,
    isNew: true,
    isPremium: true,
  },
  {
    id: "c9",
    title: "Word Ladder",
    difficulty: "HARD",
    category: "Graphs",
    xpReward: 55,
    completionRate: 32,
    totalSubmissions: 2800,
    tags: ["bfs", "graphs", "strings"],
    isSolved: false,
    isNew: false,
    isPremium: false,
  },
];

const categories = [
  "All",
  "Arrays",
  "Strings",
  "Linked Lists",
  "Trees",
  "Graphs",
  "Stacks",
  "Design",
];

// ─────────────────────────────────────────────
// Difficulty badge
// ─────────────────────────────────────────────

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const config = {
    EASY: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    MEDIUM: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
    },
    HARD: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/20",
    },
  }[difficulty] || { bg: "bg-white/5", text: "text-white", border: "border-white/10" };

  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}
    >
      {difficulty}
    </span>
  );
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function ChallengesPage() {
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"xp" | "completion" | "newest">("newest");

  // Filter challenges
  const filteredChallenges = useMemo(() => {
    let result = [...mockChallenges];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.tags.some((t) => t.includes(q))
      );
    }

    // Difficulty
    if (selectedDifficulty !== "ALL") {
      result = result.filter((c) => c.difficulty === selectedDifficulty);
    }

    // Category
    if (selectedCategory !== "All") {
      result = result.filter((c) => c.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "xp":
        result.sort((a, b) => b.xpReward - a.xpReward);
        break;
      case "completion":
        result.sort((a, b) => b.completionRate - a.completionRate);
        break;
      case "newest":
        result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
    }

    return result;
  }, [search, selectedDifficulty, selectedCategory, sortBy]);

  // Stats
  const solved = mockChallenges.filter((c) => c.isSolved).length;
  const totalXpEarned = mockChallenges
    .filter((c) => c.isSolved)
    .reduce((sum, c) => sum + c.xpReward, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-white">Challenges</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sharpen your skills with coding challenges and earn XP
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        {[
          {
            label: "Solved",
            value: `${solved}/${mockChallenges.length}`,
            icon: CheckCircle2,
            color: "text-emerald-400",
            bg: "from-emerald-500/10 to-teal-500/10",
          },
          {
            label: "XP Earned",
            value: `${totalXpEarned}`,
            icon: Zap,
            color: "text-amber-400",
            bg: "from-amber-500/10 to-orange-500/10",
          },
          {
            label: "Current Streak",
            value: "7 days",
            icon: Flame,
            color: "text-rose-400",
            bg: "from-rose-500/10 to-pink-500/10",
          },
          {
            label: "Rank",
            value: "#142",
            icon: Trophy,
            color: "text-brand-blue",
            bg: "from-blue-500/10 to-cyan-500/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`glass-card p-4 bg-gradient-to-br ${stat.bg}`}
          >
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

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search challenges by name or tag..."
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all ${
              showFilters
                ? "border-brand-blue/30 bg-brand-blue/10 text-brand-blue"
                : "border-white/5 bg-white/[0.02] text-muted-foreground hover:text-white"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 pr-8 text-sm text-muted-foreground focus:outline-none focus:border-brand-blue/50 transition-colors"
            >
              <option value="newest" className="bg-[#13131D]">
                Newest First
              </option>
              <option value="xp" className="bg-[#13131D]">
                Most XP
              </option>
              <option value="completion" className="bg-[#13131D]">
                Easiest First
              </option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                {/* Difficulty */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Difficulty
                  </span>
                  <div className="flex gap-1">
                    {["ALL", "EASY", "MEDIUM", "HARD"].map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDifficulty(d)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          selectedDifficulty === d
                            ? "bg-brand-blue/20 text-brand-blue"
                            : "bg-white/5 text-muted-foreground hover:text-white"
                        }`}
                      >
                        {d === "ALL" ? "All" : d.charAt(0) + d.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Category
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          selectedCategory === cat
                            ? "bg-brand-purple/20 text-brand-purple"
                            : "bg-white/5 text-muted-foreground hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Challenge List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="space-y-2"
      >
        {filteredChallenges.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No challenges match your filters
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedDifficulty("ALL");
                setSelectedCategory("All");
              }}
              className="text-xs text-brand-blue hover:text-brand-blue/80 mt-2 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredChallenges.map((challenge, i) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/challenges/${challenge.id}`}>
                <div
                  className={`glass-card p-4 flex items-center gap-4 group cursor-pointer ${
                    challenge.isSolved ? "opacity-70" : ""
                  }`}
                >
                  {/* Status indicator */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      challenge.isSolved
                        ? "bg-emerald-500/10 border border-emerald-500/20"
                        : "bg-white/5 border border-white/5"
                    }`}
                  >
                    {challenge.isSolved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Code2 className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Challenge info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white group-hover:text-brand-blue transition-colors truncate">
                        {challenge.title}
                      </h3>
                      {challenge.isNew && (
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-brand-blue/10 text-brand-blue border border-brand-blue/20 uppercase tracking-wider">
                          New
                        </span>
                      )}
                      {challenge.isPremium && (
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5" />
                          PRO
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <DifficultyBadge difficulty={challenge.difficulty} />
                      <span className="text-[10px] text-muted-foreground">
                        {challenge.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {challenge.totalSubmissions.toLocaleString()} attempts
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="hidden lg:flex items-center gap-1">
                    {challenge.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[9px] bg-white/5 text-muted-foreground border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Completion bar */}
                  <div className="hidden md:flex flex-col items-end gap-1 w-20">
                    <span className="text-[10px] text-muted-foreground">
                      {challenge.completionRate}%
                    </span>
                    <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-purple"
                        style={{ width: `${challenge.completionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* XP Reward */}
                  <div className="flex items-center gap-1 text-amber-400 shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">
                      {challenge.xpReward} XP
                    </span>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-brand-blue group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Results count */}
      <p className="text-[11px] text-muted-foreground/50 text-center">
        Showing {filteredChallenges.length} of {mockChallenges.length} challenges
      </p>
    </div>
  );
}
