"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  Search,
  Filter,
  Plus,
  Clock,
  TrendingUp,
  Hash,
  ChevronDown,
  Eye,
  User,
  PinIcon,
  Sparkles,
  ArrowRight,
  Bookmark,
  Share2,
} from "lucide-react";

// ─────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: { name: string; avatar: string; level: number };
  tags: string[];
  upvotes: number;
  replies: number;
  views: number;
  createdAt: string;
  isPinned: boolean;
  isAIAnswer: boolean;
  isSolved: boolean;
}

const mockPosts: ForumPost[] = [
  {
    id: "p1",
    title: "How to optimize recursive Fibonacci with memoization?",
    content:
      "I understand the basic recursive approach but it's extremely slow for large n values. How can I apply memoization to improve the time complexity from O(2^n) to O(n)?",
    author: { name: "Sarah Chen", avatar: "SC", level: 24 },
    tags: ["python", "recursion", "optimization"],
    upvotes: 42,
    replies: 8,
    views: 312,
    createdAt: "2h ago",
    isPinned: true,
    isAIAnswer: true,
    isSolved: true,
  },
  {
    id: "p2",
    title: "Best resources for learning graph algorithms?",
    content:
      "I want to get better at graph algorithms like BFS, DFS, Dijkstra, etc. What are the best resources beyond what's covered in the learning path here?",
    author: { name: "Marcus Williams", avatar: "MW", level: 22 },
    tags: ["graphs", "algorithms", "resources"],
    upvotes: 35,
    replies: 12,
    views: 458,
    createdAt: "5h ago",
    isPinned: false,
    isAIAnswer: false,
    isSolved: false,
  },
  {
    id: "p3",
    title: "Understanding Big O notation — when does O(n log n) beat O(n²)?",
    content:
      "I'm confused about when the crossover happens. For small inputs, is quadratic sometimes faster?",
    author: { name: "Aiko Tanaka", avatar: "AT", level: 21 },
    tags: ["complexity", "algorithms", "theory"],
    upvotes: 28,
    replies: 6,
    views: 203,
    createdAt: "8h ago",
    isPinned: false,
    isAIAnswer: true,
    isSolved: true,
  },
  {
    id: "p4",
    title: "Show & Tell: My snake game built with Python + Pygame",
    content:
      "Just finished building a snake game as my first portfolio project! Used Pygame for graphics and implemented a simple AI opponent using BFS pathfinding.",
    author: { name: "James Rodriguez", avatar: "JR", level: 19 },
    tags: ["python", "project", "show-and-tell"],
    upvotes: 67,
    replies: 15,
    views: 892,
    createdAt: "1d ago",
    isPinned: false,
    isAIAnswer: false,
    isSolved: false,
  },
  {
    id: "p5",
    title: "Struggling with dynamic programming — any tips?",
    content:
      "I can never figure out the state transitions. I understand the concept of breaking problems into subproblems, but translating that into code is so hard.",
    author: { name: "Emma Davis", avatar: "ED", level: 18 },
    tags: ["dynamic-programming", "help", "algorithms"],
    upvotes: 23,
    replies: 9,
    views: 167,
    createdAt: "1d ago",
    isPinned: false,
    isAIAnswer: false,
    isSolved: false,
  },
  {
    id: "p6",
    title: "TypeScript vs JavaScript for coding interviews?",
    content:
      "Should I use TypeScript in interviews or stick with plain JavaScript? Does type annotation slow me down or help avoid bugs?",
    author: { name: "Lucas Kim", avatar: "LK", level: 15 },
    tags: ["typescript", "javascript", "interviews"],
    upvotes: 19,
    replies: 14,
    views: 321,
    createdAt: "2d ago",
    isPinned: false,
    isAIAnswer: false,
    isSolved: false,
  },
];

const allTags = [
  "All",
  "python",
  "algorithms",
  "recursion",
  "graphs",
  "dynamic-programming",
  "help",
  "project",
  "show-and-tell",
  "interviews",
];

