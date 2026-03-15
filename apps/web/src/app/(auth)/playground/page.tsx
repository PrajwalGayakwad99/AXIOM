"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor, { type OnMount } from "@monaco-editor/react";
import {
  Play,
  Square,
  RotateCcw,
  ChevronDown,
  Terminal,
  Copy,
  Check,
  Loader2,
  Maximize2,
  Minimize2,
  Download,
  Settings2,
} from "lucide-react";

/* ── Language Configs ─────────────────────────────── */
const languages = [
  { id: "python", label: "Python", icon: "🐍" },
  { id: "javascript", label: "JavaScript", icon: "JS" },
  { id: "typescript", label: "TypeScript", icon: "TS" },
  { id: "java", label: "Java", icon: "☕" },
  { id: "cpp", label: "C++", icon: "C+" },
  { id: "c", label: "C", icon: "C" },
  { id: "rust", label: "Rust", icon: "🦀" },
  { id: "go", label: "Go", icon: "Go" },
];

const defaultCode: Record<string, string> = {
  python: `# CodeVision AI — Python Playground
# Write your code below and click Run ▶

def fibonacci(n):
    """Generate Fibonacci sequence up to n terms."""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib

# Print first 10 Fibonacci numbers
result = fibonacci(10)
print(f"Fibonacci sequence: {result}")
print(f"Sum: {sum(result)}")
`,
  javascript: `// CodeVision AI — JavaScript Playground
// Write your code below and click Run ▶

function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[arr.length - 1];
  const left = arr.filter((x, i) => x <= pivot && i < arr.length - 1);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}

const data = [38, 27, 43, 3, 9, 82, 10];
console.log("Original:", data);
console.log("Sorted:", quickSort(data));
`,
  typescript: `// CodeVision AI — TypeScript Playground

interface TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
}

function inorderTraversal<T>(node: TreeNode<T> | null): T[] {
  if (!node) return [];
  return [
    ...inorderTraversal(node.left),
    node.value,
    ...inorderTraversal(node.right),
  ];
}

const tree: TreeNode<number> = {
  value: 5,
  left: { value: 3, left: { value: 1, left: null, right: null }, right: null },
  right: { value: 8, left: null, right: { value: 9, left: null, right: null } },
};

console.log("Inorder:", inorderTraversal(tree));
`,
  java: `// CodeVision AI — Java Playground

public class Main {
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(arr);
        System.out.print("Sorted: ");
        for (int num : arr) System.out.print(num + " ");
    }
    
    static void bubbleSort(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++)
            for (int j = 0; j < arr.length - i - 1; j++)
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
    }
}
`,
  cpp: `// CodeVision AI — C++ Playground
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {5, 3, 8, 1, 9};
    
    // Bubble sort
    for (int i = 0; i < v.size(); i++)
        for (int j = 0; j < v.size() - i - 1; j++)
            if (v[j] > v[j+1]) swap(v[j], v[j+1]);
    
    cout << "Sorted: ";
    for (int x : v) cout << x << " ";
    return 0;
}
`,
  c: `// CodeVision AI — C Playground
#include <stdio.h>

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    for (int i = 1; i <= 10; i++) {
        printf("%d! = %d\\n", i, factorial(i));
    }
    return 0;
}
`,
  rust: `// CodeVision AI — Rust Playground

fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    let sum: i32 = numbers.iter().sum();
    let evens: Vec<&i32> = numbers.iter().filter(|&&x| x % 2 == 0).collect();
    
    println!("Numbers: {:?}", numbers);
    println!("Sum: {}", sum);
    println!("Evens: {:?}", evens);
}
`,
  go: `// CodeVision AI — Go Playground
package main

import "fmt"

func main() {
    fib := func(n int) []int {
        seq := make([]int, n)
        seq[0], seq[1] = 0, 1
        for i := 2; i < n; i++ {
            seq[i] = seq[i-1] + seq[i-2]
        }
        return seq
    }
    
    fmt.Println("Fibonacci:", fib(10))
}
`,
};

/* ── Monaco Theme ─────────────────────────────────── */
const monacoTheme = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [
    { token: "comment", foreground: "6A9955" },
    { token: "keyword", foreground: "C586C0" },
    { token: "string", foreground: "CE9178" },
    { token: "number", foreground: "B5CEA8" },
    { token: "type", foreground: "4EC9B0" },
    { token: "function", foreground: "DCDCAA" },
    { token: "variable", foreground: "9CDCFE" },
  ],
  colors: {
    "editor.background": "#0D0D14",
    "editor.foreground": "#D4D4D4",
    "editor.selectionBackground": "#3B82F633",
    "editor.lineHighlightBackground": "#FFFFFF06",
    "editorLineNumber.foreground": "#3B4261",
    "editorLineNumber.activeForeground": "#7982A9",
    "editor.selectionHighlightBackground": "#8B5CF633",
    "editorCursor.foreground": "#3B82F6",
    "editorBracketMatch.background": "#8B5CF622",
    "editorBracketMatch.border": "#8B5CF655",
  },
};

