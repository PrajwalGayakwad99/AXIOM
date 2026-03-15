"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Star,
  MessageSquare,
  CheckCircle2,
  Clock,
  Search,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Code2,
} from "lucide-react";

// ─────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────

interface PeerReview {
  id: string;
  student: { name: string; avatar: string };
  reviewer: { name: string; avatar: string } | null;
  assignment: string;
  course: string;
  status: "pending" | "in-review" | "completed";
  submittedAt: string;
  score: number | null;
  feedback: string | null;
}

const mockReviews: PeerReview[] = [
  { id: "pr1", student: { name: "Sarah Chen", avatar: "SC" }, reviewer: { name: "Marcus Williams", avatar: "MW" }, assignment: "Binary Search", course: "DSA Course", status: "completed", submittedAt: "2d ago", score: 92, feedback: "Clean implementation with good edge case handling." },
  { id: "pr2", student: { name: "Aiko Tanaka", avatar: "AT" }, reviewer: { name: "Emma Davis", avatar: "ED" }, assignment: "OOP Project", course: "Python Fundamentals", status: "in-review", submittedAt: "1d ago", score: null, feedback: null },
  { id: "pr3", student: { name: "James Rodriguez", avatar: "JR" }, reviewer: null, assignment: "Linked List", course: "DSA Course", status: "pending", submittedAt: "3h ago", score: null, feedback: null },
  { id: "pr4", student: { name: "Emma Davis", avatar: "ED" }, reviewer: { name: "Sarah Chen", avatar: "SC" }, assignment: "Decorator Patterns", course: "Advanced Python", status: "completed", submittedAt: "3d ago", score: 85, feedback: "Good use of closures, consider more docstrings." },
  { id: "pr5", student: { name: "Priya Patel", avatar: "PP" }, reviewer: null, assignment: "Functions Quiz", course: "Python Fundamentals", status: "pending", submittedAt: "5h ago", score: null, feedback: null },
];

type StatusFilter = "all" | "pending" | "in-review" | "completed";

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function TeacherPeerReviewPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = mockReviews.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search && !r.student.name.toLowerCase().includes(search.toLowerCase()) && !r.assignment.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pendingCount = mockReviews.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold text-white">Peer Review</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage peer review assignments and feedback</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Reviews", value: mockReviews.length, icon: MessageSquare, color: "text-brand-blue" },
          { label: "Pending", value: pendingCount, icon: Clock, color: "text-amber-400" },
          { label: "In Review", value: mockReviews.filter((r) => r.status === "in-review").length, icon: Eye, color: "text-brand-purple" },
          { label: "Completed", value: mockReviews.filter((r) => r.status === "completed").length, icon: CheckCircle2, color: "text-emerald-400" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="flex items-center gap-3">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by student or assignment..." className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors" />
        </div>
        {(["all", "pending", "in-review", "completed"] as StatusFilter[]).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-colors border ${statusFilter === s ? "bg-brand-blue/20 text-brand-blue border-brand-blue/20" : "bg-white/[0.02] text-muted-foreground hover:text-white border-white/5"}`}>
            {s === "all" ? "All" : s === "in-review" ? "In Review" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Reviews List */}
      <div className="space-y-2">
        {filtered.map((review, i) => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-4">
              {/* Student */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 border border-white/5 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {review.student.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-white">{review.student.name}</p>
                  <span className="text-[10px] text-muted-foreground">→</span>
                  <span className="text-[10px] text-muted-foreground font-medium">{review.assignment}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider border ${review.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : review.status === "in-review" ? "bg-brand-purple/10 text-brand-purple border-brand-purple/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                    {review.status === "in-review" ? "In Review" : review.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground">{review.course}</span>
                  <span className="text-[10px] text-muted-foreground/40">•</span>
                  <span className="text-[10px] text-muted-foreground">Submitted {review.submittedAt}</span>
                  {review.reviewer && (
                    <>
                      <span className="text-[10px] text-muted-foreground/40">•</span>
                      <span className="text-[10px] text-muted-foreground">Reviewer: <span className="text-white">{review.reviewer.name}</span></span>
                    </>
                  )}
                </div>
                {review.feedback && (
                  <p className="text-[10px] text-muted-foreground/70 mt-1 italic">&ldquo;{review.feedback}&rdquo;</p>
                )}
              </div>
              {/* Score */}
              {review.score !== null && (
                <div className={`text-lg font-bold shrink-0 ${review.score >= 90 ? "text-emerald-400" : review.score >= 70 ? "text-amber-400" : "text-rose-400"}`}>
                  {review.score}%
                </div>
              )}
              {review.status === "pending" && (
                <button className="px-3 py-1.5 rounded-lg bg-brand-blue/10 text-brand-blue border border-brand-blue/20 text-[10px] font-semibold hover:bg-brand-blue/20 transition-colors shrink-0">
                  Assign Reviewer
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
