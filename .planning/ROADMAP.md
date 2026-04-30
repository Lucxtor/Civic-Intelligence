# Roadmap: Civic Intelligence Platform MVP

## Overview

The goal is to build a high-fidelity frontend MVP with Next.js mapping out a multi-dimensional, data-driven governance platform. Phase 1 focuses on scaffolding the environment and mock data, Phase 2 implements Web3 authentication and zero-knowledge proof onboarding concepts, Phase 3 builds the proposal bento-box UI, Phase 4 implements the interactive multi-dimensional voting/feedback mechanism, and Phase 5 introduces the global aggregated data analytics dashboard. 

## Phases

- [x] **Phase 1: Project Setup & Global Design System** - Scaffold project and global theme
- [x] **Phase 1.1: Platform Scaffolding** - Shells for all pages (Admin, Discovery, Vote, Dashboard)
- [x] **Phase 01.2: Logged in wallet user creates DAO structure or subscription** - Subscription tiers on landing page
- [x] **Phase 2: Authentication & Wallet Identity** - RainbowKit + Prisma onboarding
- [ ] **Phase 3: Proposal Discovery & Voting Mechanics** - Filters, Up/Down Voting, and UI Refinement
- [ ] **Phase 4: Feedback Mechanism Polish** - Dynamic multi-metric sliders
- [x] **Phase 5: Full Analytics Engine** - Aggregated sentiment data visualizations

## Phase Details

### Phase 1: Project Setup & Global Design System
**Goal**: Scaffold Next.js application, establish design system routing, and set up mock data layer.
**Depends on**: Nothing
**Requirements**: ARCH-01, ARCH-02
**Success Criteria** (what must be TRUE):
  1. Local Next.js server runs successfully.
  2. Tailwind and Shadcn are configured with Inter/Space Grotesk typography.
  3. Dark mode "Floripa Web3" global theme is applied natively.
**Plans**: 
- [x] 01-01: Initialize Next.js, Tailwind, Shadcn.
- [x] 01-02: Configure global layout and design variables.

### Phase 01.2: Logged in wallet user creates DAO structure or subscription (INSERTED)
**Goal:** Implement subscription pricing tiers on the landing page for multi-tenant DAO instantiation.
**Requirements:** AUTH-01
**Depends on:** Phase 1
**Plans:** 
- [x] 01.2-01: Create subscription plans on landing page.

### Phase 1.1: Platform Scaffolding
**Goal**: Build the core site structure (Landing, Admin, Proposals, Vote, Dashboard) with RESTful routing and persistent mock data via Zustand.
**Depends on**: Phase 1
**Requirements**: ARCH-03, PROP-01, PROP-02, VOTE-01, DASH-01
**Success Criteria**:
  1. User can create a proposal in Admin and see it in Discovery list.
  2. RESTful navigation works for all major sections.
  3. New proposals persist in localStorage.
**Plans**: 
- [x] 01.1-01: Build core site structure and mock store.

### Phase 2: Authentication & Wallet Identity
**Goal**: Integrate Wagmi/RainbowKit for sign-ins and derive community demographics via off-chain Prisma/SQLite storage.
**Depends on**: Phase 1.1
**Requirements**: AUTH-01
**Success Criteria**:
  1. User can click "Connect Wallet" and see RainbowKit modal.
  2. Blocking onboarding modal captures demographic context.
  3. Vote privacy is maintained by stripping wallet ID server-side.
**Plans**: 
- [x] 02-01: Prisma + SQLite setup, schema, and seed.
- [x] 02-02: Profile store, API route, and wallet detection hook.
- [x] 02-03: Onboarding modal UI.
- [x] 02-04: Admin demographic dimension manager.
- [x] 02-05: Vote privacy API and Recharts SSR fix.

### Phase 3: Proposal Discovery & Voting Mechanics
**Goal**: Implement proposal filters in the discovery grid and add explicit Up/Down voting options alongside the multi-dimensional system.
**Depends on**: Phase 2
**Requirements**: ARCH-03, ARCH-04, PROP-01, PROP-02, PROP-03, PROP-04, PROP-05
**Success Criteria**:
  1. User can filter proposals by category, status, and search term.
  2. Proposal cards display total up/down counts.
  3. Vote page includes binary up/down choice before the detail sliders.
**Plans**: TBD

### Phase 4: Feedback Mechanism
**Goal**: Implement the highly interactive multi-dimensional slider voting tool and structured disapproval matrix.
**Depends on**: Phase 3
**Requirements**: VOTE-01, VOTE-02, VOTE-03, VOTE-04
**Success Criteria**:
  1. User can drag sliders for individual aspects (Fairness, Feasibility).
  2. Selecting 'Disapprove' opens the multi-select "Why" matrix.
**Plans**: TBD

### Phase 5: Full Analytics Engine
**Goal**: Visualize the sentiment, demographic threshold maps, and consensus finding on an aggregated dashboard.
**Depends on**: Phase 4
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05
**Success Criteria**:
  1. Recharts/Chart.js accurately translates demographic voting data into heatmaps.
  2. "Consensus Finder" visual renders correctly.
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Setup | 2/2 | Completed | 2026-04-13 |
| 1.1 Platform Scaffolding | 1/1 | Completed | 2026-04-15 |
| 2. Connect & Identity | 5/5 | Completed | 2026-04-17 |
| 3. Discovery & Voting | 1/3 | In Progress | - |
| 4. Feedback System | 0/2 | Not started | - |
| 5. Dashboard Engine | 1/1 | Completed | 2026-04-29 |
