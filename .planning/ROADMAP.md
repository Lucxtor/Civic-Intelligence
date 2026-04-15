# Roadmap: Civic Intelligence Platform MVP

## Overview

The goal is to build a high-fidelity frontend MVP with Next.js mapping out a multi-dimensional, data-driven governance platform. Phase 1 focuses on scaffolding the environment and mock data, Phase 2 implements Web3 authentication and zero-knowledge proof onboarding concepts, Phase 3 builds the proposal bento-box UI, Phase 4 implements the interactive multi-dimensional voting/feedback mechanism, and Phase 5 introduces the global aggregated data analytics dashboard. 

## Phases

- [x] **Phase 1: Project Setup & Global Design System** - Scaffold project and global theme
- [/] **Phase 1.1: Platform Scaffolding** - Shells for all pages (Admin, Discovery, Vote, Dashboard)
- [ ] **Phase 2: Authentication & Wallet Identity** - RainbowKit integration for demographic data
- [ ] **Phase 3: Proposal Presentation Refinement** - Enhancing the Bento box and Detail views
- [ ] **Phase 4: Feedback Mechanism Polish** - Dynamic multi-metric sliders
- [ ] **Phase 5: Full Analytics Engine** - Aggregated sentiment data visualizations

## Phase Details

### Phase 1: Project Setup & Global Design System
**Goal**: Scaffold Next.js application, establish design system routing, and set up mock data layer.
**Depends on**: Nothing
**Requirements**: ARCH-01, ARCH-02
**Success Criteria** (what must be TRUE):
  1. Local Next.js server runs successfully.
  2. Tailwind and Shadcn are configured with Inter/Space Grotesk typography.
  3. Dark mode "Floripa Web3" global theme is applied natively.
**Plans**: TBD

Plans:
- [x] 01-01: Initialize Next.js, Tailwind, Shadcn.
- [x] 01-02: Configure global layout and design variables.

### Phase 1.1: Platform Scaffolding
**Goal**: Build the core site structure (Landing, Admin, Proposals, Vote, Dashboard) with RESTful routing and persistent mock data via Zustand.
**Depends on**: Phase 1
**Requirements**: ARCH-03, PROP-01, PROP-02, VOTE-01, DASH-01
**Success Criteria**:
  1. User can create a proposal in Admin and see it in Discovery list.
  2. RESTful navigation works for all major sections.
  3. New proposals persist in localStorage.
**Plans**: TBD

### Phase 2: Authentication & Wallet Identity
**Goal**: Integrate Wagmi/RainbowKit for sign-ins and derive community demographics (Age, Economics, etc.) directly from the connected wallet.
**Depends on**: Phase 1.1
**Requirements**: AUTH-01
**Success Criteria**:
  1. User can click "Connect Wallet" and see RainbowKit modal.
  2. Identity displays demographics derived from the wallet handle/mock.
**Plans**: TBD

### Phase 3: Proposal Discovery & Detail Components
**Goal**: Refine the bento-box layouts and detail views with higher fidelity Markdown rendering and SME context nodes.
**Depends on**: Phase 2
**Requirements**: ARCH-03, ARCH-04, PROP-01, PROP-02, PROP-03, PROP-04, PROP-05
**Success Criteria**:
  1. Proposal list correctly maps mock data into buttery-smooth Framer Motion cards.
  2. User can toggle between rigorous text and ELI5 abstract.
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
| 1. Project Setup | 1/3 | Completed | 2026-04-13 |
| 1.1 Platform Scaffolding | 1/1 | Completed | 2026-04-15 |
| 2. Connect & Identity | 0/2 | Not started | - |
| 3. Discovery & Detail | 0/3 | Not started | - |
| 4. Feedback System | 0/2 | Not started | - |
| 5. Dashboard Engine | 0/3 | Not started | - |
