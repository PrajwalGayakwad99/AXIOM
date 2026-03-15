"use client";

import { motion } from "framer-motion";

const codeLines = [
  { text: "def ", highlight: "keyword" },
  { text: "binary_search", highlight: "function" },
  { text: "(arr, target):", highlight: "default" },
  { text: "    left, right = 0, len(arr) - 1", highlight: "default" },
  { text: "    while left <= right:", highlight: "keyword" },
  { text: "        mid = (left + right) // 2", highlight: "default" },
  { text: "        if arr[mid] == target:", highlight: "keyword" },
  { text: '            return mid  # Found!', highlight: "comment" },
  { text: "        elif arr[mid] < target:", highlight: "keyword" },
  { text: "            left = mid + 1", highlight: "default" },
  { text: "        else:", highlight: "keyword" },
  { text: "            right = mid - 1", highlight: "default" },
  { text: "    return -1", highlight: "keyword" },
];

const highlightColors: Record<string, string> = {
  keyword: "text-brand-purple",
  function: "text-brand-blue",
  comment: "text-green-400/60",
  default: "text-slate-300",
};

export function FloatingCodeWindow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="relative"
    >
      {/* Glow behind */}
      <div className="absolute -inset-4 bg-gradient-to-r from-brand-blue/20 via-brand-purple/20 to-brand-pink/20 rounded-2xl blur-2xl opacity-50" />

      <div className="relative glass-card overflow-hidden">
        {/* Title Bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-muted-foreground font-mono ml-2">
            binary_search.py
          </span>
        </div>

        {/* Code */}
        <div className="p-4 font-mono text-sm leading-relaxed">
          {codeLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.08, duration: 0.3 }}
              className="flex"
            >
              <span className="text-muted-foreground/40 w-6 text-right mr-4 select-none text-xs">
                {i + 1}
              </span>
              <span className={highlightColors[line.highlight]}>
                {line.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 text-xs text-muted-foreground">
          <span>Python</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span>Connected to AI Tutor</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
