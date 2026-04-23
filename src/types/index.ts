export type ProposalCategory = string;
export type RiskLevel = 'Low' | 'Moderate' | 'Severe';
export type ImpactLevel = 'Low' | 'Medium' | 'High';

export interface ImpactMatrix {
  beneficiaries: { tag: string; estimate: number }[];
  negativeImpacts: { tag: string; risk: RiskLevel }[];
  financials: {
    totalCost: number;
    currency: string;
    roiConfidence: number; // 0-100
  };
}

export interface Proposal {
  id: string;
  title: string;
  category: ProposalCategory;
  abstract: {
    technical: string; // High-fidelity resume
    eli5: string; // Plain language translation
  };
  content: string; // Full Markdown content
  impactMatrix: ImpactMatrix;
  impact: ImpactLevel;
  customMetrics: { id: string; label: string; description: string }[];
  allowComments: boolean;
  createdAt: string;
  upVotes?: number;
  downVotes?: number;
  netSentiment?: number;
}

export interface UserVote {
  proposalId: string;
  voterId: string;
  demographics: {
    age?: number;
    economicStatus?: string;
    location?: string;
  };
  responses: Record<string, number>; // metricId -> value (0-100)
  sentiment?: 'up' | 'down' | null; // Optional: specific to nuance context
  comment?: string;
}

export interface RelevanceVote {
  proposalId: string;
  voterId: string;
  type: 'up' | 'down';
}
