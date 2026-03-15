"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Settings,
  Zap,
  Shield,
  RefreshCw,
  Save,
  Loader2,
  Check,
  AlertTriangle,
  Activity,
  BarChart3,
  Clock,
  DollarSign,
  Hash,
  Sliders,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

// ─────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────

const aiModels = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", status: "active", cost: "$0.03/1K", latency: "1.2s", usage: 65 },
  { id: "claude-3", name: "Claude 3 Sonnet", provider: "Anthropic", status: "active", cost: "$0.015/1K", latency: "0.9s", usage: 25 },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google", status: "inactive", cost: "$0.01/1K", latency: "0.7s", usage: 10 },
];

const aiFeatures = [
  { id: "tutor", name: "AI Tutor", description: "Interactive tutoring conversations", enabled: true, dailyLimit: 50 },
  { id: "code_analysis", name: "Code Analysis", description: "Analyze user code for bugs and improvements", enabled: true, dailyLimit: 100 },
  { id: "quiz_gen", name: "Quiz Generation", description: "AI-generated quizzes based on lesson content", enabled: true, dailyLimit: 30 },
  { id: "hint_gen", name: "Hint Generation", description: "Context-aware hints for challenges", enabled: true, dailyLimit: 200 },
  { id: "plagiarism", name: "Plagiarism Detection", description: "Detect copied code in submissions", enabled: false, dailyLimit: 0 },
];

const usageStats = [
  { label: "API Calls Today", value: "2,847", icon: Activity, color: "text-brand-blue" },
  { label: "Estimated Cost", value: "$12.40", icon: DollarSign, color: "text-emerald-400" },
  { label: "Avg Latency", value: "1.1s", icon: Clock, color: "text-amber-400" },
  { label: "Error Rate", value: "0.3%", icon: AlertTriangle, color: "text-rose-400" },
];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function AdminAIConfigPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [features, setFeatures] = useState(aiFeatures);
  const [defaultModel, setDefaultModel] = useState("gpt-4o");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [safetyLevel, setSafetyLevel] = useState<"standard" | "strict" | "max">("strict");

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const toggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

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
          <h1 className="text-2xl font-bold text-white">AI Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage AI models, features, rate limits and safety settings
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-glow px-5 py-2.5 text-sm"
        >
          <span className="flex items-center gap-2">
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <><Check className="w-4 h-4" /> Saved!</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </span>
        </button>
      </motion.div>

      {/* Usage Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        {usageStats.map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {/* Model Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="glass-card p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-brand-purple" />
            Model Configuration
          </h3>

          {/* Models list */}
          <div className="space-y-2">
            {aiModels.map((model) => (
              <div
                key={model.id}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  defaultModel === model.id
                    ? "bg-brand-blue/[0.06] border-brand-blue/20"
                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                }`}
                onClick={() => setDefaultModel(model.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${model.status === "active" ? "bg-emerald-400" : "bg-slate-400"}`} />
                    <div>
                      <p className="text-xs font-medium text-white">{model.name}</p>
                      <p className="text-[10px] text-muted-foreground">{model.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground">{model.cost}</span>
                    <span className="text-[10px] text-muted-foreground">{model.latency}</span>
                    {defaultModel === model.id && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue font-semibold">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Parameters */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Temperature</label>
                <span className="text-[10px] text-brand-blue font-bold">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full bg-white/5 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-blue [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-muted-foreground/50">
                <span>Precise</span><span>Creative</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Max Tokens</label>
              <select
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue/50 transition-colors appearance-none"
              >
                {[512, 1024, 2048, 4096, 8192].map((v) => (
                  <option key={v} value={v} className="bg-[#13131D]">{v.toLocaleString()}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Safety & Rate Limiting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Safety & Rate Limiting
          </h3>

          {/* Safety level */}
          <div className="space-y-2">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Content Safety Level</label>
            <div className="grid grid-cols-3 gap-2">
              {(["standard", "strict", "max"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSafetyLevel(level)}
                  className={`py-2.5 rounded-lg text-xs font-medium transition-all border ${
                    safetyLevel === level
                      ? level === "max"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : level === "strict"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-white/[0.02] text-muted-foreground border-white/5"
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground/60">
              {safetyLevel === "max"
                ? "Maximum filtering — blocks all questionable content"
                : safetyLevel === "strict"
                  ? "Strict filtering — blocks harmful + borderline content"
                  : "Standard filtering — blocks clearly harmful content only"}
            </p>
          </div>

          {/* Feature toggles */}
          <div className="space-y-1 pt-2">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">AI Features</label>
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-xs text-white font-medium">{feature.name}</p>
                  <p className="text-[10px] text-muted-foreground">{feature.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  {feature.enabled && (
                    <span className="text-[9px] text-muted-foreground/60">{feature.dailyLimit}/day</span>
                  )}
                  <button
                    onClick={() => toggleFeature(feature.id)}
                    className={`relative w-11 h-6 rounded-full border transition-colors ${
                      feature.enabled
                        ? "bg-brand-blue/20 border-brand-blue/30"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <motion.span
                      animate={{ x: feature.enabled ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`absolute top-1 w-4 h-4 rounded-full transition-colors ${
                        feature.enabled ? "bg-brand-blue" : "bg-muted-foreground"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
