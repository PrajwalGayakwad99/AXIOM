import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messages } = body;

    // System prompt for the AI Tutor
    const systemPrompt = {
      role: "system",
      content: `You are a patient programming tutor on the CodeVision AI platform. 
Use the Socratic method — ask guiding questions instead of giving direct answers. 
Be encouraging, concise, and age-appropriate. 
If the student shares code, analyze it and guide them to find bugs themselves.
Keep responses under 150 words unless explaining a complex concept.`,
    };

    // Attempt to call LiteLLM with fallback chain: claude → deepseek → gpt
    const models = ["claude-3-haiku-20240307", "deepseek-chat", "gpt-3.5-turbo"];
    let lastError: Error | null = null;

    for (const model of models) {
      try {
        const response = await fetch("http://localhost:4000/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [systemPrompt, ...messages],
            max_tokens: 500,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            content: data.choices?.[0]?.message?.content || "I couldn't generate a response.",
            model,
          });
        }
      } catch (err) {
        lastError = err as Error;
        continue; // Try next model in fallback chain
      }
    }

    // All models failed — return helpful fallback
    console.error("[chat] all models failed:", lastError);
    return NextResponse.json(
      {
        content:
          "I'm currently unable to connect to my AI backend. Please make sure LiteLLM is running on localhost:4000. In the meantime, try breaking your problem into smaller steps!",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("[chat] error:", error);
    return NextResponse.json(
      { content: "Something went wrong processing your request." },
      { status: 500 }
    );
  }
}
