"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard, BookOpen, TerminalSquare, Trophy, Users, Settings, FolderKanban,
  BarChart, ShieldAlert, Search, MessageSquare, Brain, User, Flame, LogOut, Code, Activity, Server, FileEdit, CheckCircle2
} from "lucide-react";

interface SidebarProps {
  role: string;
}

const getNavSections = (role: string) => {
  if (role === "TEACHER") {
    return [
      {
        title: "Main",
        items: [
          { name: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
          { name: "My Courses", href: "/teacher/courses", icon: BookOpen },
          { name: "Assignments", href: "/teacher/assignments", icon: FileEdit },
        ]
      },
      {
        title: "Analytics",
        items: [
          { name: "Analytics", href: "/teacher/analytics", icon: BarChart },
          { name: "Peer Reviews", href: "/teacher/peer-review", icon: CheckCircle2 },
        ]
      },
      {
        title: "Tools & Social",
        items: [
          { name: "Community", href: "/community", icon: MessageSquare },
          { name: "AI Tools", href: "/teacher/ai-tools", icon: Brain },
          { name: "Settings", href: "/settings", icon: Settings },
        ]
      }
    ];
  }

  if (role === "ADMIN") {
    return [
      {
        title: "Main",
        items: [
          { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
          { name: "User Management", href: "/admin/users", icon: Users },
          { name: "Moderation", href: "/admin/moderation", icon: ShieldAlert },
        ]
      },
      {
        title: "System",
        items: [
          { name: "AI Config", href: "/admin/ai-config", icon: Brain },
          { name: "Analytics", href: "/admin/analytics", icon: BarChart },
          { name: "Settings", href: "/settings", icon: Settings },
        ]
      }
    ];
  }

  // STUDENT
  return [
    {
      title: "Main",
      items: [
        { name: "Home/Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Learning Path", href: "/learn", icon: BookOpen },
        { name: "Playground", href: "/playground", icon: TerminalSquare },
      ]
    },
    {
      title: "Practice & Play",
      items: [
        { name: "Challenges", href: "/challenges", icon: Trophy },
        { name: "Leaderboard", href: "/leaderboard", icon: Flame },
        { name: "AI Tutor", href: "/ai-tutor", icon: Brain },
      ]
    },
    {
      title: "Social",
      items: [
        { name: "Community", href: "/community", icon: MessageSquare },
        { name: "Study Groups", href: "/groups", icon: Users },
        { name: "My Portfolio", href: "/portfolio", icon: User },
        { name: "Settings", href: "/settings", icon: Settings },
      ]
    }
  ];
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const sections = getNavSections(role);

  const userName = session?.user?.name || (role === "TEACHER" ? "Teacher" : role === "ADMIN" ? "Admin" : "Student");
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="fixed left-0 top-0 h-screen w-60 bg-gray-950 border-r border-gray-800 flex flex-col z-40 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 pt-6 pb-8">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white text-sm font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]">
          CV
        </div>
        <div>
          <span className="text-[15px] font-bold text-white tracking-tight">CodeVision</span>
          <span className="text-[15px] font-bold text-brand-blue ml-1">AI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-none">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-2">
              {section.title}
            </p>
            {section.items.map((item) => {
              // Active if exact match or if it's the dashboard sub-route
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150",
                    isActive ? "bg-indigo-600 text-white rounded-lg border-l-2 border-indigo-400" : "text-slate-400 hover:bg-gray-800 rounded-lg"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-brand-blue/10 to-transparent border-l-2 border-brand-blue pointer-events-none"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <item.icon className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive ? "text-brand-blue" : "text-slate-500 group-hover:text-brand-blue/80"
                  )} />
                  <span className="relative z-10 truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Profile Card at Bottom */}
      <div className="p-4 border-t border-white/5 bg-white/[0.01]">
        <div className="glass-card p-3 rounded-xl border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-brand-purple/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-white text-xs font-bold shrink-0 border border-white/10 group-hover:border-brand-blue/30 transition-colors">
                {initial}
              </div>
              <div className="min-w-0 pr-2">
                <p className="text-[13px] font-semibold text-white truncate leading-tight">{userName}</p>
                {role === "STUDENT" && <p className="text-[10px] text-muted-foreground truncate">Lvl 5 • 1,250 XP</p>}
                {role === "TEACHER" && <span className="bg-brand-purple/20 text-brand-purple text-[9px] font-bold px-1.5 py-0.5 rounded-sm inline-block mt-0.5">TEACHER</span>}
                {role === "ADMIN" && <span className="bg-rose-500/20 text-rose-400 text-[9px] font-bold px-1.5 py-0.5 rounded-sm inline-block mt-0.5 flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> SYSTEM UP</span>}
              </div>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="text-muted-foreground hover:text-rose-400 transition-colors p-1" 
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          
          {/* XP Progress Bar for Students */}
          {role === "STUDENT" && (
            <div className="h-1.5 rounded-full bg-black/40 border border-white/5 overflow-hidden relative z-10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-purple"
                initial={{ width: "0%" }}
                animate={{ width: "65%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
