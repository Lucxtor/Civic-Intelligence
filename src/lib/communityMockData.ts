// ─────────────────────────────────────────────────────────────
// Community Mock Data — 500-Person Civic Telemetry Dataset
// Powering the White-Hat Cambridge Analytica Dashboard
// ─────────────────────────────────────────────────────────────

// ── Layer Enums ──────────────────────────────────────────────

export type Origin = 'Local' | 'Nomad' | 'Transplant';
export type Profession = 'Dev' | 'Founder' | 'Creative' | 'Operator';
export type Housing = 'Co-living' | 'Renting' | 'Owner';
export type CapitalVelocity = 'Bootstrapped' | 'VC-Backed' | 'Salaried';
export type TimeAvailability = 'High' | 'Medium' | 'Low';
export type RiskTolerance = 'High' | 'Low';
export type GovernancePref = 'Direct Democracy' | 'Delegative' | 'Technocratic' | 'Decentralized';
export type Expertise = 'Web3' | 'Urban Planning' | 'Tokenomics' | 'Legal' | 'Education' | 'Sustainability';
export type EngagementArchetype = 'Validator' | 'Debater' | 'Ghost' | 'Builder' | 'Observer';

export interface CommunityMember {
  id: string;
  // Structural
  origin: Origin;
  profession: Profession;
  housing: Housing;
  // Economic
  capitalVelocity: CapitalVelocity;
  timeAvailability: TimeAvailability;
  // Psychographic
  riskTolerance: RiskTolerance;
  governancePref: GovernancePref;
  // Epistemic
  expertise: Expertise[];
  // Behavioral
  archetype: EngagementArchetype;
  proposalsVoted: number;
  lastActiveDay: number; // days ago
}

// ── Deterministic Seeded Random ──────────────────────────────

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickMultiple<T>(arr: T[], count: number, rand: () => number): T[] {
  const shuffled = [...arr].sort(() => rand() - 0.5);
  return shuffled.slice(0, count);
}

// ── Generate 500 Members ─────────────────────────────────────

const ORIGINS: Origin[] = ['Local', 'Nomad', 'Transplant'];
const PROFESSIONS: Profession[] = ['Dev', 'Founder', 'Creative', 'Operator'];
const HOUSING: Housing[] = ['Co-living', 'Renting', 'Owner'];
const CAPITAL: CapitalVelocity[] = ['Bootstrapped', 'VC-Backed', 'Salaried'];
const TIME: TimeAvailability[] = ['High', 'Medium', 'Low'];
const RISK: RiskTolerance[] = ['High', 'Low'];
const GOVERNANCE: GovernancePref[] = ['Direct Democracy', 'Delegative', 'Technocratic', 'Decentralized'];
const EXPERTISE: Expertise[] = ['Web3', 'Urban Planning', 'Tokenomics', 'Legal', 'Education', 'Sustainability'];
const ARCHETYPES: EngagementArchetype[] = ['Validator', 'Debater', 'Ghost', 'Builder', 'Observer'];

const rand = seededRandom(42);

export const communityMembers: CommunityMember[] = Array.from({ length: 500 }, (_, i) => ({
  id: `passport-${String(i + 1).padStart(4, '0')}`,
  origin: pick(ORIGINS, rand),
  profession: pick(PROFESSIONS, rand),
  housing: pick(HOUSING, rand),
  capitalVelocity: pick(CAPITAL, rand),
  timeAvailability: pick(TIME, rand),
  riskTolerance: pick(RISK, rand),
  governancePref: pick(GOVERNANCE, rand),
  expertise: pickMultiple(EXPERTISE, 1 + Math.floor(rand() * 3), rand),
  archetype: pick(ARCHETYPES, rand),
  proposalsVoted: Math.floor(rand() * 35),
  lastActiveDay: Math.floor(rand() * 90),
}));

// ── Pre-Aggregated Data for Charts ───────────────────────────

