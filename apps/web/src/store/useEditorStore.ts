// PATH: src/store/useEditorStore.ts
// Zustand store for the code editor — code, language, output, and execution state

"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SupportedLanguage, EditorConfig } from "@/types";
import { DEFAULT_EDITOR_CONFIG } from "@/types";

// ─────────────────────────────────────────────
// Language starter templates
// ─────────────────────────────────────────────

const STARTER_CODE: Record<SupportedLanguage, string> = {
  python: `# Welcome to CodeVision AI Playground ✨
# Write your Python code here

def greet(name):
    return f"Hello, {name}! Welcome to CodeVision AI."

print(greet("Student"))
`,
  javascript: `// Welcome to CodeVision AI Playground ✨
// Write your JavaScript code here

function greet(name) {
  return \`Hello, \${name}! Welcome to CodeVision AI.\`;
}

console.log(greet("Student"));
`,
  typescript: `// Welcome to CodeVision AI Playground ✨
// Write your TypeScript code here

function greet(name: string): string {
  return \`Hello, \${name}! Welcome to CodeVision AI.\`;
}

console.log(greet("Student"));
`,
  java: `// Welcome to CodeVision AI Playground ✨

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Student! Welcome to CodeVision AI.");
    }
}
`,
  cpp: `// Welcome to CodeVision AI Playground ✨

#include <iostream>
using namespace std;

int main() {
    cout << "Hello, Student! Welcome to CodeVision AI." << endl;
    return 0;
}
`,
  c: `/* Welcome to CodeVision AI Playground ✨ */

#include <stdio.h>

int main() {
    printf("Hello, Student! Welcome to CodeVision AI.\\n");
    return 0;
}
`,
  go: `// Welcome to CodeVision AI Playground ✨
package main

import "fmt"

func main() {
    fmt.Println("Hello, Student! Welcome to CodeVision AI.")
}
`,
  rust: `// Welcome to CodeVision AI Playground ✨

fn main() {
    println!("Hello, Student! Welcome to CodeVision AI.");
}
`,
};

// ─────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────

interface EditorState {
  // ── Code ──
  code: string;
  language: SupportedLanguage;

  // ── Execution ──
  output: string;
  isRunning: boolean;
  executionTime: number | null;
  executionStatus: "idle" | "success" | "error" | "simulated";

  // ── Editor config ──
  config: EditorConfig;

  // ── File tabs ──
  tabs: { id: string; name: string; language: SupportedLanguage; code: string }[];
  activeTabId: string | null;

  // ── History ──
  history: { code: string; timestamp: number }[];
}

interface EditorActions {
  // ── Code ──
  setCode: (code: string) => void;
  setLanguage: (language: SupportedLanguage) => void;
  resetCode: () => void;

  // ── Execution ──
  setOutput: (output: string) => void;
  setIsRunning: (running: boolean) => void;
  setExecutionResult: (result: {
    output: string;
    executionTime?: number;
    status?: "success" | "error" | "simulated";
  }) => void;
  clearOutput: () => void;

  // ── Config ──
  updateConfig: (partial: Partial<EditorConfig>) => void;
  toggleVimMode: () => void;
  toggleMinimap: () => void;

  // ── Tabs ──
  addTab: (tab: { name: string; language: SupportedLanguage; code: string }) => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;

  // ── History ──
  saveToHistory: () => void;
}

const initialEditorState: EditorState = {
  code: STARTER_CODE.python,
  language: "python",
  output: "",
  isRunning: false,
  executionTime: null,
  executionStatus: "idle",
  config: DEFAULT_EDITOR_CONFIG,
  tabs: [],
  activeTabId: null,
  history: [],
};

export const useEditorStore = create<EditorState & EditorActions>()(
  persist(
    (set, get) => ({
      ...initialEditorState,

      // ── Code ──────────────────────────────────

      setCode: (code) => set({ code }),

      setLanguage: (language) => {
        const currentCode = get().code;
        const currentLang = get().language;

        // If code is the default for the current language, switch to new default
        const isDefault = currentCode.trim() === STARTER_CODE[currentLang]?.trim();

        set({
          language,
          code: isDefault ? (STARTER_CODE[language] || "") : currentCode,
          config: { ...get().config, language },
        });
      },

      resetCode: () => {
        const lang = get().language;
        set({
          code: STARTER_CODE[lang] || "",
          output: "",
          executionTime: null,
          executionStatus: "idle",
        });
      },

      // ── Execution ─────────────────────────────

      setOutput: (output) => set({ output }),

      setIsRunning: (isRunning) => set({ isRunning }),

      setExecutionResult: (result) =>
        set({
          output: result.output,
          executionTime: result.executionTime ?? null,
          executionStatus: result.status ?? "success",
          isRunning: false,
        }),

      clearOutput: () =>
        set({ output: "", executionTime: null, executionStatus: "idle" }),

      // ── Config ────────────────────────────────

      updateConfig: (partial) =>
        set((state) => ({
          config: { ...state.config, ...partial },
        })),

      toggleVimMode: () =>
        set((state) => ({
          config: { ...state.config, vimMode: !state.config.vimMode },
        })),

      toggleMinimap: () =>
        set((state) => ({
          config: { ...state.config, minimap: !state.config.minimap },
        })),

      // ── Tabs ──────────────────────────────────

      addTab: (tab) => {
        const id = `tab-${Date.now()}`;
        set((state) => ({
          tabs: [...state.tabs, { ...tab, id }],
          activeTabId: id,
          code: tab.code,
          language: tab.language,
        }));
      },

      removeTab: (id) =>
        set((state) => {
          const filtered = state.tabs.filter((t) => t.id !== id);
          const wasActive = state.activeTabId === id;
          return {
            tabs: filtered,
            activeTabId: wasActive
              ? filtered[filtered.length - 1]?.id ?? null
              : state.activeTabId,
          };
        }),

      setActiveTab: (id) => {
        const tab = get().tabs.find((t) => t.id === id);
        if (tab) {
          set({
            activeTabId: id,
            code: tab.code,
            language: tab.language,
          });
        }
      },

      // ── History ───────────────────────────────

      saveToHistory: () =>
        set((state) => ({
          history: [
            { code: state.code, timestamp: Date.now() },
            ...state.history,
          ].slice(0, 50), // Keep last 50 entries
        })),
    }),
    {
      name: "codevision-editor-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({
        code: state.code,
        language: state.language,
        config: state.config,
      }),
    }
  )
);

// ── Export starter code map for external use
export { STARTER_CODE };
