import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const proposal = await db.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const parsed = {
      ...proposal,
      abstract: JSON.parse(proposal.abstract),
      impactMatrix: JSON.parse(proposal.impactMatrix),
      customMetrics: JSON.parse(proposal.customMetrics),
      createdAt: proposal.createdAt.toISOString(),
    };

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Failed to fetch proposal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
