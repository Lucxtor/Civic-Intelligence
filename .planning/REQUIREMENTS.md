# Requirements

## v1 Requirements

### Architecture & Foundation
- [ ] **ARCH-01**: Initialize Next.js App Router project with Tailwind CSS and Shadcn UI.
- [ ] **ARCH-02**: Establish global design system theme (Dark mode, Inter/Space Grotesk typography, Floripa Web3 vibe).
- [ ] **ARCH-03**: Implement "bento box" dashboard layout components with frosted glass (glassmorphism) cards.
- [ ] **ARCH-04**: Build robust mock data service to simulate proposals, user profiles, demographics, and voting data.

### Authentication & Identity
- [ ] **AUTH-01**: Implement Web3 Wallet connection using Wagmi and RainbowKit.
- [ ] **AUTH-02**: Create simulated onboarding flow demonstrating conceptual Zero-Knowledge Proof (ZKP) identity verification (Age, Economics, Education, Orientation).

### Proposal Discovery & Viewing
- [ ] **PROP-01**: Display list of active community proposals.
- [ ] **PROP-02**: Display Proposal Detail View with full abstract and attached documents.
- [ ] **PROP-03**: Display Impact Matrix for proposals (Who this helps, Who this might negatively impact, Estimated costs).
- [ ] **PROP-04**: Toggle and view AI-generated "Explain it like I'm 5" (ELI5) plain-language translations of proposals.
- [ ] **PROP-05**: View neutral, objective context notes from verified Subject Matter Experts attached to abstracts.

### Feedback Mechanism
- [ ] **VOTE-01**: Rate specific aspects of a proposal on a multi-dimensional scale (e.g., fairness, feasibility, economic impact).
- [ ] **VOTE-02**: Submit structured disapproval feedback via a "Why" matrix of multiple-choice reasons.
- [ ] **VOTE-03**: Provide optional text-based feedback alongside structured ratings.
- [ ] **VOTE-04**: Allow users to update/change their opinion dynamically throughout the 1-week polling window.

### Analytics Dashboard
- [ ] **DASH-01**: Display live community feedback overview.
- [ ] **DASH-02**: Visualize Sentiment Heatmaps showing proposal support/opposition mapped against anonymized demographic cohorts.
- [ ] **DASH-03**: Ensure demographic data visibility respects Threshold Revealing (hiding groups with fewer than 10 participants).
- [ ] **DASH-04**: Display AI Topic Extraction list ("Top Community Concerns" dynamically generated from mock text comments).
- [ ] **DASH-05**: Display the "Consensus Finder" highlighting specific areas of agreement bridging opposing groups.

## v2 Requirements
- Real backend integration.
- Live AI LLM integration for dynamic topic extraction and ELI5 generation.
- Real Web3 Smart Contract integration for storing hashes/outcomes on chain.
- Actual cryptographic Zero-Knowledge Proof generation.

## Out of Scope
- Backend development (Phase 1 MVP is frontend-only validation).
- Identity verification systems beyond mock UI flows.

## Traceability
*(To be updated by Roadmap mappings)*
