"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Globe,
  Mail,
  Shield,
  Database,
  Bell,
  Save,
  Loader2,
  Check,
  RefreshCw,
  Server,
  Key,
} from "lucide-react";

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [platformName, setPlatformName] = useState("CodeVision AI");
  const [supportEmail, setSupportEmail] = useState("support@codevision.ai");
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [emailVerification, setEmailVerification] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [maxFileUpload, setMaxFileUpload] = useState(5);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const toggleSettings = [
    { id: "registration", label: "Open Registration", description: "Allow new users to register", value: registrationOpen, toggle: () => setRegistrationOpen(!registrationOpen) },
    { id: "emailVerification", label: "Email Verification", description: "Require email verification for new accounts", value: emailVerification, toggle: () => setEmailVerification(!emailVerification) },
    { id: "maintenance", label: "Maintenance Mode", description: "Show maintenance page to non-admin users", value: maintenanceMode, toggle: () => setMaintenanceMode(!maintenanceMode), danger: true },
    { id: "autoBackup", label: "Auto Backup", description: "Automatically back up database daily at 3 AM UTC", value: autoBackup, toggle: () => setAutoBackup(!autoBackup) },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure global platform options</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="btn-glow px-5 py-2.5 text-sm">
          <span className="flex items-center gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </span>
        </button>
      </motion.div>

      {/* General */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="glass-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Globe className="w-4 h-4 text-brand-blue" /> General</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Platform Name</label>
            <input type="text" value={platformName} onChange={(e) => setPlatformName(e.target.value)} className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue/50 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Support Email</label>
            <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue/50 transition-colors" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Max File Upload (MB)</label>
          <select value={maxFileUpload} onChange={(e) => setMaxFileUpload(parseInt(e.target.value))} className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue/50 transition-colors appearance-none">
            {[2, 5, 10, 25, 50].map((v) => <option key={v} value={v} className="bg-[#13131D]">{v} MB</option>)}
          </select>
        </div>
      </motion.div>

      {/* Toggles */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="glass-card p-5 space-y-1">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3"><Shield className="w-4 h-4 text-emerald-400" /> Security & Access</h3>
        {toggleSettings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <div>
              <p className={`text-sm ${setting.danger && setting.value ? "text-rose-400" : "text-white"}`}>{setting.label}</p>
              <p className="text-xs text-muted-foreground">{setting.description}</p>
            </div>
            <button
              onClick={setting.toggle}
              className={`relative w-11 h-6 rounded-full border transition-colors ${
                setting.value
                  ? setting.danger ? "bg-rose-500/20 border-rose-500/30" : "bg-brand-blue/20 border-brand-blue/30"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <motion.span
                animate={{ x: setting.value ? 20 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`absolute top-1 w-4 h-4 rounded-full transition-colors ${
                  setting.value
                    ? setting.danger ? "bg-rose-400" : "bg-brand-blue"
                    : "bg-muted-foreground"
                }`}
              />
            </button>
          </div>
        ))}
      </motion.div>

      {/* Environment */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="glass-card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Server className="w-4 h-4 text-amber-400" /> Environment</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "DATABASE_URL", value: "postgresql://...@localhost:5432/codevision", masked: true },
            { key: "NEXTAUTH_SECRET", value: "••••••••••••••••", masked: true },
            { key: "LITELLM_URL", value: "http://localhost:4000", masked: false },
            { key: "NODE_ENV", value: "development", masked: false },
          ].map((env) => (
            <div key={env.key} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <p className="text-[10px] text-muted-foreground font-mono">{env.key}</p>
              <p className={`text-xs mt-0.5 font-mono ${env.masked ? "text-muted-foreground/40" : "text-white"}`}>{env.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
