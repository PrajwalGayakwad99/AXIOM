import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyzeCode } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { code, language } = body;

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeCode(code, language);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("[analyze-code] error:", error);
    return NextResponse.json(
      {
        bugs: [],
        suggestions: ["Analysis service encountered an error."],
        complexityScore: 0,
        summary: "Unable to analyze code at this moment.",
      },
      { status: 500 }
    );
  }
}