type SortOption = "trending" | "newest" | "top";

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function CommunityPage() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("trending");
  const [showCompose, setShowCompose] = useState(false);

  const filteredPosts = useMemo(() => {
    let result = [...mockPosts];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
      );
    }

    // Tag filter
    if (selectedTag !== "All") {
      result = result.filter((p) => p.tags.includes(selectedTag));
    }

    // Sort
    switch (sortBy) {
      case "top":
        result.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case "newest":
        // Mock: sort by createdAt string length (shorter = more recent)
        result.sort((a, b) => a.createdAt.length - b.createdAt.length);
        break;
      case "trending":
      default:
        result.sort(
          (a, b) =>
            (b.isPinned ? 1000 : 0) +
            b.upvotes * 2 +
            b.replies * 3 -
            ((a.isPinned ? 1000 : 0) + a.upvotes * 2 + a.replies * 3)
        );
    }

    return result;
  }, [search, selectedTag, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Community</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ask questions, share projects, and learn from fellow coders
          </p>
        </div>
        <button
          onClick={() => setShowCompose(!showCompose)}
          className="btn-glow px-4 py-2.5 text-sm"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </span>
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          {
            label: "Total Posts",
            value: "1,247",
            icon: MessageSquare,
            color: "text-brand-blue",
          },
          {
            label: "Active Today",
            value: "89",
            icon: TrendingUp,
            color: "text-emerald-400",
          },
          {
            label: "AI Answers",
            value: "342",
            icon: Sparkles,
            color: "text-brand-purple",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Compose modal */}
      <AnimatePresence>
        {showCompose && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white">
                New Discussion
              </h3>
              <input
                type="text"
                placeholder="Post title..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
              />
              <textarea
                rows={4}
                placeholder="What's on your mind?"
                className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors resize-none"
              />
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  className="w-64 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCompose(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="btn-glow px-4 py-1.5 text-xs">
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
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
              placeholder="Search discussions..."
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
            />
          </div>

          {/* Sort */}
          {(["trending", "newest", "top"] as SortOption[]).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                sortBy === s
                  ? "bg-brand-blue/20 text-brand-blue border border-brand-blue/20"
                  : "bg-white/[0.03] text-muted-foreground hover:text-white border border-white/5"
              }`}
            >
              {s === "trending"
                ? "🔥 Trending"
                : s === "newest"
                  ? "🕐 Newest"
                  : "⬆ Top"}
            </button>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                selectedTag === tag
                  ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/20"
                  : "bg-white/[0.03] text-muted-foreground hover:text-white border border-white/5"
              }`}
            >
              {tag !== "All" && <Hash className="w-2.5 h-2.5" />}
              {tag}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Posts */}
      <div className="space-y-2">
        {filteredPosts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No posts found matching your search
            </p>
          </div>
        ) : (
          filteredPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-4 group cursor-pointer ${
                post.isPinned ? "border-amber-500/10" : ""
              }`}
            >
              <div className="flex gap-4">
                {/* Vote column */}
                <div className="flex flex-col items-center gap-1 pt-1">
                  <button className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-brand-blue transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-semibold text-white">
                    {post.upvotes}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.isPinned && (
                          <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold uppercase">
                            <PinIcon className="w-2.5 h-2.5" />
                            Pinned
                          </span>
                        )}
                        {post.isSolved && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold uppercase">
                            ✓ Solved
                          </span>
                        )}
                        {post.isAIAnswer && (
                          <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-md bg-brand-purple/10 text-brand-purple border border-brand-purple/20 font-semibold">
                            <Sparkles className="w-2.5 h-2.5" />
                            AI Answer
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-white mt-1 group-hover:text-brand-blue transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[9px] bg-white/5 text-muted-foreground border border-white/5"
                      >
                        <Hash className="w-2 h-2" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                        {post.author.avatar}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {post.author.name}
                      </span>
                      <span className="text-[9px] px-1 py-0.5 rounded bg-white/5 text-muted-foreground/60">
                        Lv.{post.author.level}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/50">
                      •
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="w-2.5 h-2.5" />
                      {post.createdAt}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MessageCircle className="w-2.5 h-2.5" />
                      {post.replies} replies
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Eye className="w-2.5 h-2.5" />
                      {post.views} views
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
