# Phase 1: Project Setup & Global Design System - Context

**Gathered:** 2026-04-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold Next.js application, establish design system routing, and set up mock data layer based on the Floripa Web3 Techno-Optimist blueprint. This phase is purely foundation work before any content UI is built.

</domain>

<decisions>
## Implementation Decisions

### Mock Data Strategy
- Zustand used as global state store for the mock data engine.
- Prevents resetting data during route navigations, simulating a real interactive app.

### Animation Architecture
- Reusable Framer Motion higher-order components (HOCs).
- Focus on building base `MotionBentoCard` and `FadeInPage` wrappers instead of scattering `motion.div` tags organically.

### Routing Structure
- Nested Next.js App Router layouts.
- Central persistent layout frame wrapping the dynamic bento-box views.

### Design System and Styling
- Dark mode default (Charcoal/deep dark).
- Core Accents: Electric Yellow, Deep Magenta, Vibrant Green.
- Typography: Inter for UI logic, Space Grotesk for headers and distinct text blocks.
- Shadcn UI integrated heavily with custom Tailwind utility extensions for glassmorphism panels.

### the agent's Discretion
- Folder structure inside `src/`.
- Mock Data initial dummy seed generation.
- Exact spacing, padding, and drop-shadow variables for the bento boxes.

</decisions>

<specifics>
## Specific Ideas

- Vibe: "Techno-Optimists"
- Blend Web3 cyberpunk aesthetics with nature-inspired (Florianópolis) biology logic.
- Glassmorphism utilized throughout for dense data bento layout feeling lightweight.

</specifics>

<canonical_refs>
## Canonical References

No external specs — requirements are fully captured in decisions above based on original initialization prompt.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None (Greenfield)

### Established Patterns
- Next.js 14+ App Router standards

### Integration Points
- Root `layout.tsx` will be the integration hub for the future Wagmi context providers and styling layers.

</code_context>

<deferred>
## Deferred Ideas

- Web3 Wallet connect (Phase 2)
- Multi-dimensional Voting Implementation (Phase 4)

</deferred>

---

*Phase: 01-project-setup*
*Context gathered: 2026-04-13*
