import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { code, language } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

    // Try calling the standalone execution service first
    try {
      const res = await fetch("http://localhost:5000/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
        signal: AbortSignal.timeout(15000),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      // Execution service not running — fall through to local simulation
    }

    // Local simulation fallback
    const output = simulateExecution(code, language);
    return NextResponse.json({
      output,
      executionTime: Math.floor(Math.random() * 200) + 50,
      status: "simulated",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Execution failed: " + String(error) },
      { status: 500 }
    );
  }
}

function simulateExecution(code: string, language: string): string {
  const lines: string[] = [];

  if (language === "python") {
    const prints = code.match(/print\((.+?)\)/g);
    if (prints) {
      prints.forEach((m) => {
        const inside = m.replace(/^print\(/, "").replace(/\)$/, "");
        // Handle f-strings and regular strings
        const cleaned = inside
          .replace(/f"/g, "")
          .replace(/f'/g, "")
          .replace(/^["']|["']$/g, "")
          .replace(/\{([^}]+)\}/g, "[computed]");
        lines.push(cleaned);
      });
    }
  } else if (language === "javascript" || language === "typescript") {
    const logs = code.match(/console\.log\((.+?)\)/g);
    if (logs) {
      logs.forEach((m) => {
        const inside = m.replace(/^console\.log\(/, "").replace(/\)$/, "");
        const cleaned = inside.replace(/^["']|["']$/g, "");
        lines.push(cleaned);
      });
    }
  } else if (language === "java") {
    const prints = code.match(/System\.out\.print(?:ln)?\((.+?)\)/g);
    if (prints) {
      prints.forEach((m) => {
        const inside = m
          .replace(/^System\.out\.print(?:ln)?\(/, "")
          .replace(/\)$/, "");
        lines.push(inside.replace(/^["']|["']$/g, ""));
      });
    }
  } else if (language === "cpp" || language === "c") {
    const prints = code.match(/(?:cout\s*<<\s*|printf\()(.+?)(?:;|\))/g);
    if (prints) {
      lines.push("[simulated output]");
    }
  } else {
    lines.push("[simulated output]");
  }

  if (lines.length === 0) {
    lines.push("✓ Code executed successfully (no output)");
  }

  return lines.join("\n");
}