function countBy<T extends string>(arr: T[]): Record<T, number> {
  return arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

// Structural
export const originDistribution = countBy(communityMembers.map(m => m.origin));
export const professionDistribution = countBy(communityMembers.map(m => m.profession));
export const housingDistribution = countBy(communityMembers.map(m => m.housing));

// Economic
export const capitalDistribution = countBy(communityMembers.map(m => m.capitalVelocity));
export const timeDistribution = countBy(communityMembers.map(m => m.timeAvailability));

// Psychographic
export const riskDistribution = countBy(communityMembers.map(m => m.riskTolerance));
export const governanceDistribution = countBy(communityMembers.map(m => m.governancePref));

// Epistemic — flattened expertise tags
export const expertiseDistribution = countBy(communityMembers.flatMap(m => m.expertise));

// Behavioral
export const archetypeDistribution = countBy(communityMembers.map(m => m.archetype));

// Cross-dimensional: Risk Tolerance × Capital Velocity
export const riskByCapital = (() => {
  const matrix: Record<string, { highRisk: number; lowRisk: number }> = {};
  for (const cap of CAPITAL) {
    matrix[cap] = { highRisk: 0, lowRisk: 0 };
  }
  for (const m of communityMembers) {
    if (m.riskTolerance === 'High') matrix[m.capitalVelocity].highRisk++;
    else matrix[m.capitalVelocity].lowRisk++;
  }
  return CAPITAL.map(cap => ({
    capital: cap,
    'High Risk': matrix[cap].highRisk,
    'Low Risk': matrix[cap].lowRisk,
  }));
})();

// Epistemic radar data
export const epistemicRadarData = EXPERTISE.map(exp => ({
  subject: exp,
  count: expertiseDistribution[exp] || 0,
  fullMark: 500,
}));

// Top-level metrics
export const topMetrics = {
  totalPassports: communityMembers.length,
  activePassports: communityMembers.filter(m => m.lastActiveDay <= 14).length,
  avgTimeAvailability: (() => {
    const scores = { High: 3, Medium: 2, Low: 1 };
    const total = communityMembers.reduce((sum, m) => sum + scores[m.timeAvailability], 0);
    const avg = total / communityMembers.length;
    if (avg >= 2.5) return 'High';
    if (avg >= 1.5) return 'Medium';
    return 'Low';
  })(),
  dominantArchetype: Object.entries(archetypeDistribution)
    .sort(([, a], [, b]) => b - a)[0][0] as EngagementArchetype,
  dominantArchetypeCount: Object.entries(archetypeDistribution)
    .sort(([, a], [, b]) => b - a)[0][1],
  avgProposalsVoted: Math.round(
    communityMembers.reduce((sum, m) => sum + m.proposalsVoted, 0) / communityMembers.length
  ),
};

// Layer insights for the tabs
export const layerInsights = {
  structural: {
    title: 'Structural Layer',
    subtitle: 'Origin, Profession & Housing Topology',
    insight: `The community is ${originDistribution['Local'] > originDistribution['Nomad'] ? 'locally rooted' : 'nomad-heavy'}, with ${professionDistribution['Dev']} developers and ${professionDistribution['Founder']} founders forming the engineering backbone. Housing skews toward "${Object.entries(housingDistribution).sort(([,a],[,b]) => b - a)[0][0]}", suggesting a ${housingDistribution['Co-living'] > 100 ? 'transient, collaboration-oriented' : 'stability-oriented'} living pattern.`,
    actionable: 'Consider IRL co-working incentives for the co-living segment and long-term governance weight bonuses for owners.',
  },
  economic: {
    title: 'Economic Layer',
    subtitle: 'Capital Velocity & Time Bandwidth',
    insight: `${capitalDistribution['Salaried']} salaried members provide stability, while ${capitalDistribution['VC-Backed']} VC-backed participants bring high-growth energy. Time availability is predominantly "${topMetrics.avgTimeAvailability}", indicating ${topMetrics.avgTimeAvailability === 'High' ? 'strong volunteer capacity' : 'a need for async governance tools'}.`,
    actionable: 'Design voting windows for async participation. Compensate active validators from the bootstrapped segment who contribute time without capital backing.',
  },
  psychographic: {
    title: 'Psychographic Layer',
    subtitle: 'Risk Appetite & Governance Philosophy',
    insight: `Risk tolerance splits ${riskDistribution['High']}-${riskDistribution['Low']} (High-Low), showing a ${riskDistribution['High'] > riskDistribution['Low'] ? 'bold, experiment-ready' : 'cautious, stability-first'} community. Governance preferences favor "${Object.entries(governanceDistribution).sort(([,a],[,b]) => b - a)[0][0]}", aligning with the project's ${governanceDistribution['Decentralized'] > 100 ? 'decentralized ethos' : 'need for structured leadership'}.`,
    actionable: 'Deploy quadratic voting for high-risk proposals. Route low-risk members to advisory and audit roles.',
  },
  epistemic: {
    title: 'Epistemic Layer',
    subtitle: 'Domain Expertise & Knowledge Graph',
    insight: `Web3 expertise leads at ${expertiseDistribution['Web3']} members, followed by ${Object.entries(expertiseDistribution).sort(([,a],[,b]) => b - a)[1][0]} (${Object.entries(expertiseDistribution).sort(([,a],[,b]) => b - a)[1][1]}). The Legal expertise pool (${expertiseDistribution['Legal']}) is ${expertiseDistribution['Legal'] < 80 ? 'thin — potential governance risk' : 'adequate for regulatory compliance'}.`,
    actionable: 'Staff proposal review committees by expertise. Recruit Legal and Urban Planning specialists to close knowledge gaps.',
  },
  behavioral: {
    title: 'Behavioral Layer',
    subtitle: 'Engagement Archetypes & Participation Patterns',
    insight: `The dominant archetype is "${topMetrics.dominantArchetype}" (${topMetrics.dominantArchetypeCount} members), with ${archetypeDistribution['Ghost']} Ghosts representing passive participants. Active members voted on an average of ${topMetrics.avgProposalsVoted} proposals. ${topMetrics.activePassports} passports were active in the last 14 days.`,
    actionable: 'Gamify Ghost re-engagement with streak rewards. Elevate top Validators to delegate roles. Route Debaters to structured discourse channels.',
  },
};
