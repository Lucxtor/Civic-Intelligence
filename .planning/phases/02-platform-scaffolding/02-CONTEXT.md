# Phase 2: Authentication & Wallet Identity — Context

**Gathered:** 2026-04-17
**Status:** Ready for planning
**Source:** User-defined architecture — all decisions are locked.

<domain>
## Phase Boundary

This phase implements:
1. **Civic onboarding modal** — shown to new wallet addresses after connecting.
2. **Off-chain profile store** — demographic data linked to `0x…` wallet address in Supabase.
3. **Admin Panel redesign** — a tabbed hub containing Proposal Forge and a new Demographic Groups manager.
4. **Vote submission pipeline** — strips wallet address, sends only demographic tags to analytics.

This phase does NOT implement ZKP, smart contracts, or on-chain identity — that remains out of scope for v1.
</domain>

<decisions>
## Implementation Decisions

### D-01: Authentication Strategy
- Wallet connects via RainbowKit (already wired). No changes to Web3Provider needed.
- After connection, read `address` from `useAccount()` (wagmi). This is our identity token.
- No JWT, no sessions — the connected wallet address IS the session.

### D-02: New User Detection & Onboarding Modal
- On wallet connect, query Supabase for a user profile matching the `address`.
- If no profile exists → show the **Civic Onboarding Modal** (full-screen overlay, glassmorphism).
- If profile exists → proceed silently.
- Modal copy: *"Welcome. To participate in governance, we need your civic context."*
- The modal is **blocking** — user cannot vote or create proposals until it's completed.

### D-03: Demographic Data Model
- Demographics are **not fixed** — they are managed by admins via the Admin Panel.
- Each demographic dimension has a `key` (e.g. `occupation`) and a list of `options` (e.g. `["Tech Worker", "Student", "Educator", ...]`).
- User selects one option per dimension from dropdown/select UI.
- Example dimensions (seeded as defaults): `ageGroup`, `occupation`, `district`.

### D-04: Off-Chain Storage — Prisma + SQLite
- **ORM**: Prisma with SQLite provider (`prisma/dev.db`). Zero external dependencies.
- **Models**:
  - `User` — `walletAddress` (String, @id), `demographics` (String/JSON), `createdAt`.
  - `DemographicDimension` — `id`, `key` (@unique), `label`, `options` (String/JSON array), `createdAt`.
  - `AnonymizedVote` — `id`, `proposalId`, `demographics` (String/JSON), `responses` (String/JSON), `createdAt`. **No walletAddress field.**
- **Client**: Singleton pattern in `src/lib/db.ts` to prevent hot-reload connection leaks.
- **Seeding**: `prisma/seed.ts` pre-populates default dimensions (Age Group, Occupation, District).
- **Privacy**: The `User` table maps `walletAddress → demographics`. At vote submission time, the Next.js API route (`/api/vote`) fetches demographics by address server-side and writes ONLY demographics to `AnonymizedVote`. The wallet address is never written alongside votes.

### D-05: Vote Submission Pipeline (Privacy Layer)
- When a user submits a vote:
  1. Frontend sends `{ proposalId, walletAddress, responses }` to a Next.js API route (`/api/vote`).
  2. API route looks up `demographics` by `walletAddress` in Supabase.
  3. API route writes `{ proposalId, demographics, responses }` (no `walletAddress`) to the votes store.
  4. Returns success to frontend.
- This ensures the analytics dashboard **never sees wallet addresses**, only demographic cohorts.

### D-06: Admin Panel Architecture
- The existing `/admin` page becomes a **tabbed dashboard** with the following tabs:
  1. **Proposal Forge** — existing `AdminForge` component, unchanged.
  2. **Demographic Groups** — a new form to create/edit/delete demographic dimensions and their options.
- Access is gated by `AuthGuard` (wallet must be connected). For MVP, any connected wallet can access admin.
- The demographic dimensions stored in Supabase are used to dynamically populate the onboarding modal selects.

### D-07: Frontend State for Profile
- Create a new Zustand store `useProfileStore` (or extend `useMockStore`) to cache the current user's demographic profile after fetch.
- Fields: `{ walletAddress, demographics, isOnboarded, isLoading }`.
- On wallet connect: fetch profile, set store. On wallet disconnect: clear store.

### D-08: Environment & Config
- No secret keys required — SQLite database is local (`prisma/dev.db`).
- Add `prisma/dev.db` and `prisma/dev.db-journal` to `.gitignore`.
- Required dev setup steps:
  1. `npm install @prisma/client && npm install -D prisma ts-node`
  2. `npx prisma db push` — creates the local SQLite database and tables.
  3. `npx prisma db seed` — populates default demographic dimensions.
- Create `.env.local.example` documenting the WalletConnect project ID (the only remote key we use).

### D-09: Recharts Dashboard Warning (Existing Bug)
- The browser console shows repeated `width(-1) and height(-1)` errors from recharts on the `/proposals/[id]/dashboard` page.
- Fix: wrap `ResponsiveContainer` usage in a `useEffect`-guarded client-only render or add `minHeight`/`minWidth` to chart container divs.
- This is a quick fix to include in this phase since it affects the analytics that Phase 2 feeds into.

### Agent's Discretion
- Supabase schema migration strategy (use `supabase db push` or manual SQL in dashboard).
- Loading skeleton UX while profile fetch is in-flight.
- Exact onboarding modal animation style (Framer Motion, same spring style as rest of app).
- Error handling UI for failed Supabase writes.
</decisions>

<canonical_refs>
## Canonical References

- `src/components/providers/Web3Provider.tsx` — existing RainbowKit/Wagmi setup.
- `src/components/auth/AuthGuard.tsx` — existing wallet-gated guard component.
- `src/app/admin/page.tsx` — existing admin page shell to be extended with tabs.
- `src/store/useMockStore.ts` — existing Zustand store pattern to follow for `useProfileStore`.
- `.planning/REQUIREMENTS.md` — AUTH-01, AUTH-02 requirements.
- `.planning/phases/01.2-logged-in-wallet-user-creates-dao-structure-or-subscription/01.2-CONTEXT.md` — prior phase context.
</canonical_refs>

<specifics>
## Specific Ideas

- The admin "Demographic Groups" tab should have an "Add Dimension" button that opens an inline form: `Label` (e.g. "Occupation"), `Key` (auto-slugified), and a dynamic list of options you can add/remove.
- The onboarding modal should feel premium — dark glass panel, Ipê Green accents, progress indicator if multi-step.
- Seed data: the `demographic_dimensions` table should be pre-seeded with `ageGroup` ("18–24", "25–34", "35–44", "45–54", "55+"), `occupation` ("Tech Worker", "Student", "Educator", "Public Servant", "Business Owner", "Other"), `district` (Florianópolis neighborhoods from mock data).
</specifics>

<deferred>
## Deferred Ideas

- ZKP / cryptographic identity verification (explicitly out of scope for v1).
- Role-based admin access (e.g., only specific wallet addresses can access admin). For MVP, any connected wallet can.
- Supabase Row-Level Security rules (add later when roles are defined).
- Real-time vote streaming via Supabase Realtime.
</deferred>

---
*Phase: 02-platform-scaffolding (Phase 2: Authentication & Wallet Identity)*
*Context gathered: 2026-04-17 via gsd-discuss-phase (user-provided architecture)*
