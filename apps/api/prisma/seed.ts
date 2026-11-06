import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env relative to current working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres@localhost:5433/corviin_hub?schema=public';

const isSsl = connectionString.includes('sslmode=') || connectionString.includes('supabase.com');
const pool = new Pool({
  connectionString,
  ssl: isSsl ? { rejectUnauthorized: false } : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Seeding CORVIIN HUB PostgreSQL Database ---');

  // 1. Workspaces
  const workspaces = [
    {
      id: 'ws-tech-0001-0000-000000000001',
      name: 'Corviin Tech',
      slug: 'corviin-tech',
      type: 'TECH',
      description:
        'Technology services, software development, and IT solutions workspace',
    },
    {
      id: 'ws-real-0002-0000-000000000002',
      name: 'Corviin Real Estate',
      slug: 'corviin-real-estate',
      type: 'REAL_ESTATE',
      description:
        'Real estate operations, property sales, and developer partnerships workspace',
    },
  ];

  for (const ws of workspaces) {
    await prisma.workspace.upsert({
      where: { id: ws.id },
      update: {
        name: ws.name,
        slug: ws.slug,
        type: ws.type,
        description: ws.description,
      },
      create: {
        id: ws.id,
        name: ws.name,
        slug: ws.slug,
        type: ws.type,
        description: ws.description,
      },
    });
    console.log(`✓ Seeded workspace: ${ws.name} (${ws.id})`);
  }

  // 2. Profiles
  const profiles = [
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      displayName: 'Anant',
      initials: 'A',
      email: 'anant@corviin.tech',
      phone: '+91-98450-11111',
      role: 'Full Stack & Tech Lead',
      status: 'ACTIVE',
      bio: 'Technical lead driving full-stack monorepo architecture, design systems, and API governance.',
      joinedAt: new Date('2026-01-01T00:00:00.000Z'),
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      displayName: 'Rohit',
      initials: 'R',
      email: 'rohit@corviin.realestate',
      phone: '+91-98765-43210',
      role: 'Partner Relations & Real Estate Lead',
      status: 'ACTIVE',
      bio: 'Leading developer relationships, RERA alignment, commercial inventory mandates, and brand partnerships.',
      joinedAt: new Date('2026-01-01T00:00:00.000Z'),
    },
    {
      id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      displayName: 'Utkarsh',
      initials: 'U',
      email: 'utkarsh@corviin.growth',
      phone: '+91-98801-23456',
      role: 'Buyer Relations & Growth Lead',
      status: 'ACTIVE',
      bio: 'Managing buyer consultations, property walkthrough allocations, and omnichannel campaign growth.',
      joinedAt: new Date('2026-01-01T00:00:00.000Z'),
    },
    {
      id: 'd4e5f6a7-b8c9-0123-def0-123456789013',
      displayName: 'Vikramaditya Rao',
      initials: 'VR',
      email: 'vikram@corviin.partner',
      phone: '+91-99440-55555',
      role: 'Specialist Advisor (Former)',
      status: 'INACTIVE',
      bio: 'External advisory role; retained for historical activity attribution.',
      joinedAt: new Date('2026-02-01T00:00:00.000Z'),
    },
  ];

  for (const prof of profiles) {
    await prisma.profile.upsert({
      where: { id: prof.id },
      update: {
        displayName: prof.displayName,
        initials: prof.initials,
        email: prof.email,
        phone: prof.phone,
        role: prof.role,
        status: prof.status,
        bio: prof.bio,
      },
      create: {
        id: prof.id,
        displayName: prof.displayName,
        initials: prof.initials,
        email: prof.email,
        phone: prof.phone,
        role: prof.role,
        status: prof.status,
        bio: prof.bio,
        joinedAt: prof.joinedAt,
      },
    });
    console.log(`✓ Seeded profile: ${prof.displayName} (${prof.id})`);
  }

  // 3. Workspace Memberships
  const memberships = [
    // Corviin Tech
    {
      workspaceId: 'ws-tech-0001-0000-000000000001',
      profileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      role: 'OWNER',
      status: 'ACTIVE',
    },
    {
      workspaceId: 'ws-tech-0001-0000-000000000001',
      profileId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
    {
      workspaceId: 'ws-tech-0001-0000-000000000001',
      profileId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      role: 'MEMBER',
      status: 'ACTIVE',
    },
    {
      workspaceId: 'ws-tech-0001-0000-000000000001',
      profileId: 'd4e5f6a7-b8c9-0123-def0-123456789013',
      role: 'ADVISOR',
      status: 'INACTIVE',
    },
    // Corviin Real Estate
    {
      workspaceId: 'ws-real-0002-0000-000000000002',
      profileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      role: 'OWNER',
      status: 'ACTIVE',
    },
    {
      workspaceId: 'ws-real-0002-0000-000000000002',
      profileId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      role: 'OWNER',
      status: 'ACTIVE',
    },
    {
      workspaceId: 'ws-real-0002-0000-000000000002',
      profileId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  ];

  for (const m of memberships) {
    await prisma.workspaceMembership.upsert({
      where: {
        workspaceId_profileId: {
          workspaceId: m.workspaceId,
          profileId: m.profileId,
        },
      },
      update: {
        role: m.role,
        status: m.status,
      },
      create: {
        workspaceId: m.workspaceId,
        profileId: m.profileId,
        role: m.role,
        status: m.status,
      },
    });
    console.log(`✓ Seeded membership: ${m.workspaceId} <-> ${m.profileId} (${m.role})`);
  }

  // 4. Personal Settings
  for (const prof of profiles) {
    await prisma.personalSettings.upsert({
      where: { profileId: prof.id },
      update: {
        displayName: prof.displayName,
        email: prof.email,
        phone: prof.phone,
        initials: prof.initials,
        bio: prof.bio,
        role: prof.role,
      },
      create: {
        profileId: prof.id,
        displayName: prof.displayName,
        email: prof.email,
        phone: prof.phone,
        initials: prof.initials,
        bio: prof.bio,
        role: prof.role,
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h',
        weekStartDay: 'MONDAY',
        defaultCalendarView: 'WEEK',
        theme: prof.id === 'c3d4e5f6-a7b8-9012-cdef-123456789012' ? 'dark' : 'light',
        notifications: {
          taskAssignments: true,
          deadlineReminders: true,
          overdueAlerts: true,
          campaignMilestones: true,
          meetingReminders: true,
          inAppChannel: true,
          pushChannel: false,
          emailChannel: true,
        },
      },
    });
    console.log(`✓ Seeded personal settings for: ${prof.displayName}`);
  }

  // 5. Workspace Settings
  const wsSettings = [
    {
      workspaceId: 'ws-tech-0001-0000-000000000001',
      workspaceName: 'Corviin Tech',
      slug: 'corviin-tech',
      type: 'TECH',
      primaryCurrency: 'INR',
      timeZone: 'Asia/Kolkata',
      defaultTaskPriority: 'MEDIUM',
      defaultTaskDueDays: 3,
      autoAssignCreator: true,
      allowedCategories: [
        'BUSINESS_CLIENT',
        'SOFTWARE_WEBSITE_ENQUIRY',
        'AUTOMATION_ENQUIRY',
        'POTENTIAL_PROJECT',
        'TECHNOLOGY_PARTNER',
        'EXISTING_CLIENT',
      ],
      allowedStages: [
        'NEW_ENQUIRY',
        'CONTACT_PENDING',
        'CONTACTED',
        'REQUIREMENT_DISCUSSION',
        'QUALIFIED',
        'PROPOSAL_QUOTATION',
        'NEGOTIATION',
        'WON_CLIENT',
        'LOST',
        'FOLLOW_UP_LATER',
      ],
      storageQuotaBytes: 10 * 1024 * 1024 * 1024, // 10 GB
      maxUploadSizeBytes: 50 * 1024 * 1024, // 50 MB
      allowedMimeTypes: [
        'image/png',
        'image/jpeg',
        'image/webp',
        'application/pdf',
        'video/mp4',
        'text/plain',
      ],
      alertChannelInApp: true,
      alertChannelEmail: true,
    },
    {
      workspaceId: 'ws-real-0002-0000-000000000002',
      workspaceName: 'Corviin Real Estate',
      slug: 'corviin-real-estate',
      type: 'REAL_ESTATE',
      primaryCurrency: 'INR',
      timeZone: 'Asia/Kolkata',
      defaultTaskPriority: 'MEDIUM',
      defaultTaskDueDays: 2,
      autoAssignCreator: true,
      allowedCategories: [
        'DEVELOPER',
        'BUILDER',
        'CONSTRUCTION_COMPANY',
        'LANDOWNER',
        'CHANNEL_PARTNER',
        'BROKER_AGENT',
        'OTHER_PARTNER',
      ],
      allowedStages: [
        'NEW_LEAD',
        'INITIAL_CONTACT',
        'MEETING_PLANNED',
        'REQUIREMENT_DISCUSSION',
        'PROPOSAL_SERVICE_DETAILS',
        'FOLLOW_UP_NEGOTIATION',
        'PARTNERSHIP_CONFIRMED',
        'ACTIVE_PARTNER',
        'LOST_NOT_INTERESTED',
        'FOLLOW_UP_LATER',
      ],
      storageQuotaBytes: 20 * 1024 * 1024 * 1024, // 20 GB
      maxUploadSizeBytes: 100 * 1024 * 1024, // 100 MB
      allowedMimeTypes: [
        'image/png',
        'image/jpeg',
        'image/webp',
        'application/pdf',
        'video/mp4',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      alertChannelInApp: true,
      alertChannelEmail: true,
    },
  ];

  for (const s of wsSettings) {
    await prisma.workspaceSettings.upsert({
      where: { workspaceId: s.workspaceId },
      update: {
        workspaceName: s.workspaceName,
        slug: s.slug,
        type: s.type,
        primaryCurrency: s.primaryCurrency,
        timeZone: s.timeZone,
        defaultTaskPriority: s.defaultTaskPriority,
        defaultTaskDueDays: s.defaultTaskDueDays,
        autoAssignCreator: s.autoAssignCreator,
        allowedCategories: s.allowedCategories,
        allowedStages: s.allowedStages,
        storageQuotaBytes: s.storageQuotaBytes,
        maxUploadSizeBytes: s.maxUploadSizeBytes,
        allowedMimeTypes: s.allowedMimeTypes,
        alertChannelInApp: s.alertChannelInApp,
        alertChannelEmail: s.alertChannelEmail,
      },
      create: s,
    });
    console.log(`✓ Seeded workspace settings for: ${s.workspaceName}`);
  }

  console.log('--- Database Seed Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

