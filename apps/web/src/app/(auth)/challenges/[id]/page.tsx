"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Loader2,
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Send,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Eye,
  EyeOff,
  Trophy,
} from "lucide-react";
import { MonacoEditor } from "@/components/editor/MonacoEditor";

// ─────────────────────────────────────────────
// Mock challenge data
// ─────────────────────────────────────────────

const challengeData: Record<
  string,
  {
    title: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    xpReward: number;
    description: string;
    examples: { input: string; output: string; explanation?: string }[];
    constraints: string[];
    starterCode: Record<string, string>;
    hints: string[];
    testCases: { input: string; expected: string }[];
  }
> = {
  c1: {
    title: "Two Sum",
    difficulty: "EASY",
    xpReward: 15,
    description:
      "Given an array of integers `nums` and an integer `target`, return **indices** of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists.",
    ],
    starterCode: {
      python: `def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Your code here
    pass

# Test
print(two_sum([2, 7, 11, 15], 9))
`,
      javascript: `function twoSum(nums, target) {
    // Your code here
}

// Test
console.log(twoSum([2, 7, 11, 15], 9));
`,
    },
    hints: [
      "Think about what value you need to find for each element to reach the target.",
      "Can you use a hash map to store values you've already seen?",
      "For each number, check if (target - number) exists in the hash map.",
    ],
    testCases: [
      { input: "[2,7,11,15], 9", expected: "[0,1]" },
      { input: "[3,2,4], 6", expected: "[1,2]" },
      { input: "[3,3], 6", expected: "[0,1]" },
      { input: "[1,5,8,3], 4", expected: "[0,3]" },
    ],
  },
  default: {
    title: "Coding Challenge",
    difficulty: "MEDIUM",
    xpReward: 30,
    description:
      "Solve this coding challenge by implementing the required function.\n\nRead the examples carefully and make sure your solution handles all edge cases.",
    examples: [
      {
        input: "Example input",
        output: "Example output",
        explanation: "Example explanation",
      },
    ],
    constraints: ["Standard constraints apply"],
    starterCode: {
      python: `# Your solution here\ndef solve():\n    pass\n`,
      javascript: `// Your solution here\nfunction solve() {\n}\n`,
    },
    hints: ["Think about the problem step by step."],
    testCases: [{ input: "test", expected: "result" }],
  },
};

