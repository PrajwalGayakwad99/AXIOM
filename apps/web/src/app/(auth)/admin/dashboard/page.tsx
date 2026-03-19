"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Server, Shield, Users, Database, Cpu, Activity,
  AlertTriangle, Search, Trash2, Edit2, Play, Lock, ChevronRight, UserX, UserPlus, CheckCircle, BookOpen
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from "recharts";

const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user?.role && session.user.role !== "ADMIN") {
      router.push("/dashboard");
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-t-2 border-rose-500 animate-spin" />
      </div>
    );
  }

  const growthData = [
    { name: 'Week 1', students: 400, teachers: 24 },
    { name: 'Week 2', students: 600, teachers: 38 },
    { name: 'Week 3', students: 900, teachers: 45 },
    { name: 'Week 4', students: 1200, teachers: 60 },
  ];

  const aiData = [
    { day: 'Mon', claude: 120, deepseek: 80, gpt: 50 },
    { day: 'Tue', claude: 150, deepseek: 90, gpt: 60 },
    { day: 'Wed', claude: 180, deepseek: 120, gpt: 80 },
    { day: 'Thu', claude: 140, deepseek: 100, gpt: 70 },
    { day: 'Fri', claude: 200, deepseek: 150, gpt: 100 },
    { day: 'Sat', claude: 250, deepseek: 180, gpt: 120 },
    { day: 'Sun', claude: 220, deepseek: 160, gpt: 110 },
  ];

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="w-full min-h-screen p-6 space-y-6">
      
      {/* SECTION 1 - System Health Banner */}
      <motion.div variants={fadeUp} className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">All Systems Operational</h2>
            <p className="text-[11px] text-emerald-400/80">Last checked: Just now</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-semibold">
          {[
            { label: "API", status: "up", color: "text-emerald-400" },
            { label: "Database", status: "up", color: "text-emerald-400" },
            { label: "AI Service", status: "slow", color: "text-yellow-400" },
            { label: "Code Runner", status: "up", color: "text-emerald-400" }
          ].map((sys, i) => (
            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-black/20 rounded-md border border-white/5">
              <span className={`w-2 h-2 rounded-full ${sys.color.replace('text-', 'bg-')} ${sys.status === 'slow' ? 'animate-pulse' : ''}`} />
              <span className="text-slate-300">{sys.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* SECTION 2 - Platform Stats */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: "12,450", icon: Users, color: "text-brand-blue" },
          { label: "Online Now", value: "842", icon: Activity, color: "text-emerald-400" },
          { label: "New This Week", value: "+342", icon: UserPlus, color: "text-brand-purple" },
          { label: "Courses Published", value: "148", icon: BookOpen, color: "text-yellow-400" },
          { label: "Code Runs Today", value: "45.2k", icon: Play, color: "text-orange-400" },
          { label: "AI Calls Today", value: "12.8k", icon: Cpu, color: "text-rose-400", sub: "Est: $42.50" }
        ].map((stat, i) => (
          <motion.div key={i} variants={fadeUp} className="glass-card p-5 rounded-2xl border border-white/5 hover:bg-white/[0.02] transition-colors relative group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <stat.icon className={`w-4 h-4 ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
            </div>
            <h3 className={`text-2xl font-bold text-white tracking-tight ${stat.color.includes('emerald') && 'flex items-center gap-2'}`}>
              {stat.value}{" "}
              {stat.color.includes('emerald') && <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse mt-1" />}
            </h3>
            {stat.sub && <p className="text-[10px] text-muted-foreground mt-1">{stat.sub}</p>}
          </motion.div>
        ))}
      </motion.div>

      {/* SECTION 3 - User Growth Chart */}
      <motion.div variants={fadeUp} className="glass-card p-6 rounded-2xl border border-white/5 h-80 flex flex-col">
        <h2 className="text-base font-bold text-white mb-6">User Growth (Last 30 Days)</h2>
        <div className="flex-1 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#0A0A0F', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="students" stroke="#38BDF8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="teachers" stroke="#A855F7" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SECTION 4 - Recent Signups Table */}
        <motion.div variants={fadeUp} className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-brand-blue" />
              Recent Signups (Last 10)
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search users..." className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/[0.02] border-b border-white/5 text-muted-foreground text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { name: "John Doe", email: "john@example.com", role: "STUDENT", time: "2 min ago", status: "Active", color: "text-emerald-400" },
                  { name: "Alice Smith", email: "alice@school.edu", role: "TEACHER", time: "1 hr ago", status: "Unverified", color: "text-yellow-400" },
                  { name: "Bob Martin", email: "bob@hacker.com", role: "STUDENT", time: "3 hrs ago", status: "Suspended", color: "text-rose-400" },
                  { name: "Admin Sys", email: "admin@codevision.ai", role: "ADMIN", time: "1 day ago", status: "Active", color: "text-emerald-400" }
                ].map((u, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 text-brand-blue flex items-center justify-center rounded-full text-[10px] font-bold border border-brand-blue/20 shrink-0">{u.name[0]}</div>
                        <div>
                          <p className="font-semibold text-white leading-none">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold uppercase ${u.role === 'ADMIN' ? 'text-rose-400' : u.role === 'TEACHER' ? 'text-brand-purple' : 'text-brand-blue'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.time}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${u.color.replace('text-', 'bg-').concat('/10 border border-').concat(u.color.slice(5)).concat('/20')} ${u.color}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-[10px] font-medium text-slate-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded border border-white/5 shrink-0">Manage▾</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* SECTION 5 - Moderation Queue Card */}
        <motion.div variants={fadeUp} className="glass-card p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 flex flex-col overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[50px] pointer-events-none" />
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-rose-400" />
              Content Moderation
            </h2>
            <div className="flex items-center justify-center w-6 h-6 bg-rose-500 rounded-full text-[10px] font-bold text-white animate-pulse">
              12
            </div>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 relative z-10 scrollbar-none">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-3 bg-[#0A0A0F] rounded-xl border border-rose-500/10 hover:border-rose-500/30 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold text-white line-clamp-1">Inappropriate comment</h3>
                  <span className="text-[10px] text-muted-foreground shrink-0">{i*10}m ago</span>
                </div>
                <p className="text-[10px] text-slate-400 mb-2">Reported by User{i} - Hate Speech</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold py-1.5 rounded transition-colors">Approve</button>
                  <button className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold py-1.5 rounded transition-colors">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors bg-rose-500/10 py-2 rounded-lg relative z-10 border border-rose-500/20">
            View All Pending (12)
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 6 - AI Usage Dashboard */}
        <motion.div variants={fadeUp} className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6">
          <div className="flex-1 h-64 flex flex-col">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-brand-purple" />
              AI Calls (7 Days)
            </h2>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aiData} barSize={10}>
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0A0A0F', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }} />
                  <Bar dataKey="claude" stackId="a" fill="#38BDF8" radius={[0,0,4,4]} />
                  <Bar dataKey="deepseek" stackId="a" fill="#A855F7" />
                  <Bar dataKey="gpt" stackId="a" fill="#10B981" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex flex-col justify-center space-y-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">Tokens Month</p>
              <p className="text-xl font-bold text-white mt-1">4.2M</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">Est. Cost</p>
              <p className="text-xl font-bold text-white mt-1">$142.50</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">Avg Time</p>
              <p className="text-xl font-bold text-white mt-1">1.2s</p>
            </div>
            <button className="btn-glow py-2 text-xs w-full mt-2 shadow-[0_0_15px_rgba(56,189,248,0.2)]">Switch Model</button>
          </div>
        </motion.div>

        {/* SECTION 7 - Plagiarism Alerts */}
        <motion.div variants={fadeUp} className="glass-card p-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 relative overflow-hidden flex flex-col h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] pointer-events-none" />
          <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2 relative z-10">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Code Similarity Alerts
          </h2>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 relative z-10 scrollbar-thin">
            {[
              { name: "Student 12", challenge: "Array Sort", sim: 98, date: "10m ago", color: "text-rose-400", bg: "bg-rose-500/10" },
              { name: "Student 4", challenge: "Palindrome", sim: 85, date: "1h ago", color: "text-yellow-400", bg: "bg-yellow-500/10" },
              { name: "Student 8", challenge: "Two Sum", sim: 75, date: "3h ago", color: "text-yellow-400", bg: "bg-yellow-500/10" },
              { name: "Student 1", challenge: "Linked List", sim: 60, date: "1d ago", color: "text-emerald-400", bg: "bg-emerald-500/10" },
            ].map((alert, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-[#0A0A0F] rounded-xl border border-yellow-500/10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{alert.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${alert.bg} ${alert.color}`}>{alert.sim}% Sim</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{alert.challenge} • {alert.date}</div>
                </div>
                <button className={`w-8 h-8 rounded-lg ${alert.bg} ${alert.color} flex items-center justify-center hover:scale-110 transition-transform`}>
                   <Search className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* SECTION 8 - Platform Activity Log */}
      <motion.div variants={fadeUp} className="glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col h-80">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-400" />
            Live System Log
          </h2>
          <div className="flex gap-2 text-[10px]">
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> CRIT</span>
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /> WARN</span>
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-blue" /> INFO</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[10px] sm:text-xs">
          {[
            { level: "info", msg: "User john@xx logged in successfully", time: "12:45:01" },
            { level: "info", msg: "Code execute: Python3 (pid: 4421) runtime=42ms", time: "12:44:59" },
            { level: "warn", msg: "High DB connection pooling delay (1.2s)", time: "12:44:30" },
            { level: "crit", msg: "Stripe webhook signature validation failed", time: "12:42:15" },
            { level: "info", msg: "New course created: 'Advanced GraphQL'", time: "12:40:02" },
            { level: "info", msg: "AI Generate Quiz requested by Teacher8", time: "12:35:10" },
            { level: "warn", msg: "Rate limit approach: IP 192.168.0.4", time: "12:30:45" },
            { level: "info", msg: "Automated DB backup completed", time: "12:00:00" },
          ].map((log, i) => (
            <div key={i} className="flex gap-3 hover:bg-white/5 p-1 rounded transition-colors group">
              <span className="text-slate-500 shrink-0">{log.time}</span>
              <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${log.level === 'info' ? 'bg-brand-blue' : log.level === 'warn' ? 'bg-yellow-400 shadow-[0_0_5px_#FACC15]' : 'bg-rose-500 shadow-[0_0_5px_#F43F5E]'}`} />
              <span className="text-slate-300 break-all">{log.msg}</span>
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-white/5 text-right w-full bg-black/40">
           <button className="text-[10px] text-slate-500 hover:text-white transition-colors">Clear Log</button>
        </div>
      </motion.div>

    </motion.div>
  );
}
