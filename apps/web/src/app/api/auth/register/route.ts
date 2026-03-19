import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const RegisterSchema = z.object({
  name:            z.string().min(2).max(50),
  email:           z.string().email().toLowerCase(),
  password:        z.string().min(8).max(128)
                    .regex(/[A-Z]/, "Must contain uppercase letter")
                    .regex(/[0-9]/, "Must contain number"),
  confirmPassword: z.string(),
  role:            z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) {
      return Response.json({ error: "Invalid request body" }, { status: 400 })
    }

    // Block teacher/admin self-registration
    if (body.role && body.role !== "STUDENT") {
      return Response.json({ error: "Invalid registration" }, { status: 400 })
    }

    const parsed = RegisterSchema.safeParse(body)
    if (!parsed.success) {
      const firstError = parsed.error.flatten().fieldErrors
      const firstMessage = Object.values(firstError)[0]?.[0] || "Validation failed"
      return Response.json({ error: firstMessage }, { status: 400 })
    }

    const { name, email, password } = parsed.data
    const cleanEmail = email.trim().toLowerCase()
    const cleanName  = name.trim()

    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })
    if (existing) {
      return Response.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        name:     cleanName,
        email:    cleanEmail,
        password: hashedPassword,
        role:     "STUDENT",
        profile:  { create: { level: "BEGINNER" } },
      },
    })

    return Response.json({
      success: true,
      message: "Account created successfully! You can now sign in.",
    })
  } catch (error) {
    console.error("[register] error:", error)
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
