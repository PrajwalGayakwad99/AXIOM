"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  ClipboardList,
  Clock,
  CheckCircle2,
  Users,
  Calendar,
  Edit,
  Trash2,
  Eye,
  X,
  FileText,
  ChevronDown,
} from "lucide-react";

// ─────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "active" | "draft" | "closed";
  submitted: number;
  total: number;
  avgScore: number;
  type: "coding" | "quiz" | "project";
}

const mockAssignments: Assignment[] = [
  { id: "a1", title: "Binary Search Implementation", course: "DSA Course", dueDate: "Mar 20, 2026", status: "active", submitted: 62, total: 89, avgScore: 78, type: "coding" },
  { id: "a2", title: "Python OOP Project", course: "Python Fundamentals", dueDate: "Mar 25, 2026", status: "active", submitted: 45, total: 156, avgScore: 0, type: "project" },
  { id: "a3", title: "Functions & Scope Quiz", course: "Python Fundamentals", dueDate: "Mar 12, 2026", status: "closed", submitted: 148, total: 156, avgScore: 85, type: "quiz" },
  { id: "a4", title: "Linked List Challenge", course: "DSA Course", dueDate: "Apr 1, 2026", status: "draft", submitted: 0, total: 89, avgScore: 0, type: "coding" },
  { id: "a5", title: "Decorator Patterns Quiz", course: "Advanced Python", dueDate: "Mar 8, 2026", status: "closed", submitted: 40, total: 42, avgScore: 88, type: "quiz" },
];

type StatusFilter = "all" | "active" | "draft" | "closed";

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function TeacherAssignmentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = mockAssignments.filter((a) => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    return true;
  });

  const activeCount = mockAssignments.filter((a) => a.status === "active").length;
  const pendingGrading = mockAssignments.reduce((sum, a) => sum + (a.status === "active" ? a.submitted : 0), 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Assignments</h1>
          <p className="text-sm text-muted-foreground mt-1">Create, manage, and grade student assignments</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-glow px-4 py-2.5 text-sm">
          <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> New Assignment</span>
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        {[
          { label: "Total Assignments", value: mockAssignments.length, icon: ClipboardList, color: "text-brand-blue" },
          { label: "Active", value: activeCount, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Pending Grading", value: pendingGrading, icon: Clock, color: "text-amber-400" },
          { label: "Total Students", value: 287, icon: Users, color: "text-brand-purple" },
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

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Create New Assignment</h3>
                <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Title</label>
                  <input type="text" placeholder="Assignment title" className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Course</label>
                  <select className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue/50 transition-colors appearance-none">
                    <option className="bg-[#13131D]">Python Fundamentals</option>
                    <option className="bg-[#13131D]">DSA Course</option>
                    <option className="bg-[#13131D]">Advanced Python</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Due Date</label>
                  <input type="date" className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue/50 transition-colors" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg text-xs text-muted-foreground hover:text-white transition-colors">Cancel</button>
                <button className="btn-glow px-5 py-2 text-xs"><span>Create Assignment</span></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assignments..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
          />
        </div>
        {(["all", "active", "draft", "closed"] as StatusFilter[]).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-colors border ${statusFilter === s ? "bg-brand-blue/20 text-brand-blue border-brand-blue/20" : "bg-white/[0.02] text-muted-foreground hover:text-white border-white/5"}`}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Assignments */}
      <div className="space-y-2">
        {filtered.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4 group">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.type === "coding" ? "bg-brand-blue/10 border border-brand-blue/20" : a.type === "quiz" ? "bg-brand-purple/10 border border-brand-purple/20" : "bg-emerald-500/10 border border-emerald-500/20"}`}>
                {a.type === "coding" ? <FileText className="w-4 h-4 text-brand-blue" /> : a.type === "quiz" ? <ClipboardList className="w-4 h-4 text-brand-purple" /> : <FileText className="w-4 h-4 text-emerald-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-white">{a.title}</p>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider border ${a.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : a.status === "draft" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                    {a.status}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-muted-foreground">{a.course}</span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Calendar className="w-2.5 h-2.5" /> Due: {a.dueDate}</span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Users className="w-2.5 h-2.5" /> {a.submitted}/{a.total} submitted</span>
                  {a.avgScore > 0 && <span className="text-[10px] text-muted-foreground">Avg: {a.avgScore}%</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
