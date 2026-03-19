import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getHint } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    console.error("[hint] error:", error);
    return NextResponse.json(
      {
        hint: "Hint service is currently unavailable. Try re-reading the problem statement!",
        level: 1,
      },
      { status: 500 }
    );
  }
}
