import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    let categories: any[] = [];
    try {
      categories = await db.category.findMany({
        orderBy: { name: 'asc' },
      });
    } catch (e) {
      console.warn('⚠️ Categories DB failed, falling back to mock.');
    }

    if (categories.length === 0) {
      const { MOCK_CATEGORIES } = await import('@/lib/mock-data');
      return NextResponse.json(MOCK_CATEGORIES.map((c: any) => c.name));
    }

    return NextResponse.json(categories.map((c: any) => c.name));
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
