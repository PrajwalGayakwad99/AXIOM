"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Loader2,
  Terminal,
  Eye,
  Brain,
  PanelRightClose,
  PanelRightOpen,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Zap,
  Clock,
} from "lucide-react";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { AITutorChat } from "@/components/ai/ai-tutor-chat";

// ─────────────────────────────────────────────
// Mock data per topic
// ─────────────────────────────────────────────

const topicLessons: Record<
  string,
  {
    title: string;
    topic: string;
    content: string;
    starterCode: string;
    language: string;
    xp: number;
    duration: string;
    objectives: string[];
    visualization: {
      steps: {
        label: string;
        description: string;
        variables: { name: string; value: string; color: string }[];
        highlight: number[];
      }[];
    };
  }
> = {
  "linked-lists": {
    title: "Singly Linked Lists",
    topic: "Data Structures",
    xp: 25,
    duration: "20 min",
    objectives: [
      "Understand node structure and pointers",
      "Implement insert, delete, and search operations",
      "Analyze time complexity of each operation",
    ],
    content: `## Singly Linked Lists

A **linked list** is a linear data structure where elements are stored in nodes. Each node contains:
- The **data** (value)
- A **pointer** (reference) to the next node

Unlike arrays, linked lists don't require contiguous memory, making insertions and deletions efficient.

### Key Operations

| Operation   | Time Complexity |
|-------------|----------------|
| Access      | O(n)           |
| Search      | O(n)           |
| Insert Head | O(1)           |
| Insert Tail | O(n)           |
| Delete      | O(n)           |

### Your Task

Implement a singly linked list with \`insert_head\`, \`insert_tail\`, \`delete\`, and \`display\` methods.`,
    starterCode: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def insert_head(self, data):
        """Insert a node at the head of the list."""
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
    
    def insert_tail(self, data):
        """Insert a node at the tail of the list."""
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node
    
    def delete(self, data):
        """Delete first occurrence of data."""
        if not self.head:
            return False
        if self.head.data == data:
            self.head = self.head.next
            return True
        current = self.head
        while current.next:
            if current.next.data == data:
                current.next = current.next.next
                return True
            current = current.next
        return False
    
    def display(self):
        """Display the linked list."""
        elements = []
        current = self.head
        while current:
            elements.append(str(current.data))
            current = current.next
        return " -> ".join(elements) + " -> None"

# Test your implementation
ll = LinkedList()
ll.insert_head(3)
ll.insert_head(2)
ll.insert_head(1)
ll.insert_tail(4)
ll.insert_tail(5)

print("List:", ll.display())
print("Delete 3:", ll.delete(3))
print("After deletion:", ll.display())
`,
    language: "python",
    visualization: {
      steps: [
        {
          label: "insert_head(3)",
          description: "Create node with data=3, set as head",
          variables: [
            { name: "head", value: "Node(3)", color: "text-brand-blue" },
            { name: "size", value: "1", color: "text-emerald-400" },
          ],
          highlight: [0],
        },
        {
          label: "insert_head(2)",
          description: "Create node(2) -> point to old head(3)",
          variables: [
            { name: "head", value: "Node(2)", color: "text-brand-blue" },
            { name: "next", value: "Node(3)", color: "text-brand-purple" },
            { name: "size", value: "2", color: "text-emerald-400" },
          ],
          highlight: [0, 1],
        },
        {
          label: "insert_head(1)",
          description: "Create node(1) -> point to old head(2)",
          variables: [
            { name: "head", value: "Node(1)", color: "text-brand-blue" },
            { name: "chain", value: "1 → 2 → 3", color: "text-amber-400" },
            { name: "size", value: "3", color: "text-emerald-400" },
          ],
          highlight: [0, 1, 2],
        },
        {
          label: "insert_tail(4)",
          description: "Traverse to end, append node(4) after node(3)",
          variables: [
            { name: "tail", value: "Node(4)", color: "text-brand-purple" },
            { name: "chain", value: "1 → 2 → 3 → 4", color: "text-amber-400" },
            { name: "size", value: "4", color: "text-emerald-400" },
          ],
          highlight: [3],
        },
      ],
    },
  },
  // Default fallback for any other topic
  default: {
    title: "Introduction to Data Structures",
    topic: "Fundamentals",
    xp: 15,
    duration: "15 min",
    objectives: [
      "Understand what data structures are",
      "Learn about time and space complexity",
      "Explore basic data structure types",
    ],
    content: `## Introduction to Data Structures

A **data structure** is a way of organizing and storing data that enables efficient access and modification.

### Why Data Structures Matter

Choosing the right data structure can make the difference between a program that runs in **milliseconds** vs one that takes **hours**.

### Common Data Structures

- **Arrays** – Contiguous memory, O(1) access
- **Linked Lists** – Dynamic size, O(1) insert at head
- **Stacks** – LIFO principle
- **Queues** – FIFO principle
- **Trees** – Hierarchical data
- **Graphs** – Complex relationships

### Your Task

Explore the starter code and try running it!`,
    starterCode: `# Welcome to CodeVision AI!
# Let's explore basic data structures in Python

# --- Arrays (Lists) ---
my_list = [10, 20, 30, 40, 50]
print("Array:", my_list)
print("Access index 2:", my_list[2])

# --- Stack (using list) ---
stack = []
stack.append("first")
stack.append("second")
stack.append("third")
print("\\nStack:", stack)
print("Pop:", stack.pop())
print("After pop:", stack)

# --- Queue (using collections.deque) ---
from collections import deque
queue = deque()
queue.append("task1")
queue.append("task2")
queue.append("task3")
print("\\nQueue:", list(queue))
print("Dequeue:", queue.popleft())
print("After dequeue:", list(queue))
`,
    language: "python",
    visualization: {
      steps: [
        {
          label: "Array[2] = 30",
          description: "Direct access by index — O(1)",
          variables: [
            { name: "index", value: "2", color: "text-brand-blue" },
            { name: "value", value: "30", color: "text-emerald-400" },
          ],
          highlight: [2],
        },
        {
          label: "stack.push('third')",
          description: "Push to top of stack — LIFO",
          variables: [
            { name: "top", value: '"third"', color: "text-brand-purple" },
            { name: "size", value: "3", color: "text-emerald-400" },
          ],
          highlight: [2],
        },
      ],
    },
  },
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function LessonPage({
  params,
}: {
  params: { topicId: string };
}) {
  const { topicId } = params;
  const [lesson, setLesson] = useState<any>(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    fetch(`/api/learn/${topicId}`)
      .then((r) => r.json())
      .then(setLesson)
      .catch(() => setLesson(null));
  }, [topicId]);

  useEffect(() => {
    if (lesson?.starterCode) {
      setCode(lesson.starterCode);
    }
  }, [lesson]);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showVis, setShowVis] = useState(true);
  const [visStep, setVisStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!lesson) return <div className="p-8">Loading...</div>;

  const currentVis = lesson.visualization.steps[visStep];

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput([]);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: lesson.language }),
      });
      const data = await res.json();
      setOutput(data.output ? data.output.split("\n") : ["✓ Executed"]);
    } catch {
      setOutput(["Error connecting to execution service"]);
    } finally {
      setIsRunning(false);
    }
  }, [code, lesson.language]);

  const handleComplete = () => {
    setIsCompleted(true);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] gap-0 -m-6">
      {/* ── LEFT: Lesson Content ────────────────── */}
      <div className="w-[380px] shrink-0 border-r border-white/5 bg-surface-secondary/30 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <Link
            href="/learn"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Learning Path
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md text-[9px] bg-brand-purple/10 text-brand-purple border border-brand-purple/20 font-semibold uppercase">
              {lesson.topic}
            </span>
          </div>
          <h1 className="text-lg font-bold text-white">{lesson.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-[10px] text-amber-400">
              <Zap className="w-3 h-3" />
              {lesson.xp} XP
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              {lesson.duration}
            </span>
          </div>
        </div>

        {/* Objectives */}
        <div className="p-4 border-b border-white/5">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Learning Objectives
          </h3>
          <ul className="space-y-1.5">
            {lesson.objectives.map((obj: string, i: number) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/50 shrink-0 mt-0.5" />
                {obj}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Lesson content (markdown-like) */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="prose prose-invert prose-sm max-w-none">
            {lesson.content.split("\n").map((line: string, i: number) => {
              if (line.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="text-base font-bold text-white mt-4 mb-2"
                  >
                    {line.replace("## ", "")}
                  </h2>
                );
              }
              if (line.startsWith("### ")) {
                return (
                  <h3
                    key={i}
                    className="text-sm font-semibold text-white mt-3 mb-1"
                  >
                    {line.replace("### ", "")}
                  </h3>
                );
              }
              if (line.startsWith("- ")) {
                return (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground ml-4 list-disc"
                  >
                    {line.replace("- ", "")}
                  </li>
                );
              }
              if (line.startsWith("| ")) {
                return (
                  <p
                    key={i}
                    className="text-[10px] text-muted-foreground font-mono"
                  >
                    {line}
                  </p>
                );
              }
              if (line.trim() === "") return <div key={i} className="h-2" />;
              return (
                <p
                  key={i}
                  className="text-xs text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: line
                      .replace(
                        /\*\*(.+?)\*\*/g,
                        '<strong class="text-white">$1</strong>'
                      )
                      .replace(
                        /`(.+?)`/g,
                        '<code class="px-1 py-0.5 rounded bg-white/5 text-brand-blue text-[10px]">$1</code>'
                      ),
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Complete button */}
        <div className="p-4 border-t border-white/5">
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-semibold">Completed! +{lesson.xp} XP</span>
            </motion.div>
          ) : (
            <button
              onClick={handleComplete}
              className="btn-glow w-full py-3 text-sm"
            >
              <span className="flex items-center justify-center gap-2">
                Mark as Complete
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ── CENTER: Editor + Visualization ────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-surface-primary/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVis(!showVis)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showVis
                  ? "bg-brand-purple/15 text-brand-purple border border-brand-purple/20"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Visualize
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold btn-glow"
            >
              {isRunning ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              <span>{isRunning ? "Running..." : "Run"}</span>
            </button>
            <button
              onClick={() => setShowAI(!showAI)}
              className={`p-1.5 rounded-lg transition-all ${
                showAI
                  ? "text-brand-blue bg-brand-blue/10"
                  : "text-muted-foreground hover:text-white"
              }`}
              title="Toggle AI Tutor"
            >
              {showAI ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRightOpen className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Visualization Panel */}
        <AnimatePresence>
          {showVis && currentVis && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 160, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-b border-white/5 bg-surface-secondary/30 overflow-hidden"
            >
              <div className="h-full p-4 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-brand-purple" />
                    <span className="text-xs font-medium text-white">
                      Step Visualization
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                      Step {visStep + 1}/{lesson.visualization.steps.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setVisStep(Math.max(0, visStep - 1))}
                      disabled={visStep === 0}
                      className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-white transition-colors disabled:opacity-30"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setVisStep(
                          Math.min(
                            lesson.visualization.steps.length - 1,
                            visStep + 1
                          )
                        )
                      }
                      disabled={
                        visStep === lesson.visualization.steps.length - 1
                      }
                      className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-white transition-colors disabled:opacity-30"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex gap-6">
                  {/* Current operation */}
                  <div className="space-y-2">
                    <motion.div
                      key={visStep}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-blue/10 to-brand-purple/10 border border-brand-blue/20 font-mono text-xs text-brand-blue"
                    >
                      {currentVis.label}
                    </motion.div>
                    <p className="text-[10px] text-muted-foreground max-w-[200px]">
                      {currentVis.description}
                    </p>
                  </div>

                  {/* Variables */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Variables
                    </span>
                    {currentVis.variables.map((v: any, i: number) => (
                      <motion.div
                        key={`${visStep}-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/[0.03] border border-white/5 font-mono text-xs"
                      >
                        <span className="text-muted-foreground">
                          {v.name}:
                        </span>
                        <span className={v.color}>{v.value}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Node chain visualization */}
                  <div className="flex-1 flex items-center justify-center gap-2">
                    {currentVis.highlight.map((nodeIdx: number, i: number) => (
                      <motion.div
                        key={`${visStep}-node-${i}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                        className="flex items-center gap-1"
                      >
                        <div className="w-10 h-10 rounded-lg border-2 border-brand-blue/50 bg-brand-blue/10 flex items-center justify-center text-xs font-mono text-brand-blue font-bold">
                          {nodeIdx}
                        </div>
                        {i < currentVis.highlight.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-muted-foreground/30" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Code Editor */}
        <div className="flex-1 min-h-[200px]">
          <MonacoEditor
            value={code}
            onChange={setCode}
            language="python"
            showToolbar={false}
            showHeader={true}
            showLanguageSelector={false}
            fileName={`${topicId || "lesson"}.py`}
            height="100%"
          />
        </div>

        {/* Output Console */}
        <div className="h-36 border-t border-white/5 overflow-y-auto">
          <div className="flex items-center gap-2 px-4 py-1.5 border-b border-white/5 bg-surface-secondary/30">
            <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Output
            </span>
          </div>
          <div className="p-3 font-mono text-xs space-y-0.5">
            {output.length === 0 ? (
              <p className="text-muted-foreground/40">
                Click &quot;Run&quot; to execute your code...
              </p>
            ) : (
              output.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={
                    line.startsWith("Error")
                      ? "text-red-400"
                      : "text-green-400"
                  }
                >
                  {line}
                </motion.p>
              ))
            )}
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
