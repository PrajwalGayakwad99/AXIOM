import { NextResponse } from "next/server";
import { getHint } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { challengeTitle, challengeDescription, studentCode, hintLevel } = body;

    if (!challengeTitle || !challengeDescription) {
      return NextResponse.json(
        { error: "Challenge title and description are required" },
        { status: 400 }
      );
    }

    const hint = await getHint(
      challengeTitle,
      challengeDescription,
      studentCode || "",
      hintLevel || 1
    );
    return NextResponse.json(hint);
  } catch (error) {
    return NextResponse.json(
      {
        hint: "Hint service is currently unavailable. Try re-reading the problem statement!",
        level: 1,
        error: String(error),
      },
      { status: 500 }
    );
  }
}
