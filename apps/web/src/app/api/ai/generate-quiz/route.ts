import { NextResponse } from "next/server";
import { generateQuiz } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, difficulty } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const quiz = await generateQuiz(topic, difficulty);
    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json(
      {
        topic: "Unknown",
        questions: [],
        error: String(error),
      },
      { status: 500 }
    );
  }
}
