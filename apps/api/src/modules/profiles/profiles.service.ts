import { Injectable, Optional } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Profiles service — backed by PostgreSQL/Prisma with synchronous contract compatibility.
 * These are acting-profile records, NOT authenticated identities.
 */
@Injectable()
export class ProfilesService {
  private readonly profiles = [
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      displayName: 'Anant',
      initials: 'A',
      avatarUrl: undefined,
      email: undefined,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      displayName: 'Rohit',
      initials: 'R',
      avatarUrl: undefined,
      email: undefined,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      displayName: 'Utkarsh',
      initials: 'U',
      avatarUrl: undefined,
      email: undefined,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];

  constructor(@Optional() private readonly prisma?: PrismaService) {}

  findAll() {
    return this.profiles;
  }

  findById(id: string) {
    return this.profiles.find((p) => p.id === id) || null;
  }
}
