"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Github,
  Globe,
  Shield,
  Bell,
  Palette,
  Save,
  Loader2,
  Check,
  Camera,
  KeyRound,
  ChevronRight,
  Monitor,
  Moon,
  Sun,
  Smartphone,
  Trash2,
  X,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { ProfileSettingsFormSchema, type ProfileSettingsFormData } from "@/types";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

// ─────────────────────────────────────────────
// Tab definitions
// ─────────────────────────────────────────────

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
] as const;

type TabId = (typeof tabs)[number]["id"];

// ─────────────────────────────────────────────
// Notification settings
// ─────────────────────────────────────────────

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const defaultNotifications: NotificationSetting[] = [
  { id: "achievements", label: "Achievements", description: "When you earn a new badge or achievement", enabled: true },
  { id: "streak", label: "Streak Reminders", description: "Daily reminder to maintain your streak", enabled: true },
  { id: "challenges", label: "New Challenges", description: "When new coding challenges are available", enabled: true },
  { id: "forums", label: "Forum Replies", description: "When someone replies to your forum post", enabled: true },
  { id: "groups", label: "Group Messages", description: "Messages in your study groups", enabled: false },
  { id: "marketing", label: "Product Updates", description: "News about CodeVision AI features", enabled: false },
];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");

  // Profile form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileSettingsFormData>({
    resolver: zodResolver(ProfileSettingsFormSchema) as any,
    defaultValues: {
      name: "Alex Johnson",
      bio: "Full-stack developer & CS student. Passionate about algorithms and AI.",
      github: "https://github.com/alexjohnson",
      portfolioUrl: "https://alexjohnson.dev",
      twoFactorEnabled: false,
    },
  });

  const handleSave = async (data?: ProfileSettingsFormData) => {
    setIsSaving(true);
    // Simulate API save
    await new Promise((r) => setTimeout(r, 1200));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const onProfileSubmit = async (data: ProfileSettingsFormData) => {
    await handleSave(data);
  };

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div {...fadeUp}>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account preferences and configuration
        </p>
      </motion.div>

      {/* Tabs + Content */}
      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-48 shrink-0 space-y-1"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-brand-blue/10 text-brand-blue border border-brand-blue/20"
                    : "text-muted-foreground hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
              </button>
            );
          })}
        </motion.nav>

        {/* Content Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex-1 min-w-0"
        >
          <AnimatePresence mode="wait">
            {/* ── PROFILE TAB ── */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Avatar Section */}
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-white mb-4">
                    Profile Picture
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-2xl font-bold text-white">
                        AJ
                      </div>
                      <button className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white hover:bg-white/10 transition-colors">
                          Upload
                        </button>
                        <button className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-red-400 transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <form
                  onSubmit={handleSubmit(onProfileSubmit)}
                  className="glass-card p-6 space-y-5"
                >
                  <h3 className="text-sm font-semibold text-white">
                    Personal Information
                  </h3>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Display Name
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
                      <input
                        {...register("name")}
                        type="text"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-[11px] text-rose-400">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Bio
                    </label>
                    <textarea
                      {...register("bio")}
                      rows={3}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors resize-none"
                      placeholder="Tell us about yourself..."
                    />
                    {errors.bio && (
                      <p className="text-[11px] text-rose-400">
                        {errors.bio.message}
                      </p>
                    )}
                  </div>

                  {/* GitHub */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      GitHub URL
                    </label>
                    <div className="relative group">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
                      <input
                        {...register("github")}
                        type="text"
                        placeholder="https://github.com/username"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
                      />
                    </div>
                    {errors.github && (
                      <p className="text-[11px] text-rose-400">
                        {errors.github.message}
                      </p>
                    )}
                  </div>

                  {/* Portfolio URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Portfolio URL
                    </label>
                    <div className="relative group">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
                      <input
                        {...register("portfolioUrl")}
                        type="text"
                        placeholder="https://yourportfolio.dev"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
                      />
                    </div>
                    {errors.portfolioUrl && (
                      <p className="text-[11px] text-rose-400">
                        {errors.portfolioUrl.message}
                      </p>
                    )}
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn-glow px-6 py-2.5 text-sm"
                    >
                      <span className="flex items-center gap-2">
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : saveSuccess ? (
                          <>
                            <Check className="w-4 h-4" />
                            Saved!
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </span>
                    </button>
                    {isDirty && !saveSuccess && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] text-amber-400"
                      >
                        Unsaved changes
                      </motion.span>
                    )}
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── SECURITY TAB ── */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Password */}
                <div className="glass-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Change Password
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Last changed 30 days ago
                      </p>
                    </div>
                    <KeyRound className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Current Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand-blue/50 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSave()}
                    className="btn-glow px-5 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Update Password
                    </span>
                  </button>
                </div>

                {/* Two-Factor Auth */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button className="relative w-11 h-6 rounded-full bg-white/10 border border-white/5 transition-colors hover:bg-white/15">
                      <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-muted-foreground transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="glass-card p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-white">
                    Active Sessions
                  </h3>
                  {[
                    {
                      device: "Chrome on Windows",
                      location: "Mumbai, India",
                      icon: Monitor,
                      current: true,
                    },
                    {
                      device: "Safari on iPhone",
                      location: "Mumbai, India",
                      icon: Smartphone,
                      current: false,
                    },
                  ].map((session) => (
                    <div
                      key={session.device}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                          <session.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white">
                            {session.device}
                            {session.current && (
                              <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Current
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {session.location}
                          </p>
                        </div>
                      </div>
                      {!session.current && (
                        <button className="text-xs text-red-400 hover:text-red-300 transition-colors">
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Danger Zone */}
                <div className="glass-card p-6 border-red-500/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-red-400">
                        Danger Zone
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/20 bg-red-500/5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── NOTIFICATIONS TAB ── */}
            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="glass-card p-6 space-y-1">
                  <h3 className="text-sm font-semibold text-white mb-4">
                    Email Notifications
                  </h3>

                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                    >
                      <div>
                        <p className="text-sm text-white">{n.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {n.description}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleNotification(n.id)}
                        className={`relative w-11 h-6 rounded-full border transition-colors ${
                          n.enabled
                            ? "bg-brand-blue/20 border-brand-blue/30"
                            : "bg-white/5 border-white/10"
                        }`}
                      >
                        <motion.span
                          animate={{ x: n.enabled ? 20 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className={`absolute top-1 w-4 h-4 rounded-full transition-colors ${
                            n.enabled ? "bg-brand-blue" : "bg-muted-foreground"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── APPEARANCE TAB ── */}
            {activeTab === "appearance" && (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Theme */}
                <div className="glass-card p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-white">Theme</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        id: "dark" as const,
                        label: "Dark",
                        icon: Moon,
                        desc: "Easy on the eyes",
                      },
                      {
                        id: "light" as const,
                        label: "Light",
                        icon: Sun,
                        desc: "Bright & clean",
                      },
                      {
                        id: "system" as const,
                        label: "System",
                        icon: Monitor,
                        desc: "Follow OS setting",
                      },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                          theme === t.id
                            ? "border-brand-blue/50 bg-brand-blue/[0.08]"
                            : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10"
                        }`}
                      >
                        <t.icon
                          className={`w-6 h-6 ${
                            theme === t.id
                              ? "text-brand-blue"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={`text-xs font-medium ${
                            theme === t.id ? "text-white" : "text-muted-foreground"
                          }`}
                        >
                          {t.label}
                        </span>
                        <span className="text-[9px] text-muted-foreground/60">
                          {t.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Editor Preferences */}
                <div className="glass-card p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-white">
                    Code Editor
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    These settings apply to all code editors across the platform
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Font Size
                      </label>
                      <select className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-blue/50 transition-colors appearance-none">
                        {[12, 13, 14, 15, 16, 18, 20].map((size) => (
                          <option
                            key={size}
                            value={size}
                            className="bg-[#13131D]"
                          >
                            {size}px
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Tab Size
                      </label>
                      <select className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-blue/50 transition-colors appearance-none">
                        {[2, 4, 8].map((size) => (
                          <option
                            key={size}
                            value={size}
                            className="bg-[#13131D]"
                          >
                            {size} spaces
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
