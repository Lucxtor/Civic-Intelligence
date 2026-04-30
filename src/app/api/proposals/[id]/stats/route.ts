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

    const votes = await db.anonymizedVote.findMany({
      where: { proposalId: id },
    });

    const totalParticipants = votes.length;
    
    // 1. Sentiment Distribution (Up, Down, None)
    const sentimentDist = {
      up: votes.filter((v: any) => v.sentiment === 'up').length,
      down: votes.filter((v: any) => v.sentiment === 'down').length,
      none: votes.filter((v: any) => !v.sentiment).length,
    };

    // 2. Demographic Aggregations
    const ageGroups: Record<string, number> = {
      '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55+': 0
    };
    const locations: Record<string, number> = {};

    // 3. Nuance Metric Averages
    const metricsAverages: Record<string, { sum: number; count: number }> = {};
    const customMetrics = JSON.parse(proposal.customMetrics);
    customMetrics.forEach((m: any) => {
      metricsAverages[m.id] = { sum: 0, count: 0 };
    });

    votes.forEach((v: any) => {
      // Age Distribution
      try {
        const demo = JSON.parse(v.demographics);
        const age = parseInt(demo.age);
        if (age >= 18 && age <= 24) ageGroups['18-24']++;
        else if (age >= 25 && age <= 34) ageGroups['25-34']++;
        else if (age >= 35 && age <= 44) ageGroups['35-44']++;
        else if (age >= 45 && age <= 54) ageGroups['45-54']++;
        else if (age >= 55) ageGroups['55+']++;

        if (demo.location) {
          locations[demo.location] = (locations[demo.location] || 0) + 1;
        }
      } catch (e) {}

      // Nuance Responses
      try {
        const res = JSON.parse(v.responses);
        Object.keys(res).forEach(metricId => {
          if (metricsAverages[metricId]) {
            metricsAverages[metricId].sum += res[metricId];
            metricsAverages[metricId].count++;
          }
        });
      } catch (e) {}
    });

    const radarData = customMetrics.map((m: any) => ({
      subject: m.label,
      value: metricsAverages[m.id].count > 0 
        ? Math.round((metricsAverages[m.id].sum / metricsAverages[m.id].count) * 20) // Convert 1-5 scale to 0-100
        : 0
    }));

    return NextResponse.json({
      proposal: {
        title: proposal.title,
        id: proposal.id,
        category: proposal.category,
        customMetrics,
      },
      stats: {
        totalParticipants,
        sentimentDist,
        ageData: Object.entries(ageGroups).map(([group, count]) => ({ group, count })),
        locationData: Object.entries(locations).map(([district, count]) => ({ district, count })).sort((a,b) => b.count - a.count),
        radarData
      }
    });

  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
