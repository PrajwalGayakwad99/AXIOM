// PATH: src/hooks/useCodeExecution.ts
// Custom hook for the code execution API with output streaming and history

"use client";

import { useState, useCallback, useRef } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import type { SupportedLanguage, CodeExecutionResponse } from "@/types";

interface ExecutionHistoryEntry {
  id: string;
  code: string;
  language: SupportedLanguage;
  output: string;
  executionTime: number | null;
  status: "success" | "error" | "simulated";
  timestamp: number;
}

interface UseCodeExecutionReturn {
  /** Current execution output */
  output: string;
  /** Whether code is currently executing */
  isRunning: boolean;
  /** Execution time in ms (if available) */
  executionTime: number | null;
  /** Execution status */
  status: "idle" | "success" | "error" | "simulated";
  /** Error message if execution failed */
  error: string | null;
  /** Execution history for this session */
  history: ExecutionHistoryEntry[];
  /** Execute code with the given language */
  execute: (code?: string, language?: SupportedLanguage) => Promise<CodeExecutionResponse | null>;
  /** Stop current execution (if supported) */
  abort: () => void;
  /** Clear output and reset state */
  clearOutput: () => void;
  /** Clear execution history */
  clearHistory: () => void;
}

export function useCodeExecution(): UseCodeExecutionReturn {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error" | "simulated">("idle");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ExecutionHistoryEntry[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Pull from editor store as defaults
  const editorCode = useEditorStore((s) => s.code);
  const editorLanguage = useEditorStore((s) => s.language);
  const setExecutionResult = useEditorStore((s) => s.setExecutionResult);
  const saveToHistory = useEditorStore((s) => s.saveToHistory);

  const execute = useCallback(
    async (
      code?: string,
      language?: SupportedLanguage
    ): Promise<CodeExecutionResponse | null> => {
      const codeToRun = code ?? editorCode;
      const lang = language ?? editorLanguage;

      if (!codeToRun.trim()) {
        setError("No code to execute");
        return null;
      }

      // Abort any in-flight execution
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsRunning(true);
      setError(null);
      setOutput("");
      setStatus("idle");
      setExecutionTime(null);

      const startTime = performance.now();

      try {
        const res = await fetch("/api/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeToRun, language: lang }),
          signal: controller.signal,
        });

        const data = await res.json();
        const elapsed = Math.round(performance.now() - startTime);

        if (!res.ok) {
          const errMsg = data.error || "Execution failed";
          setError(errMsg);
          setOutput(`Error: ${errMsg}`);
          setStatus("error");
          setExecutionTime(elapsed);

          // Sync with editor store
          setExecutionResult({
            output: `Error: ${errMsg}`,
            executionTime: elapsed,
            status: "error",
          });

          return null;
        }

        const execStatus = data.status === "simulated" ? "simulated" as const : "success" as const;
        const execTime = data.executionTime || elapsed;

        setOutput(data.output || "✓ Code executed successfully (no output)");
        setStatus(execStatus);
        setExecutionTime(execTime);

        // Sync with editor store
        setExecutionResult({
          output: data.output || "✓ Code executed successfully (no output)",
          executionTime: execTime,
          status: execStatus,
        });

        // Save to hook-level history
        const historyEntry: ExecutionHistoryEntry = {
          id: `exec-${Date.now()}`,
          code: codeToRun,
          language: lang,
          output: data.output || "",
          executionTime: execTime,
          status: execStatus,
          timestamp: Date.now(),
        };
        setHistory((prev) => [historyEntry, ...prev].slice(0, 25));

        // Save to editor store history
        saveToHistory();

        return data;
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          setOutput("⏹ Execution aborted");
          setStatus("error");
          return null;
        }

        const errMsg = (err as Error).message || "Execution failed";
        setError(errMsg);
        setOutput(`Error: ${errMsg}`);
        setStatus("error");

        setExecutionResult({
          output: `Error: ${errMsg}`,
          status: "error",
        });

        return null;
      } finally {
        setIsRunning(false);
        abortControllerRef.current = null;
      }
    },
    [editorCode, editorLanguage, setExecutionResult, saveToHistory]
  );

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const clearOutput = useCallback(() => {
    setOutput("");
    setError(null);
    setStatus("idle");
    setExecutionTime(null);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    output,
    isRunning,
    executionTime,
    status,
    error,
    history,
    execute,
    abort,
    clearOutput,
    clearHistory,
  };
}