// ─────────────────────────────────────────────
// Difficulty badge
// ─────────────────────────────────────────────

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const config = {
    EASY: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    MEDIUM: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
    HARD: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
  }[difficulty] || { bg: "bg-white/5", text: "text-white", border: "border-white/10" };

  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}>
      {difficulty}
    </span>
  );
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function ChallengeSolverPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const challenge = challengeData[id] || challengeData["default"];

  const [language, setLanguage] = useState<"python" | "javascript">("python");
  const [code, setCode] = useState(challenge.starterCode.python);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [testResults, setTestResults] = useState<
    { passed: boolean; input: string; expected: string; actual: string }[] | null
  >(null);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleLanguageChange = (lang: "python" | "javascript") => {
    setLanguage(lang);
    setCode(challenge.starterCode[lang] || "");
    setOutput([]);
    setTestResults(null);
  };

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput([]);
    setTestResults(null);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      setOutput(data.output ? data.output.split("\n") : ["✓ Executed"]);
    } catch {
      setOutput(["Error connecting to execution service"]);
    } finally {
      setIsRunning(false);
    }
  }, [code, language]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setTestResults(null);

    // Simulate test case execution
    await new Promise((r) => setTimeout(r, 2000));

    // Mock results — first 3 pass, last one fails (for demo)
    const results = challenge.testCases.map((tc, i) => ({
      passed: i < 3,
      input: tc.input,
      expected: tc.expected,
      actual: i < 3 ? tc.expected : "[-1,-1]",
    }));

    setTestResults(results);
    const allPassed = results.every((r) => r.passed);
    setIsAccepted(allPassed);
    setIsSubmitting(false);
  }, [challenge.testCases]);

  const handleReset = () => {
    setCode(challenge.starterCode[language] || "");
    setOutput([]);
    setTestResults(null);
    setIsAccepted(false);
  };

  const revealHint = (index: number) => {
    if (!revealedHints.includes(index)) {
      setRevealedHints((prev) => [...prev, index]);
    }
  };

  const passedCount = testResults?.filter((r) => r.passed).length ?? 0;

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] gap-0 -m-6">
      {/* ── LEFT: Problem Description ────────── */}
      <div className="w-[420px] shrink-0 border-r border-white/5 bg-surface-secondary/30 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <Link
            href="/challenges"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Challenges
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <DifficultyBadge difficulty={challenge.difficulty} />
            <span className="flex items-center gap-1 text-[10px] text-amber-400">
              <Zap className="w-3 h-3" />
              {challenge.xpReward} XP
            </span>
          </div>
          <h1 className="text-lg font-bold text-white">{challenge.title}</h1>
        </div>

        {/* Description */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Problem text */}
          <div>
            {challenge.description.split("\n").map((line, i) => {
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

          {/* Examples */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Examples
            </h3>
            {challenge.examples.map((ex, i) => (
              <div
                key={i}
                className="rounded-lg bg-white/[0.02] border border-white/5 p-3 space-y-1.5"
              >
                <p className="text-[10px] text-muted-foreground">
                  <span className="text-white font-medium">Input:</span>{" "}
                  <code className="text-brand-blue">{ex.input}</code>
                </p>
                <p className="text-[10px] text-muted-foreground">
                  <span className="text-white font-medium">Output:</span>{" "}
                  <code className="text-emerald-400">{ex.output}</code>
                </p>
                {ex.explanation && (
                  <p className="text-[10px] text-muted-foreground/70">
                    <span className="text-muted-foreground font-medium">
                      Explanation:
                    </span>{" "}
                    {ex.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
              Constraints
            </h3>
            <ul className="space-y-1">
              {challenge.constraints.map((c, i) => (
                <li
                  key={i}
                  className="text-[10px] text-muted-foreground flex items-start gap-1.5"
                >
                  <span className="text-brand-blue mt-0.5">•</span>
                  <code className="text-muted-foreground">{c}</code>
                </li>
              ))}
            </ul>
          </div>

          {/* Hints */}
          <div>
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showHints ? "Hide" : "Show"} Hints ({challenge.hints.length})
            </button>
            <AnimatePresence>
              {showHints && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden mt-2 space-y-2"
                >
                  {challenge.hints.map((hint, i) => (
                    <div key={i}>
                      {revealedHints.includes(i) ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[10px] text-amber-300/80 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10"
                        >
                          💡 {hint}
                        </motion.div>
                      ) : (
                        <button
                          onClick={() => revealHint(i)}
                          className="flex items-center gap-2 text-[10px] text-muted-foreground hover:text-amber-400 transition-colors p-2 rounded-lg bg-white/[0.02] border border-white/5 w-full"
                        >
                          <Eye className="w-3 h-3" />
                          Reveal Hint {i + 1}
                        </button>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Editor + Results ────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-surface-primary/50">
          <div className="flex items-center gap-2">
            {/* Language selector */}
            {(["python", "javascript"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  language === lang
                    ? "bg-brand-blue/20 text-brand-blue border border-brand-blue/20"
                    : "bg-white/[0.03] text-muted-foreground hover:text-white border border-white/5"
                }`}
              >
                {lang === "python" ? "🐍 Python" : "JS JavaScript"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
              title="Reset code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/5 text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {isRunning ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              Run
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-glow px-4 py-1.5 text-xs"
            >
              <span className="flex items-center gap-1.5">
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                {isSubmitting ? "Judging..." : "Submit"}
              </span>
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 min-h-[200px]">
          <MonacoEditor
            value={code}
            onChange={setCode}
            language={language}
            showToolbar={false}
            showHeader={true}
            showLanguageSelector={false}
            fileName={`solution.${language === "python" ? "py" : "js"}`}
            height="100%"
          />
        </div>

        {/* Output + Test Results */}
        <div className="h-48 border-t border-white/5 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-0 border-b border-white/5">
            <div className="flex items-center gap-2 px-4 py-2 border-b-2 border-brand-blue text-brand-blue">
              <Terminal className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {testResults ? "Test Results" : "Output"}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {/* Test results */}
            {testResults ? (
              <div className="space-y-2">
                {/* Summary */}
                <div
                  className={`flex items-center gap-2 p-2 rounded-lg border ${
                    isAccepted
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : "bg-rose-500/10 border-rose-500/20"
                  }`}
                >
                  {isAccepted ? (
                    <>
                      <Trophy className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-sm font-bold text-emerald-400">
                          Accepted! +{challenge.xpReward} XP
                        </p>
                        <p className="text-[10px] text-emerald-400/60">
                          All test cases passed
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <div>
                        <p className="text-sm font-bold text-rose-400">
                          Wrong Answer
                        </p>
                        <p className="text-[10px] text-rose-400/60">
                          {passedCount}/{testResults.length} test cases passed
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Individual test cases */}
                {testResults.map((result, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`p-2 rounded-lg border text-xs font-mono ${
                      result.passed
                        ? "bg-emerald-500/5 border-emerald-500/10"
                        : "bg-rose-500/5 border-rose-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {result.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span
                        className={`text-[10px] font-semibold ${
                          result.passed ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        Test Case {i + 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div>
                        <span className="text-muted-foreground">Input: </span>
                        <span className="text-white">{result.input}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Expected:{" "}
                        </span>
                        <span className="text-emerald-400">
                          {result.expected}
                        </span>
                      </div>
                      {!result.passed && (
                        <div>
                          <span className="text-muted-foreground">
                            Actual:{" "}
                          </span>
                          <span className="text-rose-400">{result.actual}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Regular output */
              <div className="font-mono text-xs space-y-0.5">
                {output.length === 0 ? (
                  <p className="text-muted-foreground/40">
                    Click &quot;Run&quot; to test your code, or
                    &quot;Submit&quot; to check against all test cases
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
