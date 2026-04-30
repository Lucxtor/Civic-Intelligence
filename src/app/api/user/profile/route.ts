import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/user/profile?address=0x...
// Returns the user profile + all demographic dimensions
export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }

  const [user, dimensions] = await Promise.all([
    db.user.findUnique({ where: { walletAddress: address } }),
    db.demographicDimension.findMany({ orderBy: { createdAt: 'asc' } }),
  ]);

  return NextResponse.json({
    user: user
      ? { ...user, demographics: JSON.parse(user.demographics) }
      : null,
    dimensions: dimensions.map((d: any) => ({
      ...d,
      options: JSON.parse(d.options),
    })),
  });
}

// POST /api/user/profile
// Body: { walletAddress: string, demographics: Record<string, string> }
export async function POST(req: NextRequest) {
  const { walletAddress, demographics } = await req.json();

  if (!walletAddress || !demographics) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const user = await db.user.upsert({
    where: { walletAddress },
    update: { demographics: JSON.stringify(demographics) },
    create: { walletAddress, demographics: JSON.stringify(demographics) },
  });

  return NextResponse.json({
    user: { ...user, demographics: JSON.parse(user.demographics) },
  });
}
