import { PrismaClient } from '../src/generated/prisma';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Clear existing data to ensure a fresh start as requested
  await prisma.anonymizedVote.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.category.deleteMany();
  await prisma.demographicDimension.deleteMany();

  // 2. Seed Demographic Dimensions (Standard setup)
  const dimensions = [
    {
      key: 'ageGroup',
      label: 'Age Group',
      options: JSON.stringify(['18–24', '25–34', '35–44', '45–54', '55+']),
    },
    {
      key: 'occupation',
      label: 'Occupation',
      options: JSON.stringify(['Tech Worker', 'Student', 'Educator', 'Public Servant', 'Business Owner', 'Other']),
    },
  ];

  for (const dim of dimensions) {
    await prisma.demographicDimension.create({ data: dim });
  }

  // 3. Seed Categories
  const categories = ['Infrastructure & Energy', 'Security & Digital Identity', 'Culture & Public Health'];
  for (const name of categories) {
    await prisma.category.create({ data: { name } });
  }

  // 4. Seed Proposals from User Examples
  const proposals = [
    {
      id: 'prop-solar-canopy',
      title: 'Implementation of Micro-Grid Solar Canopy in Central Plaza',
      category: 'Infrastructure & Energy',
      abstract: JSON.stringify({
        eli5: 'We want to build a large solar roof over the main square. It will provide shade during the summer and generate enough free power to run the community center. However, building it will cost a significant amount upfront and the square will be closed for construction for two months.',
        technical: 'Allocation of 150,000 USDC from the central treasury for the procurement and installation of a 50kW photovoltaic canopy. The infrastructure will be connected to the village micro-grid. Energy surplus will be tokenized via our local smart contract and distributed pro-rata to verified resident wallets to offset individual utility costs.'
      }),
      content: `## Overview\nThe Central Plaza is the heart of our community, but it suffers from extreme heat exposure during peak summer hours, reducing its utility. This proposal aims to install a state-of-the-art, semi-transparent photovoltaic canopy. \n\n## Objectives\n*   **Energy Independence:** Generate an estimated 50kW of clean energy daily.\n*   **Climate Adaptation:** Provide critical shade, lowering the ambient temperature of the plaza by up to 4°C.\n*   **Economic Return:** Tokenize surplus energy to subsidize grid costs for all verified residents.\n\n## Implementation Milestones\n1.  **Month 1:** Procurement of materials and structural safety auditing.\n2.  **Month 2:** Complete closure of Central Plaza for heavy construction.\n3.  **Month 3:** Grid integration, safety testing, and smart-contract deployment for energy tokenization.\n\n## Budget Breakdown\n*   **Materials (Solar & Steel):** 90,000 USDC\n*   **Labor & Engineering:** 40,000 USDC\n*   **Smart Contract Audits:** 20,000 USDC`,
      impactMatrix: JSON.stringify({
        beneficiaries: [{ tag: 'Community Center', estimate: 1 }, { tag: 'Verified Residents', estimate: 500 }],
        negativeImpacts: [{ tag: 'Local Traffic', risk: 'Moderate' }],
        financials: { totalCost: 150000, currency: 'USDC', roiConfidence: 85 }
      }),
      impact: 'High',
      customMetrics: JSON.stringify([
        { id: 'desirability', label: 'Desirability', description: '1 = Unnecessary, 5 = Highly Desired' },
        { id: 'feasibility', label: 'Budget Feasibility', description: '1 = Too Expensive/Risky, 5 = Great ROI' },
        { id: 'disruption', label: 'Disruption Tolerance', description: '1 = Cannot lose the plaza for 2 months, 5 = Acceptable' }
      ]),
      allowComments: true
    },
    {
      id: 'prop-zk-gates',
      title: 'Phase 1 Rollout of ZK-Proof Physical Access Gates',
      category: 'Security & Digital Identity',
      abstract: JSON.stringify({
        eli5: 'Instead of using plastic key cards or facial recognition to enter the gym and co-working spaces, you will simply tap your phone. The system will use advanced math to prove you are a resident without actually tracking or recording your identity, keeping your physical movements completely private.',
        technical: 'Upgrading physical access control APIs across all communal doors to accept Zero-Knowledge Proof (ZKP) payloads. This integrates with the existing EAS (Ethereum Attestation Service) infrastructure. The gates will verify a resident\'s "Active" credential off-chain without logging the specific wallet address or DID, ensuring Sybil-resistant access with absolute privacy.'
      }),
      content: `## Overview\nCurrently, our communal spaces rely on legacy RFID fobs and centralized databases that log every entry and exit. To align our physical infrastructure with our digital sovereignty principles, we propose upgrading to ZK-gated physical access.\n\n## Objectives\n*   **Absolute Privacy:** Physical movements (e.g., entering the gym at 2 AM) are verified for access rights but never logged against a specific identity.\n*   **Interoperability:** Leverages the exact same Verifiable Credentials (VCs) and DIDs we already use for digital governance.\n*   **Security:** Eliminates the risk of cloned RFID fobs or centralized database breaches.\n\n## Deployment Strategy\n*   **Phase A:** Retrofitting the Co-working space and Main Gym doors.\n*   **Phase B:** Two-week parallel testing (RFID + ZK Wallet both active).\n*   **Phase C:** Full deprecation of legacy RFID database.\n\n## Budget Breakdown\n*   **Hardware Retrofits (NFC/BLE Readers):** 15,000 USDC\n*   **Middleware Development:** 12,000 USDC`,
      impactMatrix: JSON.stringify({
        beneficiaries: [{ tag: 'Residents', estimate: 1000 }],
        negativeImpacts: [{ tag: 'Legacy Users', risk: 'Low' }],
        financials: { totalCost: 27000, currency: 'USDC', roiConfidence: 95 }
      }),
      impact: 'Medium',
      customMetrics: JSON.stringify([
        { id: 'privacy', label: 'Privacy Importance', description: '1 = Don\'t care about logging, 5 = Critical upgrade' },
        { id: 'ux', label: 'UX / Tech Literacy', description: '1 = Too complicated, 5 = Easy transition' },
        { id: 'urgency', label: 'Urgency', description: '1 = Current system is fine, 5 = Upgrade immediately' }
      ]),
      allowComments: true
    },
    {
      id: 'prop-culinary-lab',
      title: 'Establishment of the Open-Source Culinary Lab',
      category: 'Culture & Public Health',
      abstract: JSON.stringify({
        eli5: 'We want to turn the empty annex building into a professional, shared kitchen. It will be a place where residents can host cooking classes, experiment with recipes, and hold large community dinners. We will set aside a monthly budget to keep it stocked with high-quality local ingredients and maintain the equipment.',
        technical: 'Earmarking a 25,000 USDC setup cost and a 3,000 USDC monthly recurring grant to maintain health-grade culinary equipment. Access and booking of the kitchen will be managed via an NFT-based calendar scheduling system, prioritizing groups over individuals to encourage communal events.'
      }),
      content: `## Overview\nA thriving community requires spaces that foster offline connection. The currently vacant Annex B is structurally perfect for a commercial-grade kitchen. This proposal funds the transformation of this space into an "Open-Source Culinary Lab."\n\n## Objectives\n*   **Community Building:** Create a dedicated space for cultural exchange through food, hosting everything from local BBQ workshops to pasta-making masterclasses.\n*   **Health & Education:** Provide access to professional equipment (smokers, industrial mixers, pasta extruders) that individuals wouldn't buy for a single apartment.\n*   **Local Economy:** Use the monthly ingredient stipend to purchase directly from regional farmers and producers.\n\n## Operational Rules\n*   The space must be booked via the decentralized scheduling app.\n*   Priority booking is given to open community events (minimum 10 attendees) over private parties.\n*   A "Steward" credential will be issued to residents who volunteer to manage maintenance and health standard compliance.\n\n## Budget Breakdown\n*   **Initial Setup (Ovens, Ventilation, Prep Stations):** 25,000 USDC\n*   **Recurring Monthly Stipend:** 3,000 USDC`,
      impactMatrix: JSON.stringify({
        beneficiaries: [{ tag: 'Local Farmers', estimate: 10 }, { tag: 'Residents', estimate: 300 }],
        negativeImpacts: [],
        financials: { totalCost: 25000, currency: 'USDC', roiConfidence: 90 }
      }),
      impact: 'Medium',
      customMetrics: JSON.stringify([
        { id: 'value', label: 'Cultural Value', description: '1 = Unnecessary, 5 = Vital for bonding' },
        { id: 'fairness', label: 'Fairness of Access', description: '1 = Monopolized, 5 = Great shared resource' },
        { id: 'cost', label: 'Ongoing Cost Approval', description: '1 = Waste, 5 = Happy to fund' }
      ]),
      allowComments: true
    }
  ];

  for (const prop of proposals) {
    await prisma.proposal.create({ data: prop });
  }

  console.log('✓ Seed complete — 3 specific ideas populated in dev.db.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
