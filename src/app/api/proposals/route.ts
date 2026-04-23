import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@/generated/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '20'));
    const category = searchParams.get('category');
    const impact = searchParams.get('impact');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'recent';

    const skip = (page - 1) * limit;

    // Building filtering object
    const where: Prisma.ProposalWhereInput = {};
    
    if (category && category !== 'null') {
      where.category = category;
    }
    
    if (impact && impact !== 'null') {
      where.impact = impact;
    }
    
    if (search) {
      where.title = { contains: search };
    }

    // Building sorting object
    let orderBy: any = { createdAt: 'desc' };
    
    if (sortBy === 'voted') {
      // Sorting by vote count requires a more complex query in Prisma
      // but for now we can sort by ID if count isn't directly available 
      // or implement it via include._count
      orderBy = {
        // This is a placeholder as Prisma's _count sort syntax is specific
      };
    } else if (sortBy === 'relevance') {
      // Impact score sort: High (3), Medium (2), Low (1)
      // Since impact is a string, we can't easily sort it unless we use raw sql or a mapping
      // For now, let's keep recent as fallback
    }

    // Fetch ALL matching proposals to allow accurate sorting on aggregated fields
    const allProposals = await db.proposal.findMany({
      where,
    });

    const total = allProposals.length;

    // Fetch vote summaries for ALL matching proposals
    const proposalIds = allProposals.map(p => p.id);
    const voteAggregates = await db.anonymizedVote.findMany({
      where: { proposalId: { in: proposalIds } },
      select: { proposalId: true, sentiment: true },
    });

    // Map and calculate metrics for sorting
    let proposalsWithMetrics = allProposals.map((p) => {
      const pVotes = voteAggregates.filter(v => v.proposalId === p.id);
      const upVotes = pVotes.filter(v => v.sentiment === 'up').length;
      const downVotes = pVotes.filter(v => v.sentiment === 'down').length;

      return {
        ...p,
        abstract: JSON.parse(p.abstract),
        impactMatrix: JSON.parse(p.impactMatrix),
        customMetrics: JSON.parse(p.customMetrics),
        createdAt: p.createdAt.toISOString(),
        upVotes,
        downVotes,
        netSentiment: upVotes - downVotes,
      };
    });

    // Apply Sorting
    proposalsWithMetrics.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'voted') {
        // Most Voted / Highly Rated = Net Score (Up - Down)
        return (b.netSentiment || 0) - (a.netSentiment || 0);
      }
      if (sortBy === 'relevance') {
        const impactScore: Record<string, number> = { 'High': 3, 'Medium': 2, 'Low': 1 };
        const scoreA = impactScore[a.impact] || 0;
        const scoreB = impactScore[b.impact] || 0;
        
        // If same impact, fallback to net sentiment
        if (scoreB === scoreA) {
          return (b.netSentiment || 0) - (a.netSentiment || 0);
        }
        return scoreB - scoreA;
      }
      return 0;
    });

    // Apply Pagination (Slice)
    const paginatedProposals = proposalsWithMetrics.slice(skip, skip + limit);

    return NextResponse.json({
      proposals: paginatedProposals,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Failed to fetch proposals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Normalize data for Prisma
    const normalizedData = {
      title: data.title || 'Untitled Proposal',
      category: data.category || 'Social',
      abstract: JSON.stringify(data.abstract || { technical: '', eli5: '' }),
      content: data.content || '',
      impactMatrix: JSON.stringify(data.impactMatrix || { beneficiaries: [], negativeImpacts: [], financials: { totalCost: 0, currency: 'BRL', roiConfidence: 50 } }),
      impact: data.impact || 'Medium',
      customMetrics: JSON.stringify(data.customMetrics || []),
      allowComments: data.allowComments ?? true,
    };

    const proposal = await db.proposal.create({
      data: normalizedData,
    });

    return NextResponse.json({
      ...proposal,
      abstract: JSON.parse(proposal.abstract),
      impactMatrix: JSON.parse(proposal.impactMatrix),
      customMetrics: JSON.parse(proposal.customMetrics),
    });
  } catch (error: any) {
    console.error('CRITICAL: Failed to create proposal in DB:', error.message);
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: error.message 
    }, { status: 500 });
  }
}
