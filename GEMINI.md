# MockForge - AI-Powered Mock Interview Platform

MockForge is a comprehensive platform designed to help users prepare for technical interviews and aptitude tests using AI-driven simulations.

## Project Overview

- **Core Purpose**: AI-powered mock interview generation, speech-to-text answer recording, and automated evaluation/feedback.
- **Main Technologies**:
  - **Framework**: Next.js (App Router) with React 19.
  - **AI Integration**: Google Gemini AI (`gemini-2.5-flash`) for generating questions and evaluating answers.
  - **Authentication**: Clerk for secure user management and social login.
  - **Database**: Supabase (PostgreSQL) with Drizzle ORM using the `postgres-js` driver for reliable connectivity.
  - **Styling & UI**: Tailwind CSS, Radix UI, and Lucide icons.
  - **Animations**: GSAP and Framer Motion for a polished, interactive user experience.
  - **Special Features**: Web camera integration (`react-webcam`) and Speech-to-Text (`react-hook-speech-to-text`).

## Architecture

- **`app/`**: Contains the main application routes, including the dashboard, interview setup, and aptitude test sections.
- **`components/`**:
  - `shared/`: High-level business components like `InterviewList`, `AddNewInterview`, and `Header`.
  - `ui/`: Reusable primitive components (buttons, inputs, etc.).
  - `animations/`: Specialized animation components (GSAP magnetic effects, splash cursors).
- **`lib/`**:
  - `actions/`: Next.js Server Actions for database mutations and AI orchestration.
  - `ai/`: Gemini AI service integration and prompt templates.
  - `db/`: Database configuration and schema definitions (Drizzle).
- **`proxy.js`**: Likely used for handling local development or specialized routing needs.

## Building and Running

### Prerequisites
- Node.js (Latest LTS recommended)
- A Supabase PostgreSQL database instance
- Google Gemini API Key
- Clerk API keys

### Environment Setup
Create a `.env` file in the root directory and add the following:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

DATABASE_URL=
GEMINI_API_KEY=
```

### Key Commands
- **Development**: `npm run dev` (Starts the Next.js development server)
- **Build**: `npm run build` (Creates an optimized production build)
- **Database Push**: `npm run db:push` (Syncs Drizzle schema with the database)
- **Database Studio**: `npm run db:studio` (Opens Drizzle Kit's GUI for database management)
- **Production Start**: `npm run start` (Starts the built application)

## Development Conventions

- **Server Actions**: All database mutations and external API calls (like Gemini) should be handled via Server Actions in `lib/actions/`.
- **Database Schemas**: Define all tables in `lib/db/schema/` and export them through `lib/db/schema/index.js`.
- **Components**: Prefer functional components and use the `shared/` directory for components that contain business logic.
- **AI Prompts**: Keep prompts centralized in `lib/ai/prompts.js` for easier versioning and tuning.
- **Verification**: Always test AI interactions locally to ensure prompt responses are correctly parsed (AI responses are expected to be JSON).
