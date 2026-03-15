"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  ChevronDown,
  MoreVertical,
  Mail,
  Calendar,
  Activity,
  Ban,
  Edit,
  Eye,
  Trash2,
  Download,
} from "lucide-react";

// ─────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────

interface UserEntry {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  status: "active" | "suspended" | "pending";
  joinDate: string;
  lastActive: string;
  xp: number;
  level: number;
}

const mockUsers: UserEntry[] = [
  { id: "u1", name: "Sarah Chen", email: "sarah@example.com", avatar: "SC", role: "STUDENT", status: "active", joinDate: "Jan 15, 2026", lastActive: "2m ago", xp: 12450, level: 24 },
  { id: "u2", name: "Marcus Williams", email: "marcus@example.com", avatar: "MW", role: "TEACHER", status: "active", joinDate: "Dec 1, 2025", lastActive: "15m ago", xp: 11200, level: 22 },
  { id: "u3", name: "Aiko Tanaka", email: "aiko@example.com", avatar: "AT", role: "STUDENT", status: "active", joinDate: "Feb 10, 2026", lastActive: "1h ago", xp: 10800, level: 21 },
  { id: "u4", name: "James Rodriguez", email: "james@example.com", avatar: "JR", role: "STUDENT", status: "suspended", joinDate: "Nov 20, 2025", lastActive: "5d ago", xp: 9350, level: 19 },
  { id: "u5", name: "Emma Davis", email: "emma@example.com", avatar: "ED", role: "STUDENT", status: "active", joinDate: "Mar 1, 2026", lastActive: "30m ago", xp: 8700, level: 18 },
  { id: "u6", name: "Priya Patel", email: "priya@example.com", avatar: "PP", role: "TEACHER", status: "active", joinDate: "Oct 5, 2025", lastActive: "3h ago", xp: 7900, level: 16 },
  { id: "u7", name: "Lucas Kim", email: "lucas@example.com", avatar: "LK", role: "STUDENT", status: "pending", joinDate: "Mar 10, 2026", lastActive: "Never", xp: 0, level: 1 },
  { id: "u8", name: "Admin User", email: "admin@codevision.ai", avatar: "AD", role: "ADMIN", status: "active", joinDate: "Sep 1, 2025", lastActive: "Just now", xp: 50000, level: 50 },
];

type RoleFilter = "all" | "STUDENT" | "TEACHER" | "ADMIN";
type StatusFilterType = "all" | "active" | "suspended" | "pending";

function RoleBadge({ role }: { role: string }) {
  const config = {
    STUDENT: { bg: "bg-brand-blue/10", text: "text-brand-blue", border: "border-brand-blue/20" },
    TEACHER: { bg: "bg-brand-purple/10", text: "text-brand-purple", border: "border-brand-purple/20" },
    ADMIN: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
  }[role] || { bg: "bg-white/5", text: "text-white", border: "border-white/10" };

  return (
    <span className={`px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}>{role}</span>
  );
}

function StatusDot({ status }: { status: string }) {
  const color = {
    active: "bg-emerald-400",
    suspended: "bg-rose-400",
    pending: "bg-amber-400",
  }[status] || "bg-slate-400";
  return <span className={`w-1.5 h-1.5 rounded-full ${color}`} />;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");

  const filtered = useMemo(() => {
    return mockUsers.filter((u) => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      return true;
    });
  }, [search, roleFilter, statusFilter]);

  const activeCount = mockUsers.filter((u) => u.status === "active").length;
  const teacherCount = mockUsers.filter((u) => u.role === "TEACHER").length;
  const pendingCount = mockUsers.filter((u) => u.status === "pending").length;

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
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all platform users, roles, and permissions
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-muted-foreground hover:text-white transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export CSV
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
          { label: "Total Users", value: mockUsers.length, icon: Users, color: "text-brand-blue" },
          { label: "Active", value: activeCount, icon: UserCheck, color: "text-emerald-400" },
          { label: "Teachers", value: teacherCount, icon: ShieldCheck, color: "text-brand-purple" },
          { label: "Pending", value: pendingCount, icon: ShieldAlert, color: "text-amber-400" },
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
            placeholder="Search by name or email..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            className="appearance-none bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 pr-8 text-xs text-muted-foreground focus:outline-none focus:border-brand-blue/50 transition-colors"
          >
            <option value="all" className="bg-[#13131D]">All Roles</option>
            <option value="STUDENT" className="bg-[#13131D]">Students</option>
            <option value="TEACHER" className="bg-[#13131D]">Teachers</option>
            <option value="ADMIN" className="bg-[#13131D]">Admins</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilterType)}
            className="appearance-none bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 pr-8 text-xs text-muted-foreground focus:outline-none focus:border-brand-blue/50 transition-colors"
          >
            <option value="all" className="bg-[#13131D]">All Status</option>
            <option value="active" className="bg-[#13131D]">Active</option>
            <option value="suspended" className="bg-[#13131D]">Suspended</option>
            <option value="pending" className="bg-[#13131D]">Pending</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        <div className="grid grid-cols-[1fr_140px_80px_80px_100px_100px_60px] gap-3 px-5 py-2.5 border-b border-white/5 bg-white/[0.01]">
          {["User", "Email", "Role", "Status", "Joined", "Last Active", ""].map((h) => (
            <span key={h} className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium">{h}</span>
          ))}
        </div>

        {filtered.map((user, i) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="grid grid-cols-[1fr_140px_80px_80px_100px_100px_60px] gap-3 px-5 py-3 items-center border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
          >
            {/* User */}
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                user.role === "ADMIN"
                  ? "bg-gradient-to-br from-rose-500/20 to-orange-500/20 text-rose-400 border border-rose-500/20"
                  : user.role === "TEACHER"
                    ? "bg-gradient-to-br from-brand-purple/20 to-violet-500/20 text-brand-purple border border-brand-purple/20"
                    : "bg-white/5 text-muted-foreground border border-white/5"
              }`}>
                {user.avatar}
              </div>
              <div>
                <p className="text-xs font-medium text-white">{user.name}</p>
                <p className="text-[10px] text-muted-foreground">Lv.{user.level} · {user.xp.toLocaleString()} XP</p>
              </div>
            </div>

            {/* Email */}
            <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>

            {/* Role */}
            <RoleBadge role={user.role} />

            {/* Status */}
            <div className="flex items-center gap-1.5">
              <StatusDot status={user.status} />
              <span className="text-[10px] text-muted-foreground capitalize">{user.status}</span>
            </div>

            {/* Joined */}
            <span className="text-[10px] text-muted-foreground">{user.joinDate}</span>

            {/* Last Active */}
            <span className="text-[10px] text-muted-foreground">{user.lastActive}</span>

            {/* Actions */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors" title="View profile">
                <Eye className="w-3 h-3" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-rose-400 transition-colors" title="Suspend">
                <Ban className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <p className="text-[11px] text-muted-foreground/50 text-center">
        Showing {filtered.length} of {mockUsers.length} users
      </p>
    </div>
  );
}
