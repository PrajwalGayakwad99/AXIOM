// PATH: src/hooks/useAI.ts
// Custom hook wrapping all AI API calls for CodeVision AI

"use client";

import { useState, useCallback } from "react";
import type {
  AIMessage,
  AIChatResponse,
  AICodeAnalysis,
  AIQuiz,
  AIHint,
} from "@/types";

// ─────────────────────────────────────────────
// useAIChat — conversational AI tutor
// ─────────────────────────────────────────────

interface UseAIChatReturn {
  messages: AIMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  setMessages: React.Dispatch<React.SetStateAction<AIMessage[]>>;
}

export function useAIChat(initialMessages?: AIMessage[]): UseAIChatReturn {
  const [messages, setMessages] = useState<AIMessage[]>(
    initialMessages || [
      {
        role: "assistant",
        content:
          "Hey! 👋 I'm your AI tutor. I use the Socratic method — I'll guide you with questions instead of giving direct answers. What are you working on today?",
      },
    ]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: AIMessage = { role: "user", content: content.trim() };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        const data: AIChatResponse = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "AI request failed");
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.content || "I'm having trouble thinking right now. Try again?",
          },
        ]);
      } catch (err) {
        const errorMsg = (err as Error).message;
        setError(errorMsg);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Hmm, I couldn't connect to my brain right now. Make sure LiteLLM is running on localhost:4000!",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat cleared! 🔄 What would you like to explore next?",
      },
    ]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages, setMessages };
}

// ─────────────────────────────────────────────
// useCodeAnalysis — analyze code for bugs
// ─────────────────────────────────────────────

interface UseCodeAnalysisReturn {
  analysis: AICodeAnalysis | null;
  isAnalyzing: boolean;
  error: string | null;
  analyze: (code: string, language: string) => Promise<AICodeAnalysis | null>;
  clearAnalysis: () => void;
}

export function useCodeAnalysis(): UseCodeAnalysisReturn {
  const [analysis, setAnalysis] = useState<AICodeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(
    async (code: string, language: string): Promise<AICodeAnalysis | null> => {
      if (!code.trim()) return null;

      setIsAnalyzing(true);
      setError(null);

      try {
        const res = await fetch("/api/ai/analyze-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, language }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Analysis failed");
        }

        setAnalysis(data);
        return data;
      } catch (err) {
        const errorMsg = (err as Error).message;
        setError(errorMsg);
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return { analysis, isAnalyzing, error, analyze, clearAnalysis };
}

// ─────────────────────────────────────────────
// useQuizGenerator — generate quizzes from topics
// ─────────────────────────────────────────────

interface UseQuizGeneratorReturn {
  quiz: AIQuiz | null;
  isGenerating: boolean;
  error: string | null;
  generate: (topic: string, difficulty?: string) => Promise<AIQuiz | null>;
  clearQuiz: () => void;
}

export function useQuizGenerator(): UseQuizGeneratorReturn {
  const [quiz, setQuiz] = useState<AIQuiz | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (topic: string, difficulty?: string): Promise<AIQuiz | null> => {
      setIsGenerating(true);
      setError(null);

      try {
        const res = await fetch("/api/ai/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, difficulty }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Quiz generation failed");
        }

        setQuiz(data);
        return data;
      } catch (err) {
        const errorMsg = (err as Error).message;
        setError(errorMsg);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const clearQuiz = useCallback(() => {
    setQuiz(null);
    setError(null);
  }, []);

  return { quiz, isGenerating, error, generate, clearQuiz };
}

// ─────────────────────────────────────────────
// useHint — progressive hints for challenges
// ─────────────────────────────────────────────

interface UseHintReturn {
  hint: AIHint | null;
  isLoadingHint: boolean;
  error: string | null;
  getHint: (
    challengeTitle: string,
    challengeDescription: string,
    studentCode: string,
    level?: 1 | 2 | 3
  ) => Promise<AIHint | null>;
  clearHint: () => void;
}

export function useHint(): UseHintReturn {
  const [hint, setHint] = useState<AIHint | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHint = useCallback(
    async (
      challengeTitle: string,
      challengeDescription: string,
      studentCode: string,
      level: 1 | 2 | 3 = 1
    ): Promise<AIHint | null> => {
      setIsLoadingHint(true);
      setError(null);

      try {
        const res = await fetch("/api/ai/hint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            challengeTitle,
            challengeDescription,
            studentCode,
            hintLevel: level,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Hint request failed");
        }

        setHint(data);
        return data;
      } catch (err) {
        const errorMsg = (err as Error).message;
        setError(errorMsg);
        return null;
      } finally {
        setIsLoadingHint(false);
      }
    },
    []
  );

  const clearHint = useCallback(() => {
    setHint(null);
    setError(null);
  }, []);

  return { hint, isLoadingHint, error, getHint, clearHint };
}
