import { PrismaClient } from '../generated/prisma';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'dev.db');

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  try {
    // Only attempt SQLite initialization if not in a Vercel-like environment
    // or if we're explicitly running locally.
    const adapter = new PrismaBetterSqlite3({ url: dbPath });
    return new PrismaClient({ adapter });
  } catch (e) {
    console.warn('⚠️ SQLite adapter failed to load (standard for Vercel/Serverless). Using Mock Fallback mode.');
    // Return a dummy object that will trigger our API fallbacks
    return {
      proposal: { findMany: () => Promise.reject('DB unavailable'), findUnique: () => Promise.reject('DB unavailable') },
      category: { findMany: () => Promise.reject('DB unavailable') },
      anonymizedVote: { findMany: () => Promise.reject('DB unavailable') },
    } as any;
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
