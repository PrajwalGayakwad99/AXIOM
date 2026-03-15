// PATH: src/components/editor/MonacoEditor.tsx
"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Editor, { type OnMount, type Monaco } from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings2,
  Keyboard,
  Type,
  Eye,
  EyeOff,
  Columns,
  Hash,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import type { SupportedLanguage, EditorConfig } from "@/types";

// ─────────────────────────────────────────────
// Custom CodeVision Monaco Theme
// ─────────────────────────────────────────────

const CODEVISION_THEME = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [
    { token: "comment", foreground: "6A9955", fontStyle: "italic" },
    { token: "keyword", foreground: "C586C0" },
    { token: "string", foreground: "CE9178" },
    { token: "number", foreground: "B5CEA8" },
    { token: "type", foreground: "4EC9B0" },
    { token: "function", foreground: "DCDCAA" },
    { token: "variable", foreground: "9CDCFE" },
    { token: "operator", foreground: "D4D4D4" },
    { token: "delimiter", foreground: "808080" },
    { token: "regexp", foreground: "D16969" },
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
    "editorIndentGuide.background": "#FFFFFF08",
    "editorIndentGuide.activeBackground": "#FFFFFF15",
    "editorWidget.background": "#13131D",
    "editorSuggestWidget.background": "#13131D",
    "editorSuggestWidget.border": "#FFFFFF10",
    "editorSuggestWidget.selectedBackground": "#3B82F620",
  },
};

// ─────────────────────────────────────────────
// Language display map
// ─────────────────────────────────────────────

const LANGUAGE_MAP: Record<SupportedLanguage, { label: string; icon: string; monacoId: string }> = {
  python: { label: "Python", icon: "🐍", monacoId: "python" },
  javascript: { label: "JavaScript", icon: "JS", monacoId: "javascript" },
  typescript: { label: "TypeScript", icon: "TS", monacoId: "typescript" },
  java: { label: "Java", icon: "☕", monacoId: "java" },
  cpp: { label: "C++", icon: "C+", monacoId: "cpp" },
  c: { label: "C", icon: "C", monacoId: "c" },
  go: { label: "Go", icon: "Go", monacoId: "go" },
  rust: { label: "Rust", icon: "🦀", monacoId: "rust" },
};

// ─────────────────────────────────────────────
// File extension helper
// ─────────────────────────────────────────────

