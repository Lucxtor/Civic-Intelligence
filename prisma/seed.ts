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

  console.log('✓ Seed complete — default demographic dimensions created.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
