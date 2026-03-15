"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Flag,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  MessageSquare,
  Code2,
  User,
  Search,
  ChevronDown,
  Ban,
  Undo2,
} from "lucide-react";

// ─────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────

interface Report {
  id: string;
  type: "spam" | "harassment" | "inappropriate" | "cheating" | "other";
  content: string;
  contentType: "forum_post" | "challenge_submission" | "group_message" | "profile";
  reportedUser: { name: string; avatar: string };
  reportedBy: { name: string; avatar: string };
  status: "pending" | "resolved" | "dismissed";
  severity: "low" | "medium" | "high" | "critical";
  createdAt: string;
}

const mockReports: Report[] = [
  {
    id: "r1",
    type: "cheating",
    content: "User submitted identical solutions to 5 challenges from an external source within 2 minutes.",
    contentType: "challenge_submission",
    reportedUser: { name: "Anonymous_42", avatar: "A4" },
    reportedBy: { name: "Auto-Detection", avatar: "🤖" },
    status: "pending",
    severity: "high",
    createdAt: "15m ago",
  },
  {
    id: "r2",
    type: "harassment",
    content: "User posted offensive comments targeting another member in the community forum.",
    contentType: "forum_post",
    reportedUser: { name: "ToxicCoder", avatar: "TC" },
    reportedBy: { name: "Emma Davis", avatar: "ED" },
    status: "pending",
    severity: "critical",
    createdAt: "1h ago",
  },
  {
    id: "r3",
    type: "spam",
    content: "User posted repeated promotional links in multiple group chats.",
    contentType: "group_message",
    reportedUser: { name: "SpamBot_99", avatar: "S9" },
    reportedBy: { name: "Marcus Williams", avatar: "MW" },
    status: "pending",
    severity: "medium",
    createdAt: "3h ago",
  },
  {
    id: "r4",
    type: "inappropriate",
    content: "User's profile bio contains inappropriate language and external links.",
    contentType: "profile",
    reportedUser: { name: "NewUser123", avatar: "NU" },
    reportedBy: { name: "Sarah Chen", avatar: "SC" },
    status: "resolved",
    severity: "low",
    createdAt: "1d ago",
  },
  {
    id: "r5",
    type: "cheating",
    content: "User used AI-generated code to pass multiple challenges without understanding the solution.",
    contentType: "challenge_submission",
    reportedUser: { name: "QuickSolver", avatar: "QS" },
    reportedBy: { name: "Auto-Detection", avatar: "🤖" },
    status: "dismissed",
    severity: "low",
    createdAt: "2d ago",
  },
];

type StatusFilter = "all" | "pending" | "resolved" | "dismissed";

function SeverityBadge({ severity }: { severity: string }) {
  const config = {
    critical: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", dot: "bg-red-400" },
    high: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20", dot: "bg-orange-400" },
    medium: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", dot: "bg-amber-400" },
    low: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20", dot: "bg-slate-400" },
  }[severity] || { bg: "bg-white/5", text: "text-white", border: "border-white/10", dot: "bg-white" };

  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {severity}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", icon: Clock },
    resolved: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", icon: CheckCircle2 },
    dismissed: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20", icon: XCircle },
  }[status] || { bg: "bg-white/5", text: "text-white", border: "border-white/10", icon: Clock };

  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}>
      <config.icon className="w-2.5 h-2.5" />
      {status}
    </span>
  );
}

function TypeIcon({ type }: { type: string }) {
  const icons = {
    cheating: Code2,
    harassment: AlertTriangle,
    spam: MessageSquare,
    inappropriate: Flag,
    other: ShieldAlert,
  };
  const Icon = icons[type as keyof typeof icons] || ShieldAlert;
  return <Icon className="w-4 h-4" />;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function AdminModerationPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = mockReports.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search && !r.content.toLowerCase().includes(search.toLowerCase()) && !r.reportedUser.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pendingCount = mockReports.filter((r) => r.status === "pending").length;
  const criticalCount = mockReports.filter((r) => r.severity === "critical" && r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-white">Moderation</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and manage reported content, user behavior, and platform safety
        </p>
      </motion.div>

      {/* Alert Banner */}
      {criticalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="glass-card p-4 border-red-500/20 bg-gradient-to-r from-red-500/[0.05] to-transparent"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-400">
                {criticalCount} critical report{criticalCount > 1 ? "s" : ""} require immediate attention
              </p>
              <p className="text-xs text-muted-foreground">
                Review these reports as soon as possible to maintain platform safety
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        {[
          { label: "Pending Reports", value: pendingCount, icon: Clock, color: "text-amber-400" },
          { label: "Critical", value: criticalCount, icon: AlertTriangle, color: "text-red-400" },
          { label: "Resolved Today", value: 12, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Total Reports", value: mockReports.length, icon: Flag, color: "text-brand-blue" },
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex items-center gap-3"
      >
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
          />
        </div>
        {(["all", "pending", "resolved", "dismissed"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-colors border ${
              statusFilter === s
                ? "bg-brand-blue/20 text-brand-blue border-brand-blue/20"
                : "bg-white/[0.02] text-muted-foreground hover:text-white border-white/5"
            }`}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            {s === "pending" && ` (${pendingCount})`}
          </button>
        ))}
      </motion.div>

      {/* Reports List */}
      <div className="space-y-2">
        {filtered.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-card p-4 ${
              report.severity === "critical" && report.status === "pending"
                ? "border-red-500/20"
                : ""
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Type icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                report.severity === "critical"
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : report.severity === "high"
                    ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                    : "bg-white/5 text-muted-foreground border border-white/5"
              }`}>
                <TypeIcon type={report.type} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <SeverityBadge severity={report.severity} />
                  <StatusBadge status={report.status} />
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/5 text-muted-foreground border border-white/5 uppercase">
                    {report.type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{report.content}</p>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-white/5 flex items-center justify-center text-[7px] font-bold text-muted-foreground">
                      {report.reportedUser.avatar}
                    </div>
                    <span className="text-[10px] text-rose-400 font-medium">{report.reportedUser.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground/40">reported by</span>
                  <span className="text-[10px] text-muted-foreground">{report.reportedBy.name}</span>
                  <span className="text-[10px] text-muted-foreground/40">•</span>
                  <span className="text-[10px] text-muted-foreground/60">{report.createdAt}</span>
                </div>
              </div>

              {/* Actions */}
              {report.status === "pending" && (
                <div className="flex items-center gap-1 shrink-0">
                  <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors" title="View details">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-400 transition-colors" title="Resolve">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition-colors" title="Ban user">
                    <Ban className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-slate-400 transition-colors" title="Dismiss">
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
