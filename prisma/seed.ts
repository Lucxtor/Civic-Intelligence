import { PrismaClient } from '../src/generated/prisma';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  const dimensions = [
    {
      key: 'ageGroup',
      label: 'Age Group',
      options: JSON.stringify(['18–24', '25–34', '35–44', '45–54', '55+']),
    },
    {
      key: 'occupation',
      label: 'Occupation',
      options: JSON.stringify([
        'Tech Worker',
        'Student',
        'Educator',
        'Public Servant',
        'Business Owner',
        'Other',
      ]),
    },
    {
      key: 'district',
      label: 'District',
      options: JSON.stringify([
        'Centro',
        'Trindade',
        'Lagoa',
        'Campeche',
        'Continente',
        'Other',
      ]),
    },
  ];

  for (const dim of dimensions) {
    await prisma.demographicDimension.upsert({
      where: { key: dim.key },
      update: {},
      create: dim,
    });
  }

  const categories = ['Infrastructure', 'Environmental', 'Economic', 'Social'];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat },
      update: {},
      create: { name: cat },
    });
  }

  // --- PROPOSALS MOCK DATA ---
  const categoriesList = ['Economic', 'Environmental', 'Infrastructure', 'Social'];
  const impactsList = ['Low', 'Medium', 'High'];
  
  const baseProposals = [
    {
      id: 'prop-1',
      title: 'Precision Municipal Tax Rebalancing',
      category: 'Economic',
      abstract: JSON.stringify({
        technical: 'Lowering the municipal tax on services (ISS) by 2.2% while compensating through a tiered product levy increase for high-luxury retail.',
        eli5: 'Lower the tax on daily services like haircuts, but pay for it by slightly higher taxes on expensive luxury items.'
      }),
      content: '## Executive Summary\n\nThis proposal focuses on tax rebalancing. By shifting the burden from services to products, we aim to stimulate the service-based innovation economy in Floripa.',
      impactMatrix: JSON.stringify({
        beneficiaries: [
          { tag: 'Small Businesses', estimate: 1250 },
          { tag: 'Digital Nomads', estimate: 8000 }
        ],
        negativeImpacts: [
          { tag: 'Luxury Retail', risk: 'Moderate' },
          { tag: 'Importers', risk: 'Low' }
        ],
        financials: {
          totalCost: 0,
          currency: 'BRL',
          roiConfidence: 85
        }
      }),
      customMetrics: JSON.stringify([
        { id: 'approval', label: 'Global Approval', description: 'Overall sentiment towards the tax shift.' },
        { id: 'equality', label: 'Economic Equality', description: 'Will this help bridge the community gap?' },
        { id: 'simplicity', label: 'Admin Simplicity', description: 'How hard is this to implement?' }
      ]),
      allowComments: true,
      impact: 'Medium',
      createdAt: new Date('2026-04-10T10:00:00Z'),
    },
    {
      id: 'prop-2',
      title: 'Bioclimatic Urban Corridor Phase 1',
      category: 'Environmental',
      abstract: JSON.stringify({
        technical: 'Implementation of mandatory green roofing and natural cooling ventilation shafts for commercial buildings > 1000sqm.',
        eli5: 'New buildings must have gardens on top and use wind instead of AC to stay cool.'
      }),
      content: '## Sustainability Framework\n\nIntegrating biological cooling systems into vertical architecture. This reduces the heat island effect and municipal power load.',
      impactMatrix: JSON.stringify({
        beneficiaries: [
          { tag: 'Downtown Residents', estimate: 45000 },
          { tag: 'Energy Grid', estimate: 1 }
        ],
        negativeImpacts: [
          { tag: 'Real Estate Devs', risk: 'Severe' }
        ],
        financials: {
          totalCost: 15000000,
          currency: 'BRL',
          roiConfidence: 92
        }
      }),
      customMetrics: JSON.stringify([
        { id: 'approval', label: 'Global Approval', description: 'Support for mandatory green requirements.' },
        { id: 'impact', label: 'Climate Impact', description: 'Projected reduction in heat island effect.' }
      ]),
      allowComments: true,
      impact: 'High',
      createdAt: new Date('2026-04-11T14:30:00Z'),
    }
  ];

  // Generate 30 more mock proposals for pagination testing
  for (let i = 3; i <= 35; i++) {
    const category = categoriesList[i % categoriesList.length];
    const impact = impactsList[i % impactsList.length];
    baseProposals.push({
      id: `prop-${i}`,
      title: `${category} Initiative #${i}: Building a Resilient Future`,
      category: category,
      abstract: JSON.stringify({
        technical: `Optimization of ${category.toLowerCase()} resources through automated resource allocation and community oversight platforms version ${i}.0.`,
        eli5: `A simple way to make our ${category.toLowerCase()} systems work better for everyone in the neighborhood.`
      }),
      content: `## Project Overview\n\nThis is a generated mock proposal for ${category}. It aims to improve civic infrastructure by implementing modern standards.\n\n### Goals\n- Improve efficiency\n- Reduce waste\n- Increase transparency`,
      impactMatrix: JSON.stringify({
        beneficiaries: [{ tag: 'Local Community', estimate: 500 * i }],
        negativeImpacts: [{ tag: 'Legacy Systems', risk: i % 2 === 0 ? 'Moderate' : 'Low' }],
        financials: { totalCost: 10000 * i, currency: 'BRL', roiConfidence: 70 + (i % 25) }
      }),
      customMetrics: JSON.stringify([
        { id: 'approval', label: 'Community Support', description: 'General sentiment.' },
        { id: 'feasibility', label: 'Technical Feasibility', description: 'Ease of deployment.' }
      ]),
      allowComments: true,
      impact: impact,
      createdAt: new Date(Date.now() - i * 3600000 * 24), // Spread over days
    });
  }

  for (const prop of baseProposals) {
    const createdProp = await prisma.proposal.upsert({
      where: { id: prop.id },
      update: {},
      create: prop,
    });

    // Create some random votes for each proposal to test sorting
    const voteCount = Math.floor(Math.random() * 15);
    for (let v = 0; v < voteCount; v++) {
      await prisma.anonymizedVote.create({
        data: {
          proposalId: createdProp.id,
          voterHash: `mock-hash-${createdProp.id}-${v}`,
          sentiment: Math.random() > 0.3 ? 'up' : 'down',
          demographics: JSON.stringify({ age: 18 + v, location: 'Virtual' }),
          responses: JSON.stringify({ approval: Math.floor(Math.random() * 100) }),
        }
      });
    }
  }

  console.log('✓ Seed complete — 35 proposals and mock votes Created/Synced.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
