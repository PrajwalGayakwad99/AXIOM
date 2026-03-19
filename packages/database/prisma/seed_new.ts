import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  const adminPassword = await bcrypt.hash("Admin@AXIOM2024", 12)
  await prisma.user.upsert({
    where: { email: "admin@axiom.dev" },
    update: {},
    create: {
      name: "AXIOM Admin",
      email: "admin@axiom.dev",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
      onboardingComplete: true,
      profile: { create: { level: "ADVANCED" } },
    },
  })
  console.log("Admin created: admin@axiom.dev / Admin@AXIOM2024")

  const teacherPassword = await bcrypt.hash("Teacher@AXIOM2024", 12)
  await prisma.user.upsert({
    where: { email: "teacher@axiom.dev" },
    update: {},
    create: {
      name: "AXIOM Teacher",
      email: "teacher@axiom.dev",
      password: teacherPassword,
      role: "TEACHER",
      emailVerified: new Date(),
      onboardingComplete: true,
      profile: { create: { level: "ADVANCED" } },
    },
  })
  console.log("Teacher created: teacher@axiom.dev / Teacher@AXIOM2024")

  const achievements = [
    { name: "First Code Run",   description: "Executed code for first time",          icon: "rocket",   condition: "first_code_run",  xpReward: 10  },
    { name: "10-Day Streak",    description: "Studied for 10 consecutive days",            icon: "fire",     condition: "streak_10",        xpReward: 50  },
    { name: "Recursion Master", description: "Solved all recursion challenges",            icon: "infinity", condition: "recursion_all",    xpReward: 100 },
    { name: "Speed Solver",     description: "Solved a Medium challenge under 10 minutes", icon: "bolt",     condition: "speed_medium",     xpReward: 75  },
    { name: "Helpful Hero",     description: "Received 10 upvotes on forum replies",       icon: "heart",    condition: "forum_upvotes_10", xpReward: 50  },
    { name: "Perfect Score",    description: "Got 100% on 5 consecutive quizzes",          icon: "star",     condition: "quiz_perfect_5",   xpReward: 60  },
    { name: "Contest Champion", description: "Won a timed coding contest",                 icon: "trophy",   condition: "contest_win",      xpReward: 200 },
    { name: "Polyglot",         description: "Solved same challenge in 3 languages",       icon: "globe",    condition: "polyglot",         xpReward: 80  },
    { name: "Night Owl",        description: "Studied between 11pm and 3am for 7 days",   icon: "moon",     condition: "night_owl",        xpReward: 40  },
    { name: "Algorithm Ace",    description: "Completed all sorting visualizations",       icon: "chart",    condition: "algo_sort_all",    xpReward: 90  },
  ]

  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { name: a.name },
      update: {},
      create: a,
    })
  }
  console.log("Achievements seeded:", achievements.length)
  console.log("Database seeded successfully!")
}

main()
  .catch((e) => { console.error("Seed error:", e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
