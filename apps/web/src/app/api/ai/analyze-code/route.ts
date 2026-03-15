import { NextResponse } from "next/server";
import { analyzeCode } from "@/lib/ai";

export async function POST(request: Request) {
  try {
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
    return NextResponse.json(
      {
        bugs: [],
        suggestions: ["Analysis service encountered an error."],
        complexityScore: 0,
        summary: `Error: ${String(error)}`,
      },
      { status: 500 }
    );
  }
}
