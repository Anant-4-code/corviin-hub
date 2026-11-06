import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly pool: Pool;
  private isConnected = false;

  constructor() {
    const connectionString =
      process.env.DATABASE_URL ||
      'postgresql://postgres@localhost:5433/corviin_hub?schema=public';

    const isSsl = connectionString.includes('sslmode=') || connectionString.includes('supabase.com');
    const pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: isSsl ? { rejectUnauthorized: false } : undefined,
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.isConnected = true;
      this.logger.log('PostgreSQL database connected successfully via PrismaPg adapter.');
    } catch (error: any) {
      this.isConnected = false;
      this.logger.warn(
        `PostgreSQL database connection failed (${error.message}). Running in offline/fallback mode.`,
      );
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      await this.pool.end();
      this.logger.log('PostgreSQL database disconnected cleanly.');
    } catch (error: any) {
      this.logger.warn(`Error during PostgreSQL disconnection: ${error.message}`);
    }
  }

  /**
   * Health check method to verify database connectivity
   */
  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Status check method
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

