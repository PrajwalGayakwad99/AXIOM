"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { AITutorChat } from "@/components/ai/ai-tutor-chat";
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Circle,
  Lock,
  Play,
  Loader2,
  Terminal,
  Brain,
  PanelRightOpen,
  PanelRightClose,
  Eye,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

/* ── Lesson Data (mock) ───────────────────────────── */
const courseData = {
  title: "Python Fundamentals",
  topics: [
    {
      id: "t1",
      title: "Data Structures",
      expanded: true,
      lessons: [
        { id: "l1", title: "Lists & Tuples", status: "completed" },
        { id: "l2", title: "Dictionaries", status: "completed" },
        { id: "l3", title: "Sets", status: "completed" },
        { id: "l4", title: "Hash Maps", status: "current" },
        { id: "l5", title: "Linked Lists", status: "locked" },
        { id: "l6", title: "Stacks & Queues", status: "locked" },
      ],
    },
    {
      id: "t2",
      title: "Algorithms",
      expanded: false,
      lessons: [
        { id: "l7", title: "Sorting Algorithms", status: "locked" },
        { id: "l8", title: "Binary Search", status: "locked" },
        { id: "l9", title: "Recursion", status: "locked" },
      ],
    },
    {
      id: "t3",
      title: "Advanced Topics",
      expanded: false,
      lessons: [
        { id: "l10", title: "Decorators", status: "locked" },
        { id: "l11", title: "Generators", status: "locked" },
        { id: "l12", title: "Async/Await", status: "locked" },
      ],
    },
  ],
};

const currentLesson = {
  title: "Hash Maps & Dictionaries",
  content: `
## Hash Maps & Dictionaries

A **hash map** (or **dictionary** in Python) is a data structure that stores key-value pairs. It provides **O(1)** average time complexity for insertions, deletions, and lookups.

### How It Works

1. A **hash function** converts the key into an index
2. The value is stored at that index in an underlying array
3. **Collisions** happen when two keys hash to the same index
4. Collision resolution: **chaining** (linked lists) or **open addressing**

### Key Operations

| Operation | Average | Worst |
|-----------|---------|-------|
| Insert    | O(1)    | O(n)  |
| Delete    | O(1)    | O(n)  |
| Lookup    | O(1)    | O(n)  |

### Your Task

Implement a simple hash map class with \`put\`, \`get\`, and \`remove\` methods.
  `,
  starterCode: `class SimpleHashMap:
    def __init__(self, capacity=16):
        self.capacity = capacity
        self.buckets = [[] for _ in range(capacity)]
        self.size = 0
    
    def _hash(self, key):
        """Convert key to bucket index."""
        return hash(key) % self.capacity
    
    def put(self, key, value):
        """Insert or update a key-value pair."""
        index = self._hash(key)
        bucket = self.buckets[index]
        
        # Update if key exists
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        
        # Insert new
        bucket.append((key, value))
        self.size += 1
    
    def get(self, key, default=None):
        """Retrieve value by key."""
        index = self._hash(key)
        for k, v in self.buckets[index]:
            if k == key:
                return v
        return default
    
    def remove(self, key):
        """Remove a key-value pair."""
        index = self._hash(key)
        bucket = self.buckets[index]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                del bucket[i]
                self.size -= 1
                return True
        return False

# Test your implementation
hm = SimpleHashMap()
hm.put("name", "Alice")
hm.put("age", 25)
hm.put("city", "San Francisco")

print(f"Name: {hm.get('name')}")
print(f"Age: {hm.get('age')}")
print(f"Size: {hm.size}")

hm.remove("age")
print(f"Age after removal: {hm.get('age', 'Not found')}")
print(f"Size after removal: {hm.size}")
`,
};

