import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateQuiz } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    console.error("[generate-quiz] error:", error);
    return NextResponse.json(
      {
        topic: "Unknown",
        questions: [],
      },
      { status: 500 }
    );
  }
}
