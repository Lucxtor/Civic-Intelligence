import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const dimensions = await db.demographicDimension.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const parsed = dimensions.map((d: any) => ({
      ...d,
      options: JSON.parse(d.options),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Failed to fetch dimensions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { key, label, options } = await req.json();

    if (!key || !label || !Array.isArray(options) || options.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const dimension = await db.demographicDimension.create({
      data: {
        key,
        label,
        options: JSON.stringify(options),
      },
    });

    return NextResponse.json({
      ...dimension,
      options: JSON.parse(dimension.options),
    });
  } catch (error) {
    console.error('Failed to create dimension:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing dimension ID' }, { status: 400 });
    }

    await db.demographicDimension.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete dimension:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
