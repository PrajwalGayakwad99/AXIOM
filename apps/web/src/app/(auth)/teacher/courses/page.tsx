"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  FolderKanban,
  Users,
  BarChart3,
  Clock,
  CheckCircle2,
  Edit,
  Trash2,
  Eye,
  Copy,
  MoreVertical,
  BookOpen,
  Zap,
  TrendingUp,
  ChevronDown,
  X,
  FileText,
  GraduationCap,
} from "lucide-react";

// ─────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────

interface Course {
  id: string;
  title: string;
  description: string;
  status: "published" | "draft" | "archived";
  students: number;
  lessons: number;
  completionRate: number;
  avgScore: number;
  createdAt: string;
  updatedAt: string;
  category: string;
  thumbnail: string;
}

const mockCourses: Course[] = [
  {
    id: "cr1",
    title: "Python Fundamentals",
    description: "Complete beginner course covering Python basics, data types, control flow, functions, and OOP.",
    status: "published",
    students: 156,
    lessons: 24,
    completionRate: 73,
    avgScore: 82,
    createdAt: "Jan 15, 2026",
    updatedAt: "2d ago",
    category: "Python",
    thumbnail: "🐍",
  },
  {
    id: "cr2",
    title: "Data Structures & Algorithms",
    description: "Master arrays, linked lists, trees, graphs, sorting, and searching algorithms with hands-on challenges.",
    status: "published",
    students: 89,
    lessons: 36,
    completionRate: 45,
    avgScore: 76,
    createdAt: "Feb 1, 2026",
    updatedAt: "5h ago",
    category: "Algorithms",
    thumbnail: "🧮",
  },
  {
    id: "cr3",
    title: "Web Development with React",
    description: "Build modern web applications using React, Next.js, and TypeScript. Includes hooks, state management, and API integration.",
    status: "draft",
    students: 0,
    lessons: 12,
    completionRate: 0,
    avgScore: 0,
    createdAt: "Mar 5, 2026",
    updatedAt: "1d ago",
    category: "Web Dev",
    thumbnail: "⚛️",
  },
  {
    id: "cr4",
    title: "Advanced Python — Decorators & Generators",
    description: "Deep dive into Python advanced topics including decorators, generators, context managers, and meta-programming.",
    status: "archived",
    students: 42,
    lessons: 16,
    completionRate: 91,
    avgScore: 88,
    createdAt: "Nov 10, 2025",
    updatedAt: "30d ago",
    category: "Python",
    thumbnail: "🔧",
  },
];

type StatusFilter = "all" | "published" | "draft" | "archived";

function StatusBadge({ status }: { status: string }) {
  const config = {
    published: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", label: "Published" },
    draft: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", label: "Draft" },
    archived: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20", label: "Archived" },
  }[status] || { bg: "bg-white/5", text: "text-white", border: "border-white/10", label: status };

  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function TeacherCoursesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = mockCourses.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  const totalStudents = mockCourses.reduce((sum, c) => sum + c.students, 0);
  const totalLessons = mockCourses.reduce((sum, c) => sum + c.lessons, 0);
  const publishedCount = mockCourses.filter((c) => c.status === "published").length;

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
          <h1 className="text-2xl font-bold text-white">My Courses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage your teaching content
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-glow px-4 py-2.5 text-sm">
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Course
          </span>
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
          { label: "Total Courses", value: mockCourses.length, icon: FolderKanban, color: "text-brand-blue" },
          { label: "Published", value: publishedCount, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Total Students", value: totalStudents, icon: Users, color: "text-brand-purple" },
          { label: "Total Lessons", value: totalLessons, icon: BookOpen, color: "text-amber-400" },
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

      {/* Create Course Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Create New Course</h3>
                <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Course Title</label>
                  <input type="text" placeholder="e.g., JavaScript Mastery" className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Category</label>
                  <select className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue/50 transition-colors appearance-none">
                    <option className="bg-[#13131D]">Python</option>
                    <option className="bg-[#13131D]">JavaScript</option>
                    <option className="bg-[#13131D]">Algorithms</option>
                    <option className="bg-[#13131D]">Web Dev</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Description</label>
                <textarea rows={3} placeholder="Describe what students will learn..." className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors resize-none" />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg text-xs text-muted-foreground hover:text-white transition-colors">Cancel</button>
                <button className="btn-glow px-5 py-2 text-xs"><span>Create Course</span></button>
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
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
          />
        </div>
        {(["all", "published", "draft", "archived"] as StatusFilter[]).map((s) => (
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
          </button>
        ))}
      </motion.div>

      {/* Course Cards */}
      <div className="space-y-3">
        {filtered.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card p-5 group"
          >
            <div className="flex items-start gap-4">
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 border border-white/5 flex items-center justify-center text-2xl shrink-0">
                {course.thumbnail}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-white group-hover:text-brand-blue transition-colors">
                    {course.title}
                  </h3>
                  <StatusBadge status={course.status} />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{course.description}</p>

                {/* Stats row */}
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Users className="w-3 h-3" /> {course.students} students
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <BookOpen className="w-3 h-3" /> {course.lessons} lessons
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <TrendingUp className="w-3 h-3" /> {course.completionRate}% completion
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <BarChart3 className="w-3 h-3" /> {course.avgScore}% avg score
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                    <Clock className="w-3 h-3" /> Updated {course.updatedAt}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors" title="Edit">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors" title="Preview">
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors" title="Duplicate">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-red-400 transition-colors" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
