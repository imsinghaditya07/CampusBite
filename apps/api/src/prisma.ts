import { PrismaClient } from '@prisma/client';
import path from 'path';

// Point PrismaClient to the shared SQLite database file
const dbPath = path.resolve(__dirname, '../../../packages/database/prisma/dev.db');

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${dbPath}`,
    },
  },
});
