export type ProposalCategory = 'Infrastructure' | 'Environmental' | 'Economic' | 'Social';
export type RiskLevel = 'Low' | 'Moderate' | 'Severe';

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
  customMetrics: { id: string; label: string; description: string }[];
  allowComments: boolean;
  createdAt: string;
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
  comment?: string;
}
