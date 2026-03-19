import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { sanitizeInput } from "@/lib/sanitize"

const RegisterSchema = z.object({
  name:     z.string().min(2).max(50),
  email:    z.string().email().toLowerCase(),
  password: z.string().min(8).max(128)
             .regex(/[A-Z]/, "Must contain uppercase letter")
             .regex(/[0-9]/, "Must contain number"),
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
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data
    const cleanName  = sanitizeInput(name)
    const cleanEmail = sanitizeInput(email)

    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } })
    if (existing) {
      return Response.json({ error: "Email already registered" }, { status: 409 })
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

    return Response.json({ success: true, message: "Account created successfully" })
  } catch (error) {
    console.error("[register] error:", error)
    return Response.json({ error: "Something went wrong" }, { status: 500 })
  }
}
