"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, BookOpen, AlertCircle, FileEdit, Award, Search, Bell, Clock,
  CheckCircle2, Plus, Brain, MessageSquare, TrendingUp, TrendingDown,
  LayoutGrid, Activity, PlayCircle, Upload, PenTool, Send
} from "lucide-react";

const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user?.role && session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
      router.push("/dashboard");
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-t-2 border-brand-purple animate-spin" />
      </div>
    );
  }

  const name = session?.user?.name || "Teacher";
  const stats = { students: 145, activeThisWeek: 89, avgCompletion: 68, pendingReviews: 12 };

  const courses = [
    { title: "React Masterclass", students: 45, completion: 72, lessons: 24, published: true },
    { title: "Python for Data Science", students: 82, completion: 55, lessons: 30, published: true },
    { title: "Advanced Next.js App Router", students: 18, completion: 88, lessons: 15, published: false },
  ];

  const heatmapData = Array.from({ length: 14 * 7 }, (_, i) => Math.random() > 0.3 ? Math.floor(Math.random() * 100) : 0);

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* SECTION 1 - Welcome Banner */}
      <motion.div variants={fadeUp} className="glass-card p-8 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[100px] -mt-40 -mr-40 pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">Welcome back, {name}</h1>
            <span className="bg-brand-purple/20 border border-brand-purple/30 text-brand-purple text-[10px] uppercase font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Teacher
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            You have <span className="text-white font-medium">{stats.students} students</span> across <span className="text-white font-medium">{courses.length} courses</span>.
          </p>
          {stats.pendingReviews > 0 && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold w-fit">
              <AlertCircle className="w-4 h-4" /> {stats.pendingReviews} submissions pending review
            </div>
          )}
        </div>
        <div className="relative z-10 flex flex-wrap gap-3">
          <button className="btn-glow px-4 py-2 text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-gradient-to-r from-brand-purple to-purple-600 border border-brand-purple/50">
            <Plus className="w-4 h-4" /> Create Course
          </button>
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-xs font-medium text-white transition-colors flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Grade
          </button>
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-xs font-medium text-white transition-colors flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-blue" /> Message
          </button>
        </div>
      </motion.div>

      {/* SECTION 2 - Class Stats */}
      <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Total Students", value: stats.students, color: "text-brand-blue", bg: "bg-brand-blue/10" },
          { icon: Activity, label: "Active This Week", value: stats.activeThisWeek, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { icon: PlayCircle, label: "Avg Completion", value: `${stats.avgCompletion}%`, color: "text-yellow-400", bg: "bg-yellow-400/10" },
          { icon: FileEdit, label: "Pending Reviews", value: stats.pendingReviews, color: stats.pendingReviews > 0 ? "text-rose-400" : "text-emerald-400", bg: stats.pendingReviews > 0 ? "bg-rose-500/10" : "bg-emerald-500/10", glow: stats.pendingReviews > 0 },
        ].map((stat, i) => (
          <motion.div key={i} variants={fadeUp} className={`glass-card p-5 rounded-2xl flex flex-col justify-center border border-white/5 hover:bg-white/5 transition-colors relative overflow-hidden`}>
            {stat.glow && <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/20 blur-xl rounded-full" />}
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight relative z-10">{stat.value}</h3>
          </motion.div>
        ))}
      </motion.div>

      {/* SECTION 3 - My Courses Table */}
      <motion.div variants={fadeUp} className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-brand-purple" />
            My Courses
          </h2>
          <button className="btn-glow px-4 py-2 text-xs flex items-center gap-2 bg-gradient-to-r from-brand-purple to-purple-600">
            <Plus className="w-4 h-4" /> New Course
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/[0.02] border-b border-white/5 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Course Name</th>
                <th className="px-6 py-4 font-medium">Students</th>
                <th className="px-6 py-4 font-medium">Completion</th>
                <th className="px-6 py-4 font-medium">Lessons</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {courses.map((course, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 font-semibold text-white">{course.title}</td>
                  <td className="px-6 py-4 text-slate-300">{course.students}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                        <div className="h-full bg-brand-purple rounded-full" style={{ width: `${course.completion}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{course.completion}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{course.lessons}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${course.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                      {course.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-white transition-colors text-xs font-medium px-2">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* SECTION 4 - Student Health Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Struggling Students */}
        <motion.div variants={fadeUp} className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col">
          <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
            Needs Attention <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </h2>
          <div className="space-y-3 flex-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-xs font-bold text-slate-400 border border-white/10">S{i}</div>
                  <div>
                    <p className="text-sm font-semibold text-white">Student {i}</p>
                    <p className="text-[10px] text-rose-400">Last active {i * 2 + 5} days ago</p>
                  </div>
                </div>
                <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors flex items-center gap-1.5">
                  <Send className="w-3 h-3" /> Reminder
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Performers */}
        <motion.div variants={fadeUp} className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col">
          <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
            Excelling This Week <Trophy className="w-4 h-4 text-yellow-400" />
          </h2>
          <div className="space-y-3 flex-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-600/20 text-yellow-400 flex items-center justify-center text-xs font-bold border border-yellow-500/20">T{i}</div>
                  <div>
                    <p className="text-sm font-semibold text-white">Top Student {i}</p>
                    <p className="text-[10px] text-emerald-400">+{800 - i * 50} XP this week</p>
                  </div>
                </div>
                <button className="bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 px-3 py-1.5 rounded-lg text-xs font-medium text-yellow-400 transition-colors flex items-center gap-1.5">
                  <Award className="w-3 h-3" /> Badge
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SECTION 5 - Pending Submissions Queue */}
        <motion.div variants={fadeUp} className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-blue" />
              Review Queue
            </h2>
            <span className="bg-brand-blue/20 text-brand-blue text-xs font-bold px-2.5 py-1 rounded-full">{stats.pendingReviews} pending</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/[0.02] border-b border-white/5 text-muted-foreground text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Challenge</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-medium text-white">Student {i}</td>
                    <td className="px-4 py-3 text-slate-300">Basic OOP Concepts</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{i} hour(s) ago</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded font-bold uppercase">Pending</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="text-[10px] font-bold text-white bg-brand-purple hover:opacity-90 transition-opacity px-2 py-1 rounded">Review</button>
                        <button className="text-[10px] font-bold text-brand-blue border border-brand-blue/30 px-2 py-1 rounded flex items-center gap-1 hover:bg-brand-blue/10"><Brain className="w-3 h-3" /> Auto</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* SECTION 6 - Assignment Tracker */}
        <motion.div variants={fadeUp} className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-400" />
              Assignments
            </h2>
            <button className="text-white hover:text-emerald-400 transition-colors p-1"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="space-y-4 flex-1">
            {[
              { title: "React Component Built", due: "Due in 12h", progress: 80, danger: true },
              { title: "Python Data Analysis", due: "Due in 3 days", progress: 45, danger: false },
              { title: "Regex Parsing Project", due: "Due next week", progress: 10, danger: false },
            ].map((asg, i) => (
              <div key={i} className={`p-4 rounded-xl border ${asg.danger ? 'border-rose-500/30 bg-rose-500/5' : 'bg-white/[0.02] border-white/5'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold text-white line-clamp-1">{asg.title}</h3>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${asg.danger ? 'text-rose-400 bg-rose-500/20' : 'text-slate-400 bg-surface-elevated'}`}>{asg.due}</span>
                </div>
                <div className="w-full h-1.5 bg-surface-elevated rounded-full mb-2 overflow-hidden">
                  <div className={`h-full rounded-full ${asg.danger ? 'bg-rose-500' : 'bg-emerald-400'}`} style={{ width: `${asg.progress}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{asg.progress}% submitted</span>
                  <button className="text-brand-blue hover:text-brand-blue/80 font-medium transition-colors">View All</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* SECTION 8 - AI Teaching Tools */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 px-2">
          <Brain className="w-5 h-5 text-brand-blue" />
          AI Teaching Assistant
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Generate Quiz", icon: FileEdit, color: "text-brand-blue", bg: "hover:border-brand-blue/50", blur: "bg-brand-blue/20" },
            { title: "Draft Assignment", icon: PenTool, color: "text-brand-purple", bg: "hover:border-brand-purple/50", blur: "bg-brand-purple/20" },
            { title: "Analyze Class", icon: Activity, color: "text-emerald-400", bg: "hover:border-emerald-500/50", blur: "bg-emerald-500/20" },
            { title: "Write Lesson", icon: BookOpen, color: "text-yellow-400", bg: "hover:border-yellow-500/50", blur: "bg-yellow-500/20" },
          ].map((tool, i) => (
            <button key={i} className={`glass-card p-5 rounded-xl border border-white/5 transition-all group relative overflow-hidden text-left ${tool.bg}`}>
              <div className={`absolute -right-4 -top-4 w-16 h-16 ${tool.blur} rounded-full blur-2xl transition-all group-hover:scale-150`} />
              <tool.icon className={`w-6 h-6 ${tool.color} mb-3 relative z-10`} />
              <h3 className="text-sm font-bold text-white relative z-10">{tool.title}</h3>
              <p className="text-[10px] text-muted-foreground mt-1 relative z-10">AI-powered workflow</p>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SECTION 9 - Engagement Heatmap */}
        <motion.div variants={fadeUp} className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/5">
           <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Class Engagement Matrix (14 Days)
            </h2>
          </div>
          <div className="w-full overflow-x-auto">
            <div className="grid grid-cols-[repeat(14,minmax(20px,1fr))] gap-1 min-w-[400px]">
              {heatmapData.map((val, i) => (
                <div 
                  key={i} 
                  className={`aspect-square rounded-sm border border-transparent hover:border-white/20 transition-all ${
                    val === 0 ? 'bg-surface-elevated' :
                    val < 30 ? 'bg-emerald-500/20' :
                    val < 70 ? 'bg-emerald-500/50' : 'bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  }`}
                  title={`${val}% engaged`}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <span className="text-muted-foreground">Needs Attention:</span>
            <span className="text-yellow-400 font-medium">Promises & async/await</span>
            <span className="text-yellow-400 font-medium">React useEffect</span>
          </div>
        </motion.div>

        {/* SECTION 7 - Student Activity Feed */}
        <motion.div variants={fadeUp} className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col h-80">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-purple" />
              Live Feed
            </h2>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {[
              { name: "John D.", action: "completed lesson", subject: "CSS Grid", time: "Just now", color: "text-brand-blue" },
              { name: "Sarah M.", action: "submitted challenge", subject: "Palindrome Check", time: "2 min ago", color: "text-brand-purple" },
              { name: "Mike R.", action: "earned", subject: "100 XP", time: "15 min ago", color: "text-emerald-400" },
              { name: "Alex K.", action: "asked question in", subject: "Data Structures", time: "1 hr ago", color: "text-yellow-400" },
              { name: "Emma H.", action: "finished course", subject: "React Basics", time: "3 hrs ago", color: "text-brand-blue" },
            ].map((feed, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-surface-elevated border border-white/10 font-bold text-[10px] text-slate-300 flex items-center justify-center shrink-0 mt-0.5">{feed.name[0]}</div>
                <div className="flex-1 leading-snug">
                  <span className="text-white font-semibold">{feed.name} </span>
                  <span className="text-muted-foreground">{feed.action} </span>
                  <span className={`${feed.color} font-medium`}>{feed.subject}</span>
                  <div className="text-[10px] text-slate-500 mt-0.5">{feed.time}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
