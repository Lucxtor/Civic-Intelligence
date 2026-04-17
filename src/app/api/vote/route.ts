import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, proposalId, responses } = await req.json();

    if (!walletAddress || !proposalId || !responses) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch User Profile
    const user = await db.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User demographic profile not found. User must onboard first.' },
        { status: 403 }
      );
    }

    // 2. Strip wallet identity & store anonymized demographics
    // We strictly map the existing user demographics to the vote row,
    // leaving behind the wallet address.
    const vote = await db.anonymizedVote.create({
      data: {
        proposalId,
        responses: JSON.stringify(responses),
        demographics: user.demographics,
      },
    });

    return NextResponse.json({ success: true, voteId: vote.id });
  } catch (error) {
    console.error('Failed to submit vote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