function getFileExtension(lang: SupportedLanguage): string {
  const map: Record<SupportedLanguage, string> = {
    python: "py",
    javascript: "js",
    typescript: "ts",
    java: "java",
    cpp: "cpp",
    c: "c",
    go: "go",
    rust: "rs",
  };
  return map[lang] || lang;
}

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface MonacoEditorProps {
  /** Code value — if provided, component is controlled */
  value?: string;
  /** Called when code changes */
  onChange?: (value: string) => void;
  /** Language override — if not provided, uses editor store */
  language?: SupportedLanguage;
  /** Called when language changes */
  onLanguageChange?: (lang: SupportedLanguage) => void;
  /** Height of the editor */
  height?: string | number;
  /** Show the settings toolbar */
  showToolbar?: boolean;
  /** Show language selector in toolbar */
  showLanguageSelector?: boolean;
  /** Show file name header with traffic lights */
  showHeader?: boolean;
  /** File name override */
  fileName?: string;
  /** Read-only mode */
  readOnly?: boolean;
  /** Custom editor options */
  options?: Record<string, unknown>;
  /** Custom class name */
  className?: string;
  /** Called when editor is mounted */
  onEditorMount?: (editor: any, monaco: Monaco) => void;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function MonacoEditor({
  value,
  onChange,
  language: externalLanguage,
  onLanguageChange,
  height = "100%",
  showToolbar = true,
  showLanguageSelector = true,
  showHeader = true,
  fileName,
  readOnly = false,
  options: customOptions,
  className = "",
  onEditorMount,
}: MonacoEditorProps) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);

  // Store values (used as defaults)
  const storeCode = useEditorStore((s) => s.code);
  const storeLanguage = useEditorStore((s) => s.language);
  const storeConfig = useEditorStore((s) => s.config);
  const setStoreCode = useEditorStore((s) => s.setCode);
  const setStoreLanguage = useEditorStore((s) => s.setLanguage);
  const updateConfig = useEditorStore((s) => s.updateConfig);

  // Determine controlled vs uncontrolled
  const code = value ?? storeCode;
  const language = externalLanguage ?? storeLanguage;
  const config = storeConfig;

  // Local state
  const [showSettings, setShowSettings] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // ── Editor mount ──
  const handleMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      // Register custom theme
      monaco.editor.defineTheme("codevision", CODEVISION_THEME);
      monaco.editor.setTheme("codevision");

      // Focus editor
      editor.focus();

      onEditorMount?.(editor, monaco);
    },
    [onEditorMount]
  );

  // ── Code change ──
  const handleChange = useCallback(
    (val: string | undefined) => {
      const newVal = val || "";
      if (onChange) {
        onChange(newVal);
      } else {
        setStoreCode(newVal);
      }
    },
    [onChange, setStoreCode]
  );

  // ── Language change ──
  const handleLanguageChange = useCallback(
    (lang: SupportedLanguage) => {
      setShowLangMenu(false);
      if (onLanguageChange) {
        onLanguageChange(lang);
      } else {
        setStoreLanguage(lang);
      }
    },
    [onLanguageChange, setStoreLanguage]
  );

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Cmd/Ctrl + S => prevent default
    editor.addCommand(
      monacoRef.current?.KeyMod.CtrlCmd | monacoRef.current?.KeyCode.KeyS,
      () => {
        // Could trigger save action here
      }
    );
  }, []);

  // ── Build Monaco options ──
  const monacoOptions = {
    fontSize: config.fontSize,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontLigatures: true,
    minimap: { enabled: config.minimap },
    scrollBeyondLastLine: false,
    padding: { top: 16, bottom: 16 },
    lineNumbers: config.lineNumbers as "on" | "off" | "relative",
    glyphMargin: false,
    folding: true,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
    renderLineHighlight: "line" as const,
    smoothScrolling: true,
    cursorSmoothCaretAnimation: "on" as const,
    cursorBlinking: "smooth" as const,
    bracketPairColorization: { enabled: true },
    wordWrap: config.wordWrap as "on" | "off",
    readOnly,
    suggest: { showWords: true },
    ...customOptions,
  };

  const langInfo = LANGUAGE_MAP[language];
  const displayFileName =
    fileName || `main.${getFileExtension(language)}`;

  return (
    <div className={`flex flex-col overflow-hidden ${className}`}>
      {/* ── Header with traffic lights ── */}
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {displayFileName}
          </span>
          <div className="flex items-center gap-1">
            {showToolbar && (
              <button
                onClick={() => setShowSettings((v) => !v)}
                className="p-1 rounded hover:bg-white/5 transition-colors text-muted-foreground hover:text-white"
                title="Editor settings"
              >
                <Settings2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Language bar + settings ── */}
      {showToolbar && (
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-2">
            {/* Language selector */}
            {showLanguageSelector && (
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu((v) => !v)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-xs text-muted-foreground hover:text-white"
                >
                  <span>{langInfo.icon}</span>
                  <span>{langInfo.label}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                <AnimatePresence>
                  {showLangMenu && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setShowLangMenu(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.96 }}
                        transition={{ duration: 0.12 }}
                        className="absolute top-full mt-1 left-0 z-30 w-40 rounded-xl border border-white/10 bg-[#13131D]/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                      >
                        {(Object.keys(LANGUAGE_MAP) as SupportedLanguage[]).map(
                          (lang) => {
                            const info = LANGUAGE_MAP[lang];
                            return (
                              <button
                                key={lang}
                                onClick={() => handleLanguageChange(lang)}
                                className={`flex items-center gap-2 w-full px-3 py-1.5 text-xs transition-colors ${
                                  lang === language
                                    ? "bg-brand-blue/10 text-brand-blue"
                                    : "text-slate-300 hover:bg-white/5"
                                }`}
                              >
                                <span className="w-4 text-center">
                                  {info.icon}
                                </span>
                                {info.label}
                              </button>
                            );
                          }
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Quick toggles */}
          <div className="flex items-center gap-1">
            {/* Vim mode toggle */}
            <button
              onClick={() => updateConfig({ vimMode: !config.vimMode })}
              className={`p-1 rounded text-xs transition-colors ${
                config.vimMode
                  ? "bg-brand-blue/10 text-brand-blue"
                  : "text-muted-foreground/50 hover:text-muted-foreground"
              }`}
              title={`Vim mode: ${config.vimMode ? "ON" : "OFF"}`}
            >
              <Keyboard className="w-3.5 h-3.5" />
            </button>

            {/* Minimap toggle */}
            <button
              onClick={() => updateConfig({ minimap: !config.minimap })}
              className={`p-1 rounded text-xs transition-colors ${
                config.minimap
                  ? "bg-brand-blue/10 text-brand-blue"
                  : "text-muted-foreground/50 hover:text-muted-foreground"
              }`}
              title={`Minimap: ${config.minimap ? "ON" : "OFF"}`}
            >
              <Columns className="w-3.5 h-3.5" />
            </button>

            {/* Line numbers toggle */}
            <button
              onClick={() =>
                updateConfig({
                  lineNumbers:
                    config.lineNumbers === "on"
                      ? "relative"
                      : config.lineNumbers === "relative"
                        ? "off"
                        : "on",
                })
              }
              className={`p-1 rounded text-xs transition-colors ${
                config.lineNumbers !== "off"
                  ? "bg-brand-blue/10 text-brand-blue"
                  : "text-muted-foreground/50 hover:text-muted-foreground"
              }`}
              title={`Line numbers: ${config.lineNumbers}`}
            >
              <Hash className="w-3.5 h-3.5" />
            </button>

            {/* Word wrap toggle */}
            <button
              onClick={() =>
                updateConfig({
                  wordWrap: config.wordWrap === "on" ? "off" : "on",
                })
              }
              className={`p-1 rounded text-xs transition-colors ${
                config.wordWrap === "on"
                  ? "bg-brand-blue/10 text-brand-blue"
                  : "text-muted-foreground/50 hover:text-muted-foreground"
              }`}
              title={`Word wrap: ${config.wordWrap}`}
            >
              <Type className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Settings panel (collapsible) ── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-white/5"
          >
            <div className="px-4 py-3 bg-white/[0.01] space-y-3">
              {/* Font size */}
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Font Size
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateConfig({
                        fontSize: Math.max(10, config.fontSize - 1),
                      })
                    }
                    className="w-6 h-6 rounded bg-white/5 text-xs text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="text-xs text-white w-6 text-center font-mono">
                    {config.fontSize}
                  </span>
                  <button
                    onClick={() =>
                      updateConfig({
                        fontSize: Math.min(24, config.fontSize + 1),
                      })
                    }
                    className="w-6 h-6 rounded bg-white/5 text-xs text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Tab size */}
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Tab Size
                </label>
                <div className="flex items-center gap-1">
                  {[2, 4, 8].map((size) => (
                    <button
                      key={size}
                      onClick={() => updateConfig({ tabSize: size })}
                      className={`px-2 py-0.5 rounded text-xs transition-colors ${
                        config.tabSize === size
                          ? "bg-brand-blue/20 text-brand-blue"
                          : "bg-white/5 text-muted-foreground hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Monaco Editor ── */}
      <div className="flex-1" style={{ minHeight: typeof height === "number" ? `${height}px` : height }}>
        <Editor
          height="100%"
          language={langInfo.monacoId}
          value={code}
          onChange={handleChange}
          onMount={handleMount}
          theme="vs-dark"
          options={monacoOptions}
          loading={
            <div className="flex items-center justify-center h-full bg-[#0D0D14]">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading editor...</span>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
