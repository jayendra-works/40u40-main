# India's 40 Under 40 Summit & Awards 2026

Premium **nomination and recognition platform** by **Asia Inc. 500**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, PostgreSQL (Prisma), NextAuth.

## Setup

1. **Install and env**

```bash
npm install
cp .env.example .env
# Set DATABASE_URL (PostgreSQL), NEXTAUTH_URL, NEXTAUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, NEXT_SUMMIT_DATE
```

2. **Database**

```bash
npm run db:push
npm run db:seed
```

3. **Run**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin) (use ADMIN_EMAIL / ADMIN_PASSWORD).

## Platform features

- **Nomination pipeline**: Submit → Under Review → Shortlisted → Finalist → Winner (admin moves stages)
- **Admin dashboard** (`/admin`): Dashboard, Nominees, Jury, Sponsors, Content
- **Jury evaluation** (`/jury`): Score nominees (Innovation, Impact, Leadership), view ranking
- **Winners** (`/winners`, `/winners/[slug]`): Gallery and profile pages with SEO and schema.org
- **Homepage**: Dynamic nomination counter, countdown timer, CMS-backed FAQ and sponsors
- **Agenda** (`/agenda`): Summit agenda from DB
- **Rate limiting** on nomination form; input sanitization; optional GA (NEXT_PUBLIC_GA_ID)

## Project structure

- `app/` — App Router: home, nominate, winners, agenda, admin, jury, API auth
- `app/actions/` — Server actions: nomination submit, admin status update, jury scoring
- `components/` — Layout, UI, sections (Hero, Stats, Countdown, NominationCounter, etc.)
- `prisma/` — Schema (Nominee, Nomination, JuryMember, JuryScore, Sponsor, Faq, AgendaItem, Speaker, Article, User)
- `lib/` — Prisma client, auth config, validations, rate limit, constants

## Scripts

- `npm run dev` — Dev server
- `npm run build` — Prisma generate + Next build
- `npm run db:push` — Push schema to DB (no migrations)
- `npm run db:migrate` — Create migration
- `npm run db:seed` — Seed FAQs (and optional content)
- `npm run db:studio` — Prisma Studio

## Deployment

Set env vars on your host. The site is intended for **40u40.asiainc500.com**. Use a managed PostgreSQL (Neon, Vercel Postgres, etc.) and ensure `DATABASE_URL` is set.
