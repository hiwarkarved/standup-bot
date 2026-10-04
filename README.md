# StandupBot

An AI-powered daily standup tool that helps teams submit standups, generates AI summaries, and delivers them via email.

## Live Demo

[standupbot.vercel.app](https://standup-bot-taupe.vercel.app/login)

## Features

- Google Authentication via Supabase Auth
- Daily standup form (yesterday / today / blockers)
- AI-generated summary using Groq (LLaMA model)
- Email delivery of summary via Resend
- Dashboard to view past standups

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Google OAuth) |
| AI | Groq API (LLaMA) |
| Email | Resend |
| Deployment | Vercel |

## Getting Started

### Prerequisites
- Node.js v22+
- Supabase account
- Groq API key
- Resend API key

### Setup

```bash
git clone https://github.com/hiwarkarved/standup-bot.git
cd standup-bot
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_key
RESEND_API_KEY=your_resend_key
```

```bash
npm run dev
```

App runs at `http://localhost:3000`

## Author

[Vedant Hiwarkar](https://github.com/hiwarkarved)

<!-- StandupBot Tech Stack:

Frontend: Next.js 15 (App Router) + TypeScript + Tailwind CSS
Database: Supabase (PostgreSQL)
Auth: Supabase Auth (Google login)
AI: GROQ API (summarize standups)
Email: Resend (send daily summary emails)
Deployment: Vercel