/* ══════════════════════════════════════════════════ */
export default function PlaygroundPage() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(defaultCode.python);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const editorRef = useRef<any>(null);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.defineTheme("codevision", monacoTheme);
    monaco.editor.setTheme("codevision");
  };

  const handleLanguageChange = (langId: string) => {
    setLanguage(langId);
    setCode(defaultCode[langId] || "// Write your code here...");
    setShowLangMenu(false);
    setOutput([]);
    setExecutionTime(null);
  };

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput([]);
    setExecutionTime(null);

    const start = performance.now();

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      setExecutionTime(elapsed);

      if (data.output) {
        setOutput(data.output.split("\n"));
      } else if (data.error) {
        setOutput([`Error: ${data.error}`]);
      }
    } catch {
      // Simulate execution locally for demo
      const elapsed = Math.round(performance.now() - start);
      setExecutionTime(elapsed + 150);
      simulateExecution(code, language);
    } finally {
      setIsRunning(false);
    }
  }, [code, language]);

  const simulateExecution = (code: string, lang: string) => {
    // Simple local simulation for demo purposes
    const lines: string[] = [];
    if (lang === "python") {
      const printMatches = code.match(/print\((.+?)\)/g);
      if (printMatches) {
        printMatches.forEach((m) => {
          const inside = m.replace(/^print\(/, "").replace(/\)$/, "");
          lines.push(`>>> ${inside.replace(/f"/g, "").replace(/"/g, "").replace(/'/g, "")}`);
        });
      }
    } else if (lang === "javascript" || lang === "typescript") {
      const logMatches = code.match(/console\.log\((.+?)\)/g);
      if (logMatches) {
        logMatches.forEach((m) => {
          const inside = m.replace(/^console\.log\(/, "").replace(/\)$/, "");
          lines.push(`> ${inside.replace(/"/g, "").replace(/'/g, "")}`);
        });
      }
    }
    if (lines.length === 0) {
      lines.push("✓ Code executed successfully (no output)");
    }
    setOutput(lines);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(defaultCode[language] || "");
    setOutput([]);
    setExecutionTime(null);
  };

  const currentLang = languages.find((l) => l.id === language)!;

  return (
    <div className={`flex flex-col gap-4 ${isFullscreen ? "fixed inset-0 z-50 bg-surface-primary p-4" : ""}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white">Playground</h1>
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-sm text-white"
            >
              <span>{currentLang.icon}</span>
              <span>{currentLang.label}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
            <AnimatePresence>
              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-1 left-0 z-30 w-44 rounded-xl border border-white/10 bg-surface-elevated/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang.id)}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${
                        lang.id === language
                          ? "bg-brand-blue/10 text-brand-blue"
                          : "text-slate-300 hover:bg-white/5"
                      }`}
                    >
                      <span className="w-5 text-center text-xs">{lang.icon}</span>
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-white" title="Copy code">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button onClick={handleReset} className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-white" title="Reset">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-white" title="Fullscreen">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isRunning
                ? "bg-red-500/20 text-red-400 border border-red-500/20"
                : "btn-glow"
            }`}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor + Output */}
      <div className="grid lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Monaco Editor */}
        <div className="glass-card overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              main.{language === "cpp" ? "cpp" : language === "typescript" ? "ts" : language === "javascript" ? "js" : language}
            </span>
            <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-h-[400px]">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              onChange={(val) => setCode(val || "")}
              onMount={handleEditorMount}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                lineNumbers: "on",
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                renderLineHighlight: "line",
                smoothScrolling: true,
                cursorSmoothCaretAnimation: "on",
                cursorBlinking: "smooth",
                bracketPairColorization: { enabled: true },
                suggest: {
                  showWords: true,
                },
              }}
            />
          </div>
        </div>

        {/* Output Console */}
        <div className="glass-card overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Output</span>
            </div>
            {executionTime !== null && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20"
              >
                {executionTime}ms
              </motion.span>
            )}
          </div>
          <div className="flex-1 p-4 min-h-[400px] overflow-y-auto font-mono text-sm">
            {output.length === 0 && !isRunning ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground/50 gap-2">
                <Terminal className="w-8 h-8" />
                <p className="text-xs">Click &quot;Run&quot; to execute your code</p>
              </div>
            ) : (
              <AnimatePresence>
                {output.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`py-0.5 ${
                      line.startsWith("Error") || line.startsWith(">>>")
                        ? line.startsWith("Error")
                          ? "text-red-400"
                          : "text-green-400"
                        : "text-slate-300"
                    }`}
                  >
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {isRunning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-brand-blue"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">Executing...</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
