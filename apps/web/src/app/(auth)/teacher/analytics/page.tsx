"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  GraduationCap,
  ArrowUp,
  ArrowDown,
  Minus,
  Target,
  Zap,
  Activity,
  ChevronDown,
} from "lucide-react";

// ─────────────────────────────────────────────
// Mock analytics data
// ─────────────────────────────────────────────

const overviewStats = [
  { label: "Total Students", value: "287", change: "+12%", trend: "up" as const, icon: Users, color: "text-brand-blue" },
  { label: "Active This Week", value: "164", change: "+8%", trend: "up" as const, icon: Activity, color: "text-emerald-400" },
  { label: "Avg Completion", value: "67%", change: "+3%", trend: "up" as const, icon: Target, color: "text-brand-purple" },
  { label: "Avg Score", value: "78%", change: "-2%", trend: "down" as const, icon: BarChart3, color: "text-amber-400" },
];

const coursePerformance = [
  { name: "Python Fundamentals", students: 156, completion: 73, avgScore: 82, engagement: 89 },
  { name: "DSA Course", students: 89, completion: 45, avgScore: 76, engagement: 72 },
  { name: "Advanced Python", students: 42, completion: 91, avgScore: 88, engagement: 65 },
];

const weeklyActivity = [
  { day: "Mon", students: 45, submissions: 78 },
  { day: "Tue", students: 52, submissions: 94 },
  { day: "Wed", students: 48, submissions: 86 },
  { day: "Thu", students: 61, submissions: 112 },
  { day: "Fri", students: 55, submissions: 98 },
  { day: "Sat", students: 32, submissions: 54 },
  { day: "Sun", students: 28, submissions: 42 },
];

const recentSubmissions = [
  { student: "Sarah Chen", course: "Python Fundamentals", lesson: "Lesson 18: OOP Basics", score: 95, time: "10m ago" },
  { student: "Marcus Williams", course: "DSA Course", lesson: "Challenge: Two Sum", score: 100, time: "25m ago" },
  { student: "Aiko Tanaka", course: "Python Fundamentals", lesson: "Lesson 12: Functions", score: 82, time: "1h ago" },
  { student: "James Rodriguez", course: "DSA Course", lesson: "Challenge: Binary Search", score: 70, time: "2h ago" },
  { student: "Emma Davis", course: "Advanced Python", lesson: "Lesson 8: Decorators", score: 88, time: "3h ago" },
];

const topStudents = [
  { name: "Sarah Chen", avatar: "SC", completedLessons: 22, avgScore: 94, streak: 14 },
  { name: "Aiko Tanaka", avatar: "AT", completedLessons: 19, avgScore: 91, streak: 8 },
  { name: "Marcus Williams", avatar: "MW", completedLessons: 17, avgScore: 87, streak: 12 },
  { name: "Emma Davis", avatar: "ED", completedLessons: 15, avgScore: 85, streak: 5 },
];

type TimeRange = "7d" | "30d" | "90d";

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function TeacherAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  const maxSubmissions = Math.max(...weeklyActivity.map((d) => d.submissions));

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
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track student performance and engagement across your courses
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-xl p-1">
          {(["7d", "30d", "90d"] as TimeRange[]).map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                timeRange === t
                  ? "bg-brand-blue/20 text-brand-blue"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {t === "7d" ? "7 Days" : t === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        {overviewStats.map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="flex items-end gap-2">
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <span className={`flex items-center gap-0.5 text-[10px] font-medium mb-0.5 ${
                stat.trend === "up" ? "text-emerald-400" : "text-rose-400"
              }`}>
                {stat.trend === "up" ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="grid grid-cols-2 gap-4"
      >
        {/* Weekly Activity Chart */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Weekly Activity</h3>
          <div className="flex items-end gap-2 h-36">
            {weeklyActivity.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col gap-0.5">
                  <div
                    className="w-full rounded-t-sm bg-brand-blue/60 transition-all hover:bg-brand-blue"
                    style={{ height: `${(day.submissions / maxSubmissions) * 100}px` }}
                    title={`${day.submissions} submissions`}
                  />
                  <div
                    className="w-full rounded-b-sm bg-brand-purple/40"
                    style={{ height: `${(day.students / maxSubmissions) * 60}px` }}
                    title={`${day.students} active students`}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground/70">{day.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
              <span className="w-2 h-2 rounded-sm bg-brand-blue/60" /> Submissions
            </span>
            <span className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
              <span className="w-2 h-2 rounded-sm bg-brand-purple/40" /> Active Students
            </span>
          </div>
        </div>

        {/* Course Performance */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Course Performance</h3>
          <div className="space-y-4">
            {coursePerformance.map((course) => (
              <div key={course.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white font-medium">{course.name}</span>
                  <span className="text-[10px] text-muted-foreground">{course.students} students</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[9px] text-muted-foreground">Completion</span>
                      <span className="text-[9px] text-emerald-400">{course.completion}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-400" style={{ width: `${course.completion}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[9px] text-muted-foreground">Avg Score</span>
                      <span className="text-[9px] text-brand-blue">{course.avgScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-brand-blue" style={{ width: `${course.avgScore}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[9px] text-muted-foreground">Engagement</span>
                      <span className="text-[9px] text-brand-purple">{course.engagement}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-brand-purple" style={{ width: `${course.engagement}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-2 gap-4"
      >
        {/* Recent Submissions */}
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">Recent Submissions</h3>
          </div>
          <div className="divide-y divide-white/5">
            {recentSubmissions.map((sub, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="px-5 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-medium text-white">{sub.student}</p>
                  <p className="text-[10px] text-muted-foreground">{sub.lesson}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold ${sub.score >= 90 ? "text-emerald-400" : sub.score >= 70 ? "text-amber-400" : "text-rose-400"}`}>
                    {sub.score}%
                  </span>
                  <span className="text-[9px] text-muted-foreground/50">{sub.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Students */}
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">Top Students</h3>
          </div>
          <div className="divide-y divide-white/5">
            {topStudents.map((student, i) => (
              <motion.div
                key={student.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="px-5 py-3 flex items-center gap-3"
              >
                <span className="text-[10px] font-bold text-muted-foreground w-4">#{i + 1}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  i === 0
                    ? "bg-gradient-to-br from-amber-400/20 to-amber-600/20 text-amber-400 border border-amber-400/20"
                    : "bg-white/5 text-muted-foreground border border-white/5"
                }`}>
                  {student.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white">{student.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {student.completedLessons} lessons · {student.avgScore}% avg
                  </p>
                </div>
                <div className="flex items-center gap-1 text-rose-400">
                  <span className="text-[10px]">🔥</span>
                  <span className="text-[10px] font-bold">{student.streak}d</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
