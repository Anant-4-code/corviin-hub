import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env relative to current working directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres@localhost:5433/corviin_hub?schema=public',
  },
  migrations: {
    seed: 'ts-node prisma/seed.ts',
  },
});
