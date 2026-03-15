"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Plus,
  Crown,
  MessageSquare,
  Code2,
  Clock,
  Globe,
  Lock,
  ChevronRight,
  Zap,
  BookOpen,
  Trophy,
  Sparkles,
  X,
  UserPlus,
  Calendar,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types & Mock Data
// ─────────────────────────────────────────────

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  maxMembers: number;
  tags: string[];
  isPublic: boolean;
  isJoined: boolean;
  owner: { name: string; avatar: string };
  activity: string;
  lastActive: string;
  weeklyGoal: string;
  streak: number;
}

const mockGroups: StudyGroup[] = [
  {
    id: "g1",
    name: "Algorithm Crusaders",
    description:
      "Daily algorithm practice & weekly contests. We tackle LeetCode-style problems together and review each other's solutions.",
    members: 24,
    maxMembers: 30,
    tags: ["algorithms", "competitive", "daily-practice"],
    isPublic: true,
    isJoined: true,
    owner: { name: "Sarah Chen", avatar: "SC" },
    activity: "3 members online",
    lastActive: "Just now",
    weeklyGoal: "Solve 5 medium problems",
    streak: 12,
  },
  {
    id: "g2",
    name: "Python Beginners",
    description:
      "A welcoming space for Python newcomers. We go through fundamentals together, share learning resources, and help each other debug code.",
    members: 48,
    maxMembers: 50,
    tags: ["python", "beginner", "friendly"],
    isPublic: true,
    isJoined: true,
    owner: { name: "Marcus Williams", avatar: "MW" },
    activity: "5 members online",
    lastActive: "2m ago",
    weeklyGoal: "Complete 2 lessons",
    streak: 8,
  },
  {
    id: "g3",
    name: "Web Dev Warriors",
    description:
      "Full-stack web development study group. React, Next.js, Node.js, databases, and everything in between.",
    members: 32,
    maxMembers: 40,
    tags: ["web-dev", "react", "fullstack"],
    isPublic: true,
    isJoined: false,
    owner: { name: "Aiko Tanaka", avatar: "AT" },
    activity: "2 members online",
    lastActive: "15m ago",
    weeklyGoal: "Build 1 mini project",
    streak: 5,
  },
  {
    id: "g4",
    name: "Interview Prep Club",
    description:
      "Preparing for technical interviews? Join us for mock interviews, system design discussions, and behavioral prep.",
    members: 19,
    maxMembers: 25,
    tags: ["interviews", "system-design", "career"],
    isPublic: true,
    isJoined: false,
    owner: { name: "Emma Davis", avatar: "ED" },
    activity: "1 member online",
    lastActive: "1h ago",
    weeklyGoal: "1 mock interview",
    streak: 3,
  },
  {
    id: "g5",
    name: "Data Structures Deep Dive",
    description:
      "Advanced data structures study — trees, graphs, heaps, tries, and segment trees. Not for the faint of heart!",
    members: 15,
    maxMembers: 20,
    tags: ["data-structures", "advanced", "theory"],
    isPublic: false,
    isJoined: false,
    owner: { name: "Priya Patel", avatar: "PP" },
    activity: "Offline",
    lastActive: "3h ago",
    weeklyGoal: "Implement 2 data structures",
    streak: 15,
  },
  {
    id: "g6",
    name: "Machine Learning Study",
    description:
      "Exploring ML fundamentals, neural networks, and practical projects using Python and TensorFlow/PyTorch.",
    members: 22,
    maxMembers: 30,
    tags: ["machine-learning", "python", "ai"],
    isPublic: true,
    isJoined: false,
    owner: { name: "Oliver Brown", avatar: "OB" },
    activity: "4 members online",
    lastActive: "30m ago",
    weeklyGoal: "Train 1 model",
    streak: 6,
  },
];