/* ── Visualization Data ───────────────────────────── */
const visualizationSteps = [
  {
    step: 1,
    label: 'put("name", "Alice")',
    variables: [
      { name: "key", value: '"name"', type: "str", color: "text-green-400" },
      { name: "hash", value: "7", type: "int", color: "text-brand-blue" },
      { name: "index", value: "7", type: "int", color: "text-brand-purple" },
    ],
    buckets: Array(8).fill(null).map((_, i) => (i === 7 ? [["name", "Alice"]] : [])),
  },
  {
    step: 2,
    label: 'put("age", 25)',
    variables: [
      { name: "key", value: '"age"', type: "str", color: "text-green-400" },
      { name: "hash", value: "3", type: "int", color: "text-brand-blue" },
      { name: "index", value: "3", type: "int", color: "text-brand-purple" },
    ],
    buckets: Array(8).fill(null).map((_, i) =>
      i === 7 ? [["name", "Alice"]] : i === 3 ? [["age", "25"]] : []
    ),
  },
  {
    step: 3,
    label: 'get("name")',
    variables: [
      { name: "key", value: '"name"', type: "str", color: "text-green-400" },
      { name: "hash", value: "7", type: "int", color: "text-brand-blue" },
      { name: "result", value: '"Alice"', type: "str", color: "text-yellow-400" },
    ],
    buckets: Array(8).fill(null).map((_, i) =>
      i === 7 ? [["name", "Alice"]] : i === 3 ? [["age", "25"]] : []
    ),
  },
];

