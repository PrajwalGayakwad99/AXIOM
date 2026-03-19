"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Flame, Trophy, Book, Sword, Star, Users, Brain, Activity, Target, Zap, 
  ArrowRight, Shield, Medal, CheckCircle2, ChevronRight, Lock, Play, Sparkles
} from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip
} from "recharts";

const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ xp: 1250, lessonsDone: 42, globalRank: 154 });
  const [dailyTip, setDailyTip] = useState("Break complex problems into smaller, manageable chunks.");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user?.role && session.user.role !== "STUDENT") {
      if (session.user.role === "TEACHER") router.push("/teacher/dashboard");
      else if (session.user.role === "ADMIN") router.push("/admin/dashboard");
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-t-2 border-brand-blue animate-spin" />
      </div>
    );
  }

  const timeOfDay = new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening";
  const name = session?.user?.name?.split(" ")[0] || "Student";
  const currentLevel = Math.floor(stats.xp / 100) + 1;
  const xpProgress = (stats.xp % 100) / 100;

  const radarData = [
    { subject: 'Problem Solving', A: 85, fullMark: 100 },
    { subject: 'Algorithms', A: 65, fullMark: 100 },
    { subject: 'Code Quality', A: 90, fullMark: 100 },
    { subject: 'Speed', A: 70, fullMark: 100 },
    { subject: 'Consistency', A: 80, fullMark: 100 },
  ];

  const heatmapData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
    studied: Math.random() > 0.3
  }));

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="w-full min-h-screen p-6 space-y-6">
      
      {/* SECTION 1 - Welcome Hero */}
      <motion.div variants={fadeUp} className="glass-card p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[100px] -mt-40 -mr-40 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Good {timeOfDay}, {name}! <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <span className="flex items-center gap-1 text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full text-xs font-medium border border-orange-500/20">
              <Flame className="w-3 h-3" /> 5 Day Streak
            </span>
            <span className="text-sm">2 of 3 lessons done today</span>
          </p>
          <div className="mt-4 flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 max-w-md">
            <Brain className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-brand-purple uppercase tracking-wider mb-1">AI Daily Tip</p>
              <p className="text-sm text-slate-300 leading-relaxed">{dailyTip}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SECTION 2 - Stats Row */}
      <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Star, label: "Total XP", value: stats.xp.toLocaleString(), color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
          { icon: Target, label: "Current Level", value: currentLevel, color: "text-brand-blue", bg: "bg-brand-blue/10", border: "border-brand-blue/20" },
          { icon: Trophy, label: "Global Rank", value: `#${stats.globalRank}`, color: "text-brand-purple", bg: "bg-brand-purple/10", border: "border-brand-purple/20" },
          { icon: Book, label: "Lessons Done", value: stats.lessonsDone, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
        ].map((stat, i) => (
          <motion.div key={i} variants={fadeUp} className={`glass-card p-5 rounded-2xl flex flex-col justify-center border-t border-l ${stat.border} hover:scale-105 transition-transform duration-200 cursor-default hover:border-indigo-500/50`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SECTION 3 - Learning Path */}
        <motion.div variants={fadeUp} className="lg:col-span-2 glass-card p-6 rounded-2xl flex flex-col border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Book className="w-5 h-5 text-brand-blue" />
              Current Learning Path
            </h2>
          </div>
          <div className="flex-1 flex flex-col lg:flex-row gap-6 items-center">
            <div className="w-full lg:w-1/3 aspect-video bg-surface-elevated rounded-xl border border-white/10 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 opacity-50 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-10 h-10 text-white opacity-80" fill="currentColor" />
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded backdrop-blur-md">React Mastery</span>
              </div>
            </div>
            <div className="flex-1 w-full space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-2 shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${i < 3 ? 'bg-brand-blue text-white border-brand-blue shadow-[0_0_10px_rgba(56,189,248,0.5)]' : i === 3 ? 'bg-surface-elevated text-brand-blue border-brand-blue' : 'bg-surface-elevated text-muted-foreground border-white/10'}`}>
                      {i < 3 ? <CheckCircle2 className="w-4 h-4" /> : i === 3 ? i : <Lock className="w-3 h-3" />}
                    </div>
                    {i < 5 && <div className={`w-6 h-px ${i < 3 ? 'bg-brand-blue' : 'bg-white/10'}`} />}
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>2 of 5 topics completed</span>
                  <span>40%</span>
                </div>
                <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue rounded-full" style={{ width: '40%' }} />
                </div>
              </div>
              <div className="bg-surface-elevated p-3 rounded-xl border border-white/5 space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Up Next (15 min)</p>
                <p className="text-sm text-white font-medium">Advanced React Hooks: useMemo & useCallback</p>
              </div>
              <button className="btn-glow w-full py-2.5 text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.3)] active:scale-95 transition-all duration-150 hover:brightness-110">
                Continue Learning <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* SECTION 4 - XP Progress Ring */}
        <motion.div variants={fadeUp} className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center border border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-[50px] pointer-events-none" />
          <div className="relative w-40 h-40 mb-4 flex items-center justify-center group">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none" className="text-surface-elevated" />
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray="283" strokeDashoffset={283 - (283 * xpProgress)} strokeLinecap="round" className="text-brand-purple transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xs text-muted-foreground font-medium mb-1">Level</span>
              <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-brand-blue to-brand-purple">{currentLevel}</span>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-300 mb-6">{Math.round(100 - (xpProgress * 100))} XP to Level {currentLevel + 1}</p>
          
          <div className="w-full space-y-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold text-left mb-2">Recent Gains</p>
            {[
              { reason: "Completed Lesson", amount: 50 },
              { reason: "Solved Challenge", amount: 120 },
              { reason: "Daily Streak", amount: 20 },
            ].map((tx, i) => (
              <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-slate-400">{tx.reason}</span>
                <span className="font-mono text-emerald-400 font-medium">+{tx.amount} XP</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* SECTION 5 - Daily Challenge */}
      <motion.div variants={fadeUp} className="glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col md:flex-row relative">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/10 via-brand-purple/5 to-transparent opacity-50" />
        <div className="p-6 md:p-8 flex-1 relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-brand-blue font-bold tracking-tight">
            <Trophy className="w-5 h-5 text-yellow-400 fill-yellow-400/20" /> Challenge of the Day
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white">Two Sum Algorithm</h3>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Optimize for O(n) time complexity.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">Medium</span>
            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide flex items-center gap-1"><Star className="w-3 h-3" /> +50 XP</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto md:ml-0"><Zap className="w-3 h-3" /> Available for 14 hours</span>
          </div>
        </div>
        <div className="p-6 md:p-8 bg-black/20 flex items-center justify-center md:border-l border-white/5 relative z-10 w-full md:w-auto">
          <button className="w-full md:w-auto px-6 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 active:scale-95 transition-all duration-150 hover:brightness-110">
            Solve Challenge <Sword className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SECTION 6.A - Streak Heatmap */}
        <motion.div variants={fadeUp} className="glass-card p-6 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-blue" />
              Activity Heatmap
            </h2>
            <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-orange-400">5 Day Streak</span>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2 mb-4">
            {heatmapData.map((day, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded-md transition-all duration-300 ${day.studied ? 'bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-surface-elevated border border-white/5'}`}
                title={day.date.toDateString()}
              />
            ))}
          </div>
          <p className="text-xs text-center text-muted-foreground font-medium">Study today to keep your streak alive!</p>
        </motion.div>

        {/* SECTION 6.B - Recent Achievements */}
        <motion.div variants={fadeUp} className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Medal className="w-5 h-5 text-brand-purple" />
              Achievements
            </h2>
            <button className="text-[10px] font-bold text-brand-blue uppercase tracking-wider hover:text-brand-purple transition-colors">View All</button>
          </div>
          <div className="space-y-4 flex-1">
            {[
              { name: "First Blood", desc: "Solved first challenge", icon: Sword, color: "text-red-400", bg: "bg-red-400/10" },
              { name: "Fast Learner", desc: "Finished 5 lessons in a day", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10" },
              { name: "Social Butterfly", desc: "Joined a study group", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
            ].map((ach, i) => (
              <div key={i} className="flex items-center gap-3 p-2 group">
                <div className={`w-10 h-10 rounded-xl ${ach.bg} flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform`}>
                  <ach.icon className={`w-5 h-5 ${ach.color}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{ach.name}</p>
                  <p className="text-[10px] text-muted-foreground">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* SECTION 7 - Activity Timeline */}
      <motion.div variants={fadeUp} className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-[80px] pointer-events-none" />
        <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-blue" />
          Recent Activity
        </h2>
        <div className="relative pl-6 space-y-6">
          <div className="absolute left-2.5 top-2 bottom-2 w-px bg-white/10" />
          
          {[
            { action: "Completed Lesson", target: "React Hooks Basics", time: "2 hours ago", icon: Book, color: "text-brand-blue", bg: "bg-brand-blue/10" },
            { action: "Solved Challenge", target: "String Reversal", time: "Yesterday", icon: Sword, color: "text-brand-purple", bg: "bg-brand-purple/10" },
            { action: "Earned XP", target: "+50 Daily Streak", time: "Yesterday", icon: Star, color: "text-yellow-400", bg: "bg-yellow-400/10" },
            { action: "Joined Group", target: "Frontend Masters", time: "3 days ago", icon: Users, color: "text-emerald-400", bg: "bg-emerald-400/10" }
          ].map((act, i) => (
            <div key={i} className="relative z-10 flex items-start gap-4">
              <div className={`w-5 h-5 rounded-full ${act.bg} border-2 border-[#0A0A0F] absolute -left-[27px] flex items-center justify-center`}>
                <div className={`w-2 h-2 rounded-full ${act.color.replace('text-', 'bg-')}`} />
              </div>
              <div className={`p-2 rounded-lg ${act.bg} shrink-0`}>
                <act.icon className={`w-4 h-4 ${act.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{act.action}</p>
                <p className="text-xs text-muted-foreground">{act.target}</p>
              </div>
              <div className="text-[10px] text-muted-foreground font-medium">{act.time}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* SECTION 7 - Skills Radar & Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        
        {/* SECTION 9 - Skills Radar (Moved next to leaderboard for layout) */}
        <motion.div variants={fadeUp} className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col items-center">
          <h2 className="text-base font-bold text-white w-full flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-brand-blue" />
            Skill Analysis
          </h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                <Radar name="Student" dataKey="A" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.4} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0A0A0F', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full text-center space-y-1">
            <p className="text-sm text-slate-300 font-medium">Your strongest skill: <span className="text-brand-blue font-bold">Code Quality</span></p>
            <p className="text-xs text-muted-foreground">Work on <span className="text-brand-purple">Algorithms</span> to level up faster.</p>
          </div>
        </motion.div>

        {/* SECTION 8 - Mini Leaderboard */}
        <motion.div variants={fadeUp} className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              This Week's Top
            </h2>
            <button className="text-[10px] font-bold text-brand-blue uppercase tracking-wider hover:text-brand-purple transition-colors">View Full</button>
          </div>
          <div className="space-y-2 flex-1">
            {[
              { rank: 1, name: "Alice J.", xp: 4500, me: false },
              { rank: 2, name: "Bob S.", xp: 3800, me: false },
              { rank: 3, name: "Charlie M.", xp: 3200, me: false },
              { rank: 154, name: name, xp: stats.xp, me: true }, // Current user
            ].map((usr, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${usr.me ? "bg-brand-blue/10 border border-brand-blue/30 shadow-[0_0_15px_rgba(56,189,248,0.1)]" : "hover:bg-white/[0.02]"}`}>
                <div className="w-6 text-center font-bold text-muted-foreground text-sm">
                  {usr.rank === 1 ? <span className="text-yellow-400">1</span> : usr.rank === 2 ? <span className="text-slate-300">2</span> : usr.rank === 3 ? <span className="text-amber-600">3</span> : usr.rank}
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex flex-shrink-0 items-center justify-center text-white text-xs font-bold">
                  {usr.name[0]}
                </div>
                <div className="flex-1 min-w-0 flex justify-between items-center">
                  <p className={`text-sm font-semibold truncate ${usr.me ? "text-brand-blue" : "text-slate-200"}`}>{usr.me ? `${usr.name} (You)` : usr.name}</p>
                  <p className="text-xs font-mono text-emerald-400 font-medium">{usr.xp} XP</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* SECTION 10 - AI Recommended Next Steps */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 px-2">
          <Sparkles className="w-5 h-5 text-brand-purple shrink-0" />
          Recommended For You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-xl border border-white/5 hover:border-brand-purple/30 transition-all group">
            <Book className="w-6 h-6 text-brand-purple mb-3 opacity-80 group-hover:opacity-100" />
            <h3 className="text-sm font-bold text-white mb-1">State Management</h3>
            <p className="text-[11px] text-muted-foreground mb-4">You've mastered props. Time to handle complex app state with Context API.</p>
            <button className="text-xs font-bold text-brand-purple hover:text-white transition-colors flex items-center gap-1">Start Lesson <ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className="glass-card p-5 rounded-xl border border-white/5 hover:border-brand-blue/30 transition-all group">
            <Sword className="w-6 h-6 text-brand-blue mb-3 opacity-80 group-hover:opacity-100" />
            <h3 className="text-sm font-bold text-white mb-1">Array Reversal</h3>
            <p className="text-[11px] text-muted-foreground mb-4">Practice your algorithm skills. Medium difficulty, +40 XP reward.</p>
            <button className="text-xs font-bold text-brand-blue hover:text-white transition-colors flex items-center gap-1">Attempt Challenge <ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className="glass-card p-5 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all group">
            <Users className="w-6 h-6 text-emerald-400 mb-3 opacity-80 group-hover:opacity-100" />
            <h3 className="text-sm font-bold text-white mb-1">React Beginners Group</h3>
            <p className="text-[11px] text-muted-foreground mb-4">Join 15 other students currently learning the same topics as you.</p>
            <button className="text-xs font-bold text-emerald-400 hover:text-white transition-colors flex items-center gap-1">Join Group <ChevronRight className="w-3 h-3" /></button>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