type FilterType = "all" | "joined" | "discover";

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function GroupsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredGroups = useMemo(() => {
    let result = [...mockGroups];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.tags.some((t) => t.includes(q))
      );
    }

    if (filter === "joined") {
      result = result.filter((g) => g.isJoined);
    } else if (filter === "discover") {
      result = result.filter((g) => !g.isJoined);
    }

    return result;
  }, [search, filter]);

  const joinedCount = mockGroups.filter((g) => g.isJoined).length;

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
          <h1 className="text-2xl font-bold text-white">Study Groups</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Collaborate, learn, and grow with fellow coders
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-glow px-4 py-2.5 text-sm"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Group
          </span>
        </button>
      </motion.div>

      {/* Your Groups Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          {
            label: "My Groups",
            value: joinedCount.toString(),
            icon: Users,
            color: "text-brand-blue",
            bg: "from-blue-500/10 to-cyan-500/10",
          },
          {
            label: "Messages",
            value: "23 New",
            icon: MessageSquare,
            color: "text-emerald-400",
            bg: "from-emerald-500/10 to-teal-500/10",
          },
          {
            label: "Group XP",
            value: "450",
            icon: Zap,
            color: "text-amber-400",
            bg: "from-amber-500/10 to-orange-500/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`glass-card p-4 bg-gradient-to-br ${stat.bg}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex items-center gap-3"
      >
        {/* Search */}
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search groups by name, description, or tag..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
          />
        </div>

        {/* Filter tabs */}
        {(["all", "joined", "discover"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-colors border ${
              filter === f
                ? "bg-brand-blue/20 text-brand-blue border-brand-blue/20"
                : "bg-white/[0.02] text-muted-foreground hover:text-white border-white/5"
            }`}
          >
            {f === "all"
              ? "All Groups"
              : f === "joined"
                ? `My Groups (${joinedCount})`
                : "Discover"}
          </button>
        ))}
      </motion.div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  Create a New Study Group
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Group Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., React Study Buddies"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Max Members
                  </label>
                  <input
                    type="number"
                    defaultValue={20}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="What will your group focus on?"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Tags
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., react, web-dev, beginner"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Visibility
                  </label>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-brand-blue/20 text-brand-blue border border-brand-blue/20 text-xs font-medium">
                      <Globe className="w-3 h-3" />
                      Public
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/[0.03] text-muted-foreground border border-white/5 text-xs font-medium hover:text-white transition-colors">
                      <Lock className="w-3 h-3" />
                      Private
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-muted-foreground hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button className="btn-glow px-5 py-2 text-xs">
                  <span className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5" />
                    Create Group
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Groups Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-2 gap-4"
      >
        {filteredGroups.length === 0 ? (
          <div className="col-span-2 glass-card p-12 text-center">
            <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No groups found matching your search
            </p>
          </div>
        ) : (
          filteredGroups.map((group, i) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card p-5 flex flex-col group cursor-pointer hover:border-white/10 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-brand-blue transition-colors">
                      {group.name}
                    </h3>
                    {!group.isPublic && (
                      <Lock className="w-3 h-3 text-muted-foreground/50 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-md bg-white/5 flex items-center justify-center text-[7px] font-bold text-muted-foreground">
                        {group.owner.avatar}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {group.owner.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/40">
                      •
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">
                      {group.lastActive}
                    </span>
                  </div>
                </div>

                {/* Streak badge */}
                {group.streak > 0 && (
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20">
                    <span className="text-[9px]">🔥</span>
                    <span className="text-[9px] font-bold text-rose-400">
                      {group.streak}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {group.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {group.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded-md text-[9px] bg-white/5 text-muted-foreground border border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Weekly Goal */}
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 mb-3">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] text-muted-foreground">
                  Weekly: <span className="text-white">{group.weeklyGoal}</span>
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                <div className="flex items-center gap-3">
                  {/* Members */}
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">
                      {group.members}/{group.maxMembers}
                    </span>
                  </div>
                  {/* Activity indicator */}
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        group.activity.includes("online")
                          ? "bg-emerald-400"
                          : "bg-muted-foreground/30"
                      }`}
                    />
                    <span className="text-[10px] text-muted-foreground/70">
                      {group.activity}
                    </span>
                  </div>
                </div>

                {group.isJoined ? (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-blue/10 text-brand-blue border border-brand-blue/20 text-[10px] font-semibold hover:bg-brand-blue/20 transition-colors">
                    <MessageSquare className="w-3 h-3" />
                    Open
                  </button>
                ) : (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white border border-white/5 text-[10px] font-semibold hover:bg-white/10 transition-colors">
                    <UserPlus className="w-3 h-3" />
                    Join
                  </button>
                )}
              </div>

              {/* Capacity bar */}
              <div className="mt-2">
                <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      group.members / group.maxMembers > 0.9
                        ? "bg-rose-400"
                        : group.members / group.maxMembers > 0.7
                          ? "bg-amber-400"
                          : "bg-brand-blue"
                    }`}
                    style={{
                      width: `${(group.members / group.maxMembers) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Results count */}
      <p className="text-[11px] text-muted-foreground/50 text-center">
        Showing {filteredGroups.length} of {mockGroups.length} groups
      </p>
    </div>
  );
}
