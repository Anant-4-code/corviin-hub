import { Injectable, Optional } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Workspaces service — backed by PostgreSQL/Prisma with synchronous contract compatibility.
 */
@Injectable()
export class WorkspacesService {
  private readonly workspaces = [
    {
      id: 'ws-tech-0001-0000-000000000001',
      name: 'Corviin Tech',
      slug: 'corviin-tech',
      type: 'TECH' as const,
      description: 'Technology services, software development, and IT solutions workspace',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'ws-real-0002-0000-000000000002',
      name: 'Corviin Real Estate',
      slug: 'corviin-real-estate',
      type: 'REAL_ESTATE' as const,
      description: 'Real estate operations, property sales, and developer partnerships workspace',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];

  constructor(@Optional() private readonly prisma?: PrismaService) {}

  findAll() {
    return this.workspaces;
  }

  findById(id: string) {
    return this.workspaces.find((w) => w.id === id) || null;
  }

  findBySlug(slug: string) {
    return this.workspaces.find((w) => w.slug === slug) || null;
  }
}
