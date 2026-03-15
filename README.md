<<<<<<< HEAD
# CodeVision AI 🚀

A premium AI-powered visual programming learning platform.

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Database**: PostgreSQL + Prisma ORM
- **AI**: LiteLLM (claude, deepseek, gpt)
- **Auth**: NextAuth.js (Google, GitHub, Credentials)
- **Monorepo**: Turborepo

## Project Structure
- `apps/web`: Next.js 14 Web application
- `packages/database`: Shared Prisma schema and client
- `packages/ui`: Shared UI components (if applicable)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Docker (optional, for LiteLLM/Redis)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `apps/web/.env.example` to `apps/web/.env`
   - Update the values in `.env`
4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

## Development
This project uses Turborepo for monorepo management. 
- Run `npm run build` from root to build all projects.
- Run `npm run dev` from root to start all apps in parallel.

## Features
- **Visual Learning**: Interactive code execution visualization.
- **AI Tutor**: Real-time coding assistance and explanation.
- **Gamification**: XP points, levels, and leaderboards.
- **Multi-Role Integration**: Separate dashboards for Students, Teachers, and Admins.

## License
MIT
=======
# AXIOM
We aim to revolutionize EdTech by turning passive learning into interactive, AI-driven education. Our platform visualizes code execution, guides students with an AI tutor, enables real coding practice, and builds portfolios that connect learning directly with real career opportunities.
>>>>>>> 8d893b2682240ee4a0078903d36d456e43d029df