/* ══════════════════════════════════════════════════ */
export default function LearnPage() {
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({ t1: true });
  const [showAI, setShowAI] = useState(true);
  const [code, setCode] = useState(currentLesson.starterCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [visStep, setVisStep] = useState(0);
  const [showVisualization, setShowVisualization] = useState(true);

  const toggleTopic = (id: string) => {
    setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput([]);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: "python" }),
      });
      const data = await res.json();
      setOutput(data.output ? data.output.split("\n") : ["✓ Executed"]);
    } catch {
      setOutput(["Error connecting to execution service"]);
    } finally {
      setIsRunning(false);
    }
  };

  const currentVis = visualizationSteps[visStep];

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] gap-0 -m-6">
      {/* ── LEFT: Topic Navigation ────────────── */}
      <div className="w-[280px] shrink-0 border-r border-white/5 bg-surface-secondary/50 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors mb-3">
            <ArrowLeft className="w-3 h-3" /> Back to Dashboard
          </Link>
          <h2 className="text-sm font-semibold text-white">{courseData.title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Data Structures · 12 lessons</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {courseData.topics.map((topic) => (
            <div key={topic.id} className="mb-1">
              <button
                onClick={() => toggleTopic(topic.id)}
                className="flex items-center gap-2 w-full p-2 rounded-lg text-sm text-muted-foreground hover:text-white hover:bg-white/[0.03] transition-all"
              >
                {expandedTopics[topic.id] ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
                <BookOpen className="w-3.5 h-3.5" />
                <span className="font-medium">{topic.title}</span>
              </button>

              <AnimatePresence>
                {expandedTopics[topic.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {topic.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        className={`flex items-center gap-2 w-full pl-9 pr-2 py-1.5 rounded-lg text-xs transition-all ${
                          lesson.status === "current"
                            ? "bg-brand-blue/10 text-brand-blue border-l-2 border-brand-blue"
                            : lesson.status === "completed"
                            ? "text-green-400/70 hover:text-green-400"
                            : "text-muted-foreground/50 cursor-not-allowed"
                        }`}
                        disabled={lesson.status === "locked"}
                      >
                        {lesson.status === "completed" ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : lesson.status === "current" ? (
                          <Circle className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Lock className="w-3 h-3" />
                        )}
                        {lesson.title}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>

      {/* ── CENTER: Editor + Visualization ────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Lesson Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-surface-primary/50">
          <div>
            <h1 className="text-lg font-bold text-white">{currentLesson.title}</h1>
            <p className="text-xs text-muted-foreground">Python · Data Structures · Lesson 4 of 6</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVisualization(!showVisualization)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showVisualization
                  ? "bg-brand-purple/15 text-brand-purple border border-brand-purple/20"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Visualize
            </button>
            <button
              onClick={() => setShowAI(!showAI)}
              className={`p-1.5 rounded-lg transition-all ${
                showAI ? "text-brand-blue" : "text-muted-foreground hover:text-white"
              }`}
            >
              {showAI ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Visualization Panel */}
          <AnimatePresence>
            {showVisualization && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 200, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b border-white/5 bg-surface-secondary/30 overflow-hidden"
              >
                <div className="h-full p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-brand-purple" />
                      <span className="text-xs font-medium text-white">Memory Visualization</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                        Step {visStep + 1}/{visualizationSteps.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setVisStep(Math.max(0, visStep - 1))} className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setVisStep(Math.min(visualizationSteps.length - 1, visStep + 1))} className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex gap-6 overflow-hidden">
                    {/* Variables */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Variables</span>
                      {currentVis.variables.map((v, i) => (
                        <motion.div
                          key={`${visStep}-${i}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/[0.03] border border-white/5 font-mono text-xs"
                        >
                          <span className="text-muted-foreground">{v.name}:</span>
                          <span className={v.color}>{v.value}</span>
                          <span className="text-[9px] text-muted-foreground/50">{v.type}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Buckets Visualization */}
                    <div className="flex-1">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1.5">Hash Map Buckets</span>
                      <div className="flex gap-1 h-full items-end pb-2">
                        {currentVis.buckets.slice(0, 8).map((bucket, i) => (
                          <motion.div
                            key={i}
                            className={`flex-1 flex flex-col justify-end rounded-md border transition-all ${
                              bucket.length > 0
                                ? "border-brand-blue/30 bg-brand-blue/5"
                                : "border-white/5 bg-white/[0.02]"
                            }`}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            style={{ transformOrigin: "bottom" }}
                          >
                            <div className="p-1 text-center">
                              <span className="text-[9px] text-muted-foreground/50">[{i}]</span>
                              {bucket.map((entry: string[], j: number) => (
                                <motion.div
                                  key={j}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="text-[8px] px-1 py-0.5 mt-0.5 rounded bg-brand-blue/20 text-brand-blue font-mono truncate"
                                >
                                  {entry[0]}
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Current Operation */}
                    <div className="shrink-0 flex flex-col justify-center">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Operation</span>
                      <motion.div
                        key={visStep}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-blue/10 to-brand-purple/10 border border-brand-blue/20 font-mono text-xs text-brand-blue"
                      >
                        {currentVis.label}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Editor + Output */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-4 py-1.5 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="text-[10px] text-muted-foreground font-mono ml-2">hash_map.py</span>
              </div>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold btn-glow"
              >
                {isRunning ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
                <span>{isRunning ? "Running..." : "Run"}</span>
              </button>
            </div>

            {/* Editor */}
            <div className="flex-1 min-h-[200px]">
              <Editor
                height="100%"
                language="python"
                value={code}
                onChange={(val) => setCode(val || "")}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 12, bottom: 12 },
                  lineNumbers: "on",
                  glyphMargin: false,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3,
                  renderLineHighlight: "line",
                  smoothScrolling: true,
                  cursorSmoothCaretAnimation: "on",
                  bracketPairColorization: { enabled: true },
                }}
              />
            </div>

            {/* Output Console */}
            <div className="h-36 border-t border-white/5 overflow-y-auto">
              <div className="flex items-center gap-2 px-4 py-1.5 border-b border-white/5 bg-surface-secondary/30">
                <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Output</span>
              </div>
              <div className="p-3 font-mono text-xs space-y-0.5">
                {output.length === 0 ? (
                  <p className="text-muted-foreground/40">Run the code to see output...</p>
                ) : (
                  output.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={line.startsWith("Error") ? "text-red-400" : "text-green-400"}
                    >
                      {line}
                    </motion.p>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: AI Tutor Panel ─────────────── */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-l border-white/5 bg-surface-secondary/30 overflow-hidden shrink-0"
          >
            <AITutorChat />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
