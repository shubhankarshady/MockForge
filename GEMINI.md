# GEMINI.md - Project Context: Interview MockForge

## Project Overview
**Interview MockForge** is an AI-powered mock interview platform designed to help job seekers prepare for interviews. It leverages Google's Gemini AI to generate context-aware interview questions based on job positions, descriptions, and experience levels. The application provides a realistic interview experience by recording user responses via speech-to-text and offering immediate, AI-driven feedback and ratings.

## Tech Stack
- **Framework:** [Next.js 16+](https://nextjs.org/) (App Router, React 19)
- **AI Engine:** [Google Generative AI (Gemini)](https://ai.google.dev/) (`gemini-1.5-flash`)
- **Database:** [Neon](https://neon.tech/) (Serverless PostgreSQL)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/)
- **Utilities:** Speech-to-text (`react-hook-speech-to-text`), Webcam (`react-webcam`), `lucide-react`, `sonner`, `motion`.

## Core Workflows
1. **Interview Generation:** Users input job details (position, description, experience); the app calls `lib/ai/service.js` which uses Gemini to generate 5 tailored questions.
2. **Mock Interview:** Users answer questions using voice. The `RecordAnsSection` component handles speech-to-text conversion.
3. **Evaluation:** Each answer is sent to `lib/ai/service.js` via server actions/API, where Gemini evaluates it against the "ideal" answer and provides a rating (1-10) and feedback.
4. **Dashboard:** Users can view their previous interviews and detailed feedback in the dashboard.

## Building and Running
- **Development:** `npm run dev`
- **Build:** `npm run build`
- **Start:** `npm run start`
- **Database Management:**
  - Push schema changes: `npm run db:push`
  - Open DB GUI: `npm run db:studio`

## Key Directories & Files
- `app/api/`: API routes for Clerk and other backend logic.
- `app/dashboard/`: Main application logic, including interview lists and the interview UI.
- `lib/actions/`: Next.js Server Actions for database and AI operations.
- `lib/ai/`: Gemini integration, including prompts (`prompts.js`) and service logic (`service.js`).
- `lib/db/`: Drizzle configuration and schema definitions (`schema/`).
- `components/ui/`: Reusable Radix-based UI components.
- `components/shared/`: Shared layout components like `Header`, `Navbar`, and `AddNewInterview`.

## Development Conventions
- **AI Responses:** AI-related logic returns strictly structured JSON (enforced via system prompts in Gemini calls).
- **Client Components:** Use `"use client"` directive for interactive components (webcam, speech-to-text).
- **Styling:** Follow Tailwind CSS utility-first approach; use `clsx` and `tailwind-merge` for conditional class names.
- **Type Safety:** Ensure database interactions are typed through Drizzle ORM.
- **Animations:** Use `framer-motion` for simple transitions and `gsap` for complex, high-performance animations.

## Environment Variables
The following environment variables are required:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_DRIZZLE_DB_URL`
