// PATH: src/lib/ai.ts
// LiteLLM utility functions for all AI features in CodeVision AI
// Proxies through LiteLLM on localhost:4000 with model fallback chain

import type {
  AIMessage,
  AIChatResponse,
  AICodeAnalysis,
  AIQuiz,
  AIHint,
} from "@/types";

const LITELLM_BASE = process.env.NEXT_PUBLIC_LITELLM_URL || "http://localhost:4000";

// Model fallback chains — tries in order until one succeeds
const MODELS = {
  chat: ["claude-3-haiku-20240307", "deepseek-chat", "gpt-3.5-turbo"],
  analysis: ["claude-3-5-sonnet-20241022", "gpt-4o", "deepseek-chat"],
  quiz: ["gpt-4o-mini", "claude-3-haiku-20240307", "deepseek-chat"],
  hint: ["claude-3-haiku-20240307", "gpt-3.5-turbo", "deepseek-chat"],
} as const;

// ─────────────────────────────────────────────
// Core request helper with model fallback
// ─────────────────────────────────────────────

interface LiteLLMRequest {
  messages: { role: string; content: string }[];
  maxTokens?: number;
  temperature?: number;
  models?: readonly string[];
}

interface LiteLLMChoice {
  message: { role: string; content: string };
}

interface LiteLLMResponse {
  choices: LiteLLMChoice[];
  model: string;
  usage?: { total_tokens: number };
}

async function callLiteLLM(config: LiteLLMRequest): Promise<{
  content: string;
  model: string;
  tokensUsed: number;
}> {
  const models = config.models || MODELS.chat;
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const res = await fetch(`${LITELLM_BASE}/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: config.messages,
          max_tokens: config.maxTokens || 500,
          temperature: config.temperature ?? 0.7,
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (!res.ok) continue;

      const data: LiteLLMResponse = await res.json();
      return {
        content: data.choices?.[0]?.message?.content || "",
        model,
        tokensUsed: data.usage?.total_tokens || 0,
      };
    } catch (err) {
      lastError = err as Error;
      continue;
    }
  }

  throw new Error(
    `All AI models failed. Last error: ${lastError?.message || "Unknown"}`
  );
}

// ─────────────────────────────────────────────
// System prompts
// ─────────────────────────────────────────────

const SYSTEM_PROMPTS = {
  tutor: `You are a patient programming tutor on the CodeVision AI platform.
Use the Socratic method — ask guiding questions instead of giving direct answers.
Be encouraging, concise, and age-appropriate.
If the student shares code, analyze it and guide them to find bugs themselves.
Keep responses under 150 words unless explaining a complex concept.`,

  codeAnalysis: `You are a senior code reviewer on the CodeVision AI platform.
Analyze the given code and return a JSON object with this exact structure:
{
  "bugs": [{ "line": <number|null>, "severity": "warning"|"error"|"info", "message": "<string>", "suggestion": "<string>" }],
  "suggestions": ["<improvement suggestion>"],
  "complexityScore": <0-100>,
  "summary": "<2-3 sentence summary>"
}
Be thorough but educational. Focus on bugs, best practices, and performance.
ONLY return valid JSON, no markdown fences or extra text.`,

  quizGenerator: `You are a quiz generator on the CodeVision AI platform.
Given a programming topic, generate a quiz in this exact JSON structure:
{
  "topic": "<topic name>",
  "questions": [
    {
      "question": "<clear question>",
      "options": ["A", "B", "C", "D"],
      "correctIndex": <0-3>,
      "explanation": "<why the answer is correct>"
    }
  ]
}
Generate 5 questions of varying difficulty. Make distractors plausible.
ONLY return valid JSON, no markdown fences or extra text.`,

  hintGenerator: `You are a hint provider on the CodeVision AI platform.
Given a coding challenge and the student's current code, provide a hint.
Return a JSON object with this exact structure:
{
  "hint": "<the hint text>",
  "level": <1|2|3>
}
Level 1: A vague nudge in the right direction.
Level 2: A more specific suggestion mentioning concepts or approaches.
Level 3: A near-direct hint that practically spells out the approach.
Respond with the requested hint level only. ONLY return valid JSON.`,
};

// ─────────────────────────────────────────────
// Public API functions
// ─────────────────────────────────────────────

/**
 * Stream-style chat with the AI tutor.
 * (Currently non-streaming — returns full response. Streaming can be added later.)
 */
export async function streamChat(
  messages: AIMessage[],
  context?: string
): Promise<AIChatResponse> {
  try {
    const systemMessage = {
      role: "system" as const,
      content: context
        ? `${SYSTEM_PROMPTS.tutor}\n\nContext: ${context}`
        : SYSTEM_PROMPTS.tutor,
    };

    const formattedMessages = [
      systemMessage,
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const result = await callLiteLLM({
      messages: formattedMessages,
      models: MODELS.chat,
      maxTokens: 500,
      temperature: 0.7,
    });

    return {
      content: result.content,
      model: result.model,
      tokensUsed: result.tokensUsed,
    };
  } catch (err) {
    return {
      content:
        "I'm currently unable to connect to my AI backend. Please make sure LiteLLM is running on localhost:4000. In the meantime, try breaking your problem into smaller steps!",
      error: (err as Error).message,
    };
  }
}

/**
 * Analyze code for bugs, suggestions, and complexity.
 */
export async function analyzeCode(
  code: string,
  language: string
): Promise<AICodeAnalysis> {
  try {
    const result = await callLiteLLM({
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.codeAnalysis },
        {
          role: "user",
          content: `Language: ${language}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
      models: MODELS.analysis,
      maxTokens: 1500,
      temperature: 0.3,
    });

    return JSON.parse(result.content);
  } catch (err) {
    return {
      bugs: [],
      suggestions: ["Unable to analyze code at this time."],
      complexityScore: 0,
      summary: `Analysis failed: ${(err as Error).message}`,
    };
  }
}

/**
 * Generate a multi-choice quiz from a topic.
 */
export async function generateQuiz(
  topic: string,
  difficulty?: string
): Promise<AIQuiz> {
  try {
    const result = await callLiteLLM({
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.quizGenerator },
        {
          role: "user",
          content: `Generate a quiz on: ${topic}${
            difficulty ? ` (difficulty: ${difficulty})` : ""
          }`,
        },
      ],
      models: MODELS.quiz,
      maxTokens: 2000,
      temperature: 0.6,
    });

    return JSON.parse(result.content);
  } catch (err) {
    return {
      topic,
      questions: [
        {
          question: "Quiz generation is currently unavailable.",
          options: ["Try again later"],
          correctIndex: 0,
          explanation: (err as Error).message,
        },
      ],
    };
  }
}

/**
 * Get a progressive hint for a coding challenge.
 * @param hintLevel 1=vague, 2=medium, 3=specific
 */
export async function getHint(
  challengeTitle: string,
  challengeDescription: string,
  studentCode: string,
  hintLevel: 1 | 2 | 3 = 1
): Promise<AIHint> {
  try {
    const result = await callLiteLLM({
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.hintGenerator },
        {
          role: "user",
          content: `Challenge: ${challengeTitle}\nDescription: ${challengeDescription}\n\nStudent's current code:\n\`\`\`\n${studentCode}\n\`\`\`\n\nProvide a level ${hintLevel} hint.`,
        },
      ],
      models: MODELS.hint,
      maxTokens: 300,
      temperature: 0.5,
    });

    return JSON.parse(result.content);
  } catch (err) {
    return {
      hint: "Hint system is currently unavailable. Try re-reading the problem statement and thinking about edge cases!",
      level: hintLevel,
    };
  }
}
