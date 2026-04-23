import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

// Anonymization salt
const SALT = process.env.VOTE_SALT || 'ipe-civic-secret-salt';

function generateVoterHash(walletAddress: string, proposalId: string) {
  return crypto
    .createHash('sha256')
    .update(`${walletAddress}-${proposalId}-${SALT}`)
    .digest('hex');
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const proposalId = searchParams.get('proposalId');

    if (!proposalId) {
      return NextResponse.json({ error: 'Missing proposal ID' }, { status: 400 });
    }

    // Get vote counts
    const votes = await db.anonymizedVote.findMany({
      where: { proposalId },
      select: { sentiment: true, responses: true },
    });

    const upVotes = votes.filter(v => v.sentiment === 'up').length;
    const downVotes = votes.filter(v => v.sentiment === 'down').length;

    return NextResponse.json({
      upVotes,
      downVotes,
      total: votes.length,
      sentiment: upVotes - downVotes,
    });
  } catch (error) {
    console.error('Failed to fetch vote data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { proposalId, walletAddress, sentiment, responses, demographics } = await req.json();

    if (!proposalId || !walletAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const voterHash = generateVoterHash(walletAddress, proposalId);

    // Upsert the anonymized vote
    // Note: We use a custom upsert logic because Prisma upsert requires a unique ID 
    // and we want to use the combination of proposalId and voterHash.
    
    const existing = await db.anonymizedVote.findUnique({
      where: {
        proposalId_voterHash: {
          proposalId,
          voterHash,
        }
      }
    });

    if (existing) {
      const updated = await db.anonymizedVote.update({
        where: { id: existing.id },
        data: {
          sentiment: sentiment || existing.sentiment,
          responses: responses ? JSON.stringify(responses) : existing.responses,
          demographics: demographics ? JSON.stringify(demographics) : existing.demographics,
        }
      });
      return NextResponse.json(updated);
    } else {
      const created = await db.anonymizedVote.create({
        data: {
          proposalId,
          voterHash,
          sentiment: sentiment || null,
          responses: JSON.stringify(responses || {}),
          demographics: JSON.stringify(demographics || {}),
        }
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error('Failed to submit vote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
