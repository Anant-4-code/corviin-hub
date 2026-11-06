import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Optional,
} from '@nestjs/common';
import {
  CrmType,
  CrmInteractionType,
  CrmFollowUpStatus,
  TaskPriority,
  MeetingStatus,
  CrmRecordSummaryItem,
  CrmFollowUpItem,
  CrmInteractionItem,
  CrmOverviewResponseDto,
  TechCrmMetrics,
  RealEstateCrmMetrics,
  CrmSearchFilterDto,
  PaginatedCrmSearchResponseDto,
  CreateFollowUpDto,
  CompleteFollowUpDto,
  LogInteractionDto,
  QuickCreateCrmRecordDto,
  TechRecordCategory,
  TechPipelineStage,
  TechCrmRecord,
  TechStageHistoryEntry,
  TechProposalRef,
  TechProjectRef,
  TechCrmSummaryDto,
  TechCrmFilterDto,
  PaginatedTechRecordsResponseDto,
  CreateTechRecordDto,
  UpdateTechRecordDto,
  ChangeTechStageDto,
  ConvertWonToClientDto,
  CheckDuplicatesDto,
  DuplicateMatchResult,
  CreateTechLinkedTaskDto,
  AddTechProposalDto,
  RealEstatePartnerType,
  RealEstatePartnerStage,
  PartnerProjectRef,
  PartnerStageHistoryEntry,
  RealEstatePartnerRecord,
  PartnerCrmSummaryDto,
  PartnerCrmFilterDto,
  PaginatedPartnerRecordsResponseDto,
  CreatePartnerRecordDto,
  UpdatePartnerRecordDto,
  ChangePartnerStageDto,
  ConfirmOrActivatePartnerDto,
  AddPartnerProjectDto,
  CreatePartnerLinkedTaskDto,
  SchedulePartnerMeetingDto,
  CheckPartnerDuplicatesDto,
  PartnerDuplicateMatchResult,
  RealEstateBuyerStage,
  BuyerPropertyConfiguration,
  BuyerPropertyType,
  BuyerBuyingTimeline,
  BuyerPurchasePurpose,
  BuyerSharedPropertyRef,
  BuyerStageHistoryEntry,
  RealEstateBuyerRecord,
  BuyerCrmSummaryDto,
  BuyerCrmFilterDto,
  PaginatedBuyerRecordsResponseDto,
  CreateBuyerRecordDto,
  UpdateBuyerRecordDto,
  ChangeBuyerStageDto,
  ScheduleBuyerSiteVisitDto,
  ShareBuyerPropertyDto,
  CreateBuyerLinkedTaskDto,
  CheckBuyerDuplicatesDto,
  BuyerDuplicateMatchResult,
  SiteVisitItem,
} from '@corviin-hub/shared';
import { TasksService } from '../tasks/tasks.service';
import { MeetingsService } from '../meetings/meetings.service';

@Injectable()
export class CrmService {
  private records: CrmRecordSummaryItem[] = [];
  private followUps: CrmFollowUpItem[] = [];
  private interactions: CrmInteractionItem[] = [];
  private techRecords: TechCrmRecord[] = [];
  private partnerRecords: RealEstatePartnerRecord[] = [];
  private buyerRecords: RealEstateBuyerRecord[] = [];

  constructor(
    @Optional() private readonly tasksService?: TasksService,
    @Optional() private readonly meetingsService?: MeetingsService,
  ) {
    this.seedCrmData();
    this.seedTechData();
    this.seedPartnerData();
    this.seedBuyerData();
  }

  private seedCrmData() {
    const techWs = 'ws-tech-0001-0000-000000000001';
    const realWs = 'ws-real-0002-0000-000000000002';

    // ==========================================
    // 1. CORVIIN TECH CRM SEEDS
    // ==========================================
    this.records.push(
      {
        id: 'crm-tech-001',
        workspaceId: techWs,
        type: CrmType.TECH_LEAD,
        name: 'Acme Financial Systems',
        company: 'Acme Corp FinTech',
        phone: '+91 98201 12345',
        email: 'rajesh.k@acmefin.com',
        stage: 'Proposal/Quotation',
        assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        assignedMemberName: 'Anant',
        nextFollowUpDate: '2026-11-06T11:00:00.000Z',
        nextFollowUpTitle: 'Review security compliance clause in proposal draft',
        lastActivityDate: '2026-11-04T16:30:00.000Z',
        requirementSummary: 'Cloud infrastructure migration and microservices audit for core ledger',
        estimatedValue: 450000,
        tags: ['fintech', 'cloud', 'enterprise'],
        createdAt: '2026-10-25T10:00:00.000Z',
        updatedAt: '2026-11-04T16:30:00.000Z',
      },
      {
        id: 'crm-tech-002',
        workspaceId: techWs,
        type: CrmType.TECH_LEAD,
        name: 'HealthFlow Telemedicine Labs',
        company: 'HealthFlow Pvt Ltd',
        phone: '+91 98202 23456',
        email: 'priya.sharma@healthflow.io',
        stage: 'Requirement Discussion',
        assignedMemberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        assignedMemberName: 'Rohit',
        nextFollowUpDate: '2026-11-07T14:00:00.000Z',
        nextFollowUpTitle: 'Present mobile architecture breakdown and API specs',
        lastActivityDate: '2026-11-03T11:15:00.000Z',
        requirementSummary: 'HIPAA-compliant React Native tele-consultation app with live video calling',
        estimatedValue: 850000,
        tags: ['healthtech', 'mobile', 'react-native'],
        createdAt: '2026-10-28T09:00:00.000Z',
        updatedAt: '2026-11-03T11:15:00.000Z',
      },
      {
        id: 'crm-tech-003',
        workspaceId: techWs,
        type: CrmType.TECH_LEAD,
        name: 'LogiCore Supply Chain',
        company: 'LogiCore Logistics',
        phone: '+91 98203 34567',
        email: 'arun.patel@logicore.com',
        stage: 'New Enquiry',
        assignedMemberId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        assignedMemberName: 'Utkarsh',
        nextFollowUpDate: '2026-11-05T16:00:00.000Z',
        nextFollowUpTitle: 'Discovery call to clarify warehouse barcode scanning scope',
        lastActivityDate: '2026-11-05T09:00:00.000Z',
        requirementSummary: 'Automated warehouse dispatch and vehicle telematics dashboard',
        estimatedValue: 300000,
        tags: ['logistics', 'automation', 'new'],
        createdAt: '2026-11-05T09:00:00.000Z',
        updatedAt: '2026-11-05T09:00:00.000Z',
      },
      {
        id: 'crm-tech-004',
        workspaceId: techWs,
        type: CrmType.TECH_CLIENT,
        name: 'Apex Retail Group',
        company: 'Apex Retail India Ltd',
        phone: '+91 98204 45678',
        email: 'karan.v@apexretail.in',
        stage: 'Active Client Retainer',
        assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        assignedMemberName: 'Anant',
        lastActivityDate: '2026-11-02T15:00:00.000Z',
        requirementSummary: 'Full-stack e-commerce optimization, payment gateway redundancy and SLA support',
        estimatedValue: 120000, // Monthly retainer
        tags: ['retail', 'retainer', 'client'],
        createdAt: '2026-09-01T10:00:00.000Z',
        updatedAt: '2026-11-02T15:00:00.000Z',
      },
      {
        id: 'crm-tech-005',
        workspaceId: techWs,
        type: CrmType.TECH_PARTNER,
        name: 'CloudScale DevOps Consultancy',
        company: 'CloudScale Technologies',
        phone: '+91 98205 56789',
        email: 'alliances@cloudscale.net',
        stage: 'Active Tech Alliance',
        assignedMemberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        assignedMemberName: 'Rohit',
        lastActivityDate: '2026-10-30T14:00:00.000Z',
        requirementSummary: 'Kubernetes deployment referral partner with reciprocal client billing',
        tags: ['partner', 'devops', 'referral'],
        createdAt: '2026-08-15T10:00:00.000Z',
        updatedAt: '2026-10-30T14:00:00.000Z',
      },
    );

    // Follow-ups for Tech
    this.followUps.push(
      {
        id: 'fup-tech-1',
        workspaceId: techWs,
        recordId: 'crm-tech-001',
        recordType: CrmType.TECH_LEAD,
        recordTitle: 'Acme Financial Systems',
        title: 'Review security compliance clause in proposal draft',
        assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        assignedMemberName: 'Anant',
        dueDate: '2026-11-06T11:00:00.000Z',
        status: CrmFollowUpStatus.PENDING,
        priority: TaskPriority.HIGH,
        createdAt: '2026-11-04T10:00:00.000Z',
        updatedAt: '2026-11-04T10:00:00.000Z',
      },
      {
        id: 'fup-tech-2',
        workspaceId: techWs,
        recordId: 'crm-tech-003',
        recordType: CrmType.TECH_LEAD,
        recordTitle: 'LogiCore Supply Chain',
        title: 'Discovery call to clarify warehouse barcode scanning scope',
        assignedMemberId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        assignedMemberName: 'Utkarsh',
        dueDate: '2026-11-05T16:00:00.000Z',
        status: CrmFollowUpStatus.PENDING,
        priority: TaskPriority.URGENT,
        createdAt: '2026-11-05T09:00:00.000Z',
        updatedAt: '2026-11-05T09:00:00.000Z',
      },
    );

    // Tech Interactions
    this.interactions.push(
      {
        id: 'int-tech-1',
        workspaceId: techWs,
        recordId: 'crm-tech-001',
        recordType: CrmType.TECH_LEAD,
        type: CrmInteractionType.CALL,
        title: 'Phone Consultation with Rajesh (CTO)',
        description: 'Discussed AWS architecture diagrams and agreed to incorporate multi-region failover into proposal.',
        actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        actorName: 'Anant',
        timestamp: '2026-11-04T16:30:00.000Z',
      },
      {
        id: 'int-tech-2',
        workspaceId: techWs,
        recordId: 'crm-tech-002',
        recordType: CrmType.TECH_LEAD,
        type: CrmInteractionType.NOTE,
        title: 'Scope Clarification Note',
        description: 'Client confirmed budget cap is 9 Lakhs INR. They require offline sync support for doctor notes.',
        actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        actorName: 'Rohit',
        timestamp: '2026-11-03T11:15:00.000Z',
      },
    );

    // ==========================================
    // 2. CORVIIN REAL ESTATE CRM SEEDS
    // ==========================================
    this.records.push(
      {
        id: 'crm-re-001',
        workspaceId: realWs,
        type: CrmType.RE_PARTNER,
        name: 'Skyline Developers Pvt Ltd',
        company: 'Skyline Group',
        phone: '+91 99301 11223',
        email: 'sanjay.m@skylinedev.com',
        stage: 'Due Diligence & Mandate',
        assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        assignedMemberName: 'Anant',
        nextFollowUpDate: '2026-11-06T15:00:00.000Z',
        nextFollowUpTitle: 'Present marketing mandate draft for Emerald Heights Phase 2',
        lastActivityDate: '2026-11-04T14:00:00.000Z',
        requirementSummary: 'Exclusive sales mandate & 3D visualization campaign for 45 luxury villas',
        projectOrLocation: 'Emerald Heights, Alibaug',
        estimatedValue: 2500000,
        tags: ['developer', 'luxury-villas', 'mandate'],
        createdAt: '2026-10-10T10:00:00.000Z',
        updatedAt: '2026-11-04T14:00:00.000Z',
      },
      {
        id: 'crm-re-002',
        workspaceId: realWs,
        type: CrmType.RE_PARTNER,
        name: 'Prestige Land Holdings',
        company: 'Prestige Group Pune',
        phone: '+91 99302 22334',
        email: 'land@prestigeland.com',
        stage: 'Initial Land Discussion',
        assignedMemberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        assignedMemberName: 'Rohit',
        nextFollowUpDate: '2026-11-08T10:30:00.000Z',
        nextFollowUpTitle: 'Review title search report and FSI valuation with legal team',
        lastActivityDate: '2026-11-03T16:00:00.000Z',
        requirementSummary: 'Joint venture development on 15-acre plot in North Pune',
        projectOrLocation: 'North Pune Expressway Corridor',
        estimatedValue: 12000000,
        tags: ['land', 'jv', 'development'],
        createdAt: '2026-10-18T10:00:00.000Z',
        updatedAt: '2026-11-03T16:00:00.000Z',
      },
      {
        id: 'crm-re-003',
        workspaceId: realWs,
        type: CrmType.RE_BUYER,
        name: 'Vikram Malhotra',
        phone: '+91 99304 44556',
        email: 'vikram.m@gmail.com',
        stage: 'Site Visit Scheduled',
        assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        assignedMemberName: 'Anant',
        nextFollowUpDate: '2026-11-06T10:00:00.000Z',
        nextFollowUpTitle: 'Coordinate private chauffeur escort for Emerald Heights Villa 12 walkthrough',
        lastActivityDate: '2026-11-04T17:00:00.000Z',
        requirementSummary: '3BHK or 4BHK private pool luxury villa with mountain view',
        projectOrLocation: 'Emerald Heights, Villa 12',
        estimatedValue: 35000000, // 3.5 Cr
        tags: ['buyer', 'hni', 'villa-walkthrough'],
        createdAt: '2026-10-20T11:00:00.000Z',
        updatedAt: '2026-11-04T17:00:00.000Z',
      },
      {
        id: 'crm-re-004',
        workspaceId: realWs,
        type: CrmType.RE_BUYER,
        name: 'Pooja Sharma',
        phone: '+91 99305 55667',
        email: 'pooja.sharma@outlook.com',
        stage: 'Negotiation & Unit Hold',
        assignedMemberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        assignedMemberName: 'Rohit',
        nextFollowUpDate: '2026-11-07T11:30:00.000Z',
        nextFollowUpTitle: 'Send payment schedule and token receipt for Unit 1402',
        lastActivityDate: '2026-11-04T12:00:00.000Z',
        requirementSummary: '2BHK high-rise corner apartment with east-facing balcony',
        projectOrLocation: 'Serene Towers, Unit 1402',
        estimatedValue: 18000000, // 1.8 Cr
        tags: ['buyer', 'token-pending', 'apartment'],
        createdAt: '2026-10-25T14:00:00.000Z',
        updatedAt: '2026-11-04T12:00:00.000Z',
      },
      {
        id: 'crm-re-005',
        workspaceId: realWs,
        type: CrmType.RE_BUYER,
        name: 'Dr. Sameer Joshi',
        phone: '+91 99306 66778',
        email: 'sameer.joshi@mednet.org',
        stage: 'New Enquiry',
        assignedMemberId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        assignedMemberName: 'Utkarsh',
        nextFollowUpDate: '2026-11-05T17:00:00.000Z',
        nextFollowUpTitle: 'Call to introduce Emerald Heights floorplans and understand timeline',
        lastActivityDate: '2026-11-05T10:00:00.000Z',
        requirementSummary: 'Penthouse or duplex with rooftop deck for family residence',
        projectOrLocation: 'Emerald Heights',
        estimatedValue: 50000000, // 5 Cr
        tags: ['buyer', 'hni', 'penthouse'],
        createdAt: '2026-11-05T10:00:00.000Z',
        updatedAt: '2026-11-05T10:00:00.000Z',
      },
    );

    // Follow-ups for Real Estate
    this.followUps.push(
      {
        id: 'fup-re-1',
        workspaceId: realWs,
        recordId: 'crm-re-003',
        recordType: CrmType.RE_BUYER,
        recordTitle: 'Vikram Malhotra',
        title: 'Coordinate private chauffeur escort for Emerald Heights Villa 12 walkthrough',
        assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        assignedMemberName: 'Anant',
        dueDate: '2026-11-06T10:00:00.000Z',
        status: CrmFollowUpStatus.PENDING,
        priority: TaskPriority.HIGH,
        createdAt: '2026-11-04T17:00:00.000Z',
        updatedAt: '2026-11-04T17:00:00.000Z',
      },
      {
        id: 'fup-re-2',
        workspaceId: realWs,
        recordId: 'crm-re-005',
        recordType: CrmType.RE_BUYER,
        recordTitle: 'Dr. Sameer Joshi',
        title: 'Call to introduce Emerald Heights floorplans and understand timeline',
        assignedMemberId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        assignedMemberName: 'Utkarsh',
        dueDate: '2026-11-05T17:00:00.000Z',
        status: CrmFollowUpStatus.PENDING,
        priority: TaskPriority.URGENT,
        createdAt: '2026-11-05T10:00:00.000Z',
        updatedAt: '2026-11-05T10:00:00.000Z',
      },
    );

    // Real Estate Interactions
    this.interactions.push(
      {
        id: 'int-re-1',
        workspaceId: realWs,
        recordId: 'crm-re-003',
        recordType: CrmType.RE_BUYER,
        type: CrmInteractionType.SITE_VISIT,
        title: 'Site Visit Confirmed for Villa 12',
        description: 'Buyer confirmed Friday 10:00 AM walkthrough with family. Requested developer lead to be present.',
        actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        actorName: 'Anant',
        timestamp: '2026-11-04T17:00:00.000Z',
      },
      {
        id: 'int-re-2',
        workspaceId: realWs,
        recordId: 'crm-re-001',
        recordType: CrmType.RE_PARTNER,
        type: CrmInteractionType.MEETING,
        title: 'Executive Partnership Meeting',
        description: 'Met with Skyline Managing Director. Commission structure finalized at 2.5% on sole-selling mandate.',
        actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        actorName: 'Anant',
        timestamp: '2026-11-04T14:00:00.000Z',
      },
    );
  }

  // ==========================================
  // PHONE NORMALIZATION HELPER
  // ==========================================
  public normalizePhone(phone: string): string {
    return (phone || '').replace(/[^0-9]/g, '');
  }

  // ==========================================
  // CRM OVERVIEW QUERY (Section 2)
  // ==========================================
  getOverview(workspaceId: string): CrmOverviewResponseDto {
    if (!workspaceId) {
      throw new BadRequestException('Workspace ID is required.');
    }

    const techWs = 'ws-tech-0001-0000-000000000001';
    const isTech = workspaceId === techWs;

    const workspaceRecords = this.records.filter((r) => r.workspaceId === workspaceId);
    const workspaceFollowUps = this.followUps.filter((f) => f.workspaceId === workspaceId);
    const workspaceInteractions = this.interactions.filter((i) => i.workspaceId === workspaceId);

    // Compute metrics
    let techMetrics: TechCrmMetrics | undefined;
    let realEstateMetrics: RealEstateCrmMetrics | undefined;

    if (isTech) {
      techMetrics = {
        openEnquiriesCount: workspaceRecords.filter((r) => r.type === CrmType.TECH_LEAD).length,
        qualifiedLeadsCount: workspaceRecords.filter(
          (r) => r.type === CrmType.TECH_LEAD && ['Requirement Discussion', 'Qualified'].includes(r.stage),
        ).length,
        proposalsOutCount: workspaceRecords.filter(
          (r) => r.type === CrmType.TECH_LEAD && r.stage === 'Proposal/Quotation',
        ).length,
        activeClientsCount: workspaceRecords.filter((r) => r.type === CrmType.TECH_CLIENT).length,
        techPartnersCount: workspaceRecords.filter((r) => r.type === CrmType.TECH_PARTNER).length,
        pendingFollowUpsCount: workspaceFollowUps.filter((f) => f.status === CrmFollowUpStatus.PENDING).length,
        overdueFollowUpsCount: workspaceFollowUps.filter(
          (f) => f.status === CrmFollowUpStatus.PENDING && new Date(f.dueDate) < new Date(),
        ).length,
      };
    } else {
      realEstateMetrics = {
        activeDevelopersCount: workspaceRecords.filter((r) => r.type === CrmType.RE_PARTNER).length,
        channelPartnersCount: workspaceRecords.filter(
          (r) => r.type === CrmType.RE_PARTNER && r.stage.includes('Channel'),
        ).length,
        activeBuyersCount: workspaceRecords.filter((r) => r.type === CrmType.RE_BUYER).length,
        siteVisitsPendingCount: workspaceRecords.filter(
          (r) => r.type === CrmType.RE_BUYER && r.stage.includes('Site Visit'),
        ).length,
        pendingFollowUpsCount: workspaceFollowUps.filter((f) => f.status === CrmFollowUpStatus.PENDING).length,
        overdueFollowUpsCount: workspaceFollowUps.filter(
          (f) => f.status === CrmFollowUpStatus.PENDING && new Date(f.dueDate) < new Date(),
        ).length,
      };
    }

    return {
      workspaceId,
      workspaceType: isTech ? 'TECH' : 'REAL_ESTATE',
      techMetrics,
      realEstateMetrics,
      recentRecords: workspaceRecords.slice(0, 10),
      upcomingFollowUps: workspaceFollowUps.filter((f) => f.status === CrmFollowUpStatus.PENDING),
      recentInteractions: workspaceInteractions.slice(0, 10),
    };
  }

  // ==========================================
  // GLOBAL CRM SEARCH (Section 3 & 4)
  // ==========================================
  search(workspaceId: string, filterDto?: CrmSearchFilterDto): PaginatedCrmSearchResponseDto {
    if (!workspaceId) {
      throw new BadRequestException('Workspace ID is required.');
    }

    let items = this.records.filter((r) => r.workspaceId === workspaceId);

    if (filterDto?.query && filterDto.query.trim()) {
      const q = filterDto.query.trim().toLowerCase();
      const normalizedQ = this.normalizePhone(filterDto.query.trim());

      items = items.filter((r) => {
        const nameMatch = r.name.toLowerCase().includes(q);
        const compMatch = r.company ? r.company.toLowerCase().includes(q) : false;
        const emailMatch = r.email ? r.email.toLowerCase().includes(q) : false;
        const reqMatch = r.requirementSummary.toLowerCase().includes(q);
        const projMatch = r.projectOrLocation ? r.projectOrLocation.toLowerCase().includes(q) : false;

        // Phone search with normalization
        const phoneMatch = normalizedQ.length >= 3 && this.normalizePhone(r.phone).includes(normalizedQ);

        return nameMatch || compMatch || emailMatch || reqMatch || projMatch || phoneMatch;
      });
    }

    if (filterDto?.recordType) {
      items = items.filter((r) => r.type === filterDto.recordType);
    }

    if (filterDto?.stage) {
      items = items.filter((r) => r.stage.toLowerCase() === filterDto.stage!.toLowerCase());
    }

    if (filterDto?.assignedMemberId) {
      items = items.filter((r) => r.assignedMemberId === filterDto.assignedMemberId);
    }

    const total = items.length;
    const page = Math.max(1, Number(filterDto?.page) || 1);
    const pageSize = Math.max(1, Math.min(100, Number(filterDto?.pageSize) || 20));
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  // ==========================================
  // QUICK CREATE CRM RECORD (Section 2 & 10)
  // ==========================================
  createQuickRecord(workspaceId: string, dto: QuickCreateCrmRecordDto): CrmRecordSummaryItem {
    if (!workspaceId) {
      throw new BadRequestException('Workspace ID is required.');
    }

    if (!dto.name || !dto.name.trim()) {
      throw new BadRequestException('Contact / Lead name is required.');
    }

    if (!dto.phone || !dto.phone.trim()) {
      throw new BadRequestException('Valid phone number is required for CRM contact.');
    }

    const techWs = 'ws-tech-0001-0000-000000000001';
    const isTech = workspaceId === techWs;

    // Enforce workspace-permitted record types
    if (isTech && (dto.type === CrmType.RE_BUYER || dto.type === CrmType.RE_PARTNER)) {
      throw new BadRequestException('Corviin Tech workspace only accepts Tech Leads, Clients, or Tech Partners.');
    }
    if (!isTech && (dto.type === CrmType.TECH_LEAD || dto.type === CrmType.TECH_CLIENT || dto.type === CrmType.TECH_PARTNER)) {
      throw new BadRequestException('Corviin Real Estate workspace only accepts Real Estate Buyers or Developers/Partners.');
    }

    // Default stage per record type
    let defaultStage = 'New Enquiry';
    if (dto.type === CrmType.TECH_CLIENT) defaultStage = 'Onboarding';
    else if (dto.type === CrmType.TECH_PARTNER) defaultStage = 'Partnership Discussion';
    else if (dto.type === CrmType.RE_PARTNER) defaultStage = 'Initial Partner Lead';
    else if (dto.type === CrmType.RE_BUYER) defaultStage = 'New Enquiry';

    const now = new Date().toISOString();
    const id = `crm-${dto.type.toLowerCase().replace(/_/g, '-')}-${Date.now().toString(36)}`;

    const newRecord: CrmRecordSummaryItem = {
      id,
      workspaceId,
      type: dto.type,
      name: dto.name.trim(),
      company: dto.company ? dto.company.trim() : undefined,
      phone: dto.phone.trim(),
      email: dto.email ? dto.email.trim() : undefined,
      stage: defaultStage,
      assignedMemberId: dto.assignedMemberId || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      assignedMemberName: dto.assignedMemberName || 'Anant',
      lastActivityDate: now,
      requirementSummary: dto.requirementSummary?.trim() || 'Requirement to be captured during discovery.',
      estimatedValue: dto.estimatedValue,
      projectOrLocation: dto.projectOrLocation?.trim(),
      createdAt: now,
      updatedAt: now,
    };

    this.records.unshift(newRecord);

    // Initial timeline entry
    this.interactions.unshift({
      id: `int-${Date.now().toString(36)}`,
      workspaceId,
      recordId: id,
      recordType: dto.type,
      type: CrmInteractionType.NOTE,
      title: 'Record Created',
      description: dto.notes?.trim() || `New ${dto.type} record created in workspace.`,
      actorId: dto.assignedMemberId || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      actorName: dto.assignedMemberName || 'Anant',
      timestamp: now,
    });

    return newRecord;
  }

  // ==========================================
  // STRUCTURED FOLLOW-UPS (Section 7)
  // ==========================================
  getFollowUps(workspaceId: string, status?: CrmFollowUpStatus): CrmFollowUpItem[] {
    if (!workspaceId) {
      throw new BadRequestException('Workspace ID is required.');
    }

    let items = this.followUps.filter((f) => f.workspaceId === workspaceId);
    if (status) {
      items = items.filter((f) => f.status === status);
    }
    return items.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  createFollowUp(workspaceId: string, dto: CreateFollowUpDto): CrmFollowUpItem {
    if (!workspaceId) {
      throw new BadRequestException('Workspace ID is required.');
    }

    if (!dto.recordId || !dto.title.trim()) {
      throw new BadRequestException('Record ID and follow-up title are required.');
    }

    const record = this.records.find((r) => r.id === dto.recordId);
    if (!record) {
      throw new NotFoundException(`CRM Record #${dto.recordId} not found.`);
    }

    if (record.workspaceId !== workspaceId) {
      throw new ForbiddenException(`Record #${dto.recordId} belongs to a different workspace.`);
    }

    const now = new Date().toISOString();
    const id = `fup-${Date.now().toString(36)}`;

    const newFollowUp: CrmFollowUpItem = {
      id,
      workspaceId,
      recordId: record.id,
      recordType: record.type,
      recordTitle: record.name,
      title: dto.title.trim(),
      assignedMemberId: dto.assignedMemberId || record.assignedMemberId,
      assignedMemberName: dto.assignedMemberName || record.assignedMemberName,
      dueDate: dto.dueDate,
      status: CrmFollowUpStatus.PENDING,
      priority: dto.priority || TaskPriority.MEDIUM,
      createdAt: now,
      updatedAt: now,
    };

    this.followUps.unshift(newFollowUp);

    // Update parent record next follow-up cache
    record.nextFollowUpDate = dto.dueDate;
    record.nextFollowUpTitle = dto.title.trim();
    record.lastActivityDate = now;
    record.updatedAt = now;

    // Log interaction
    this.interactions.unshift({
      id: `int-${Date.now().toString(36)}`,
      workspaceId,
      recordId: record.id,
      recordType: record.type,
      type: CrmInteractionType.FOLLOW_UP,
      title: 'Follow-up Scheduled',
      description: dto.title.trim(),
      actorId: dto.assignedMemberId || record.assignedMemberId,
      actorName: dto.assignedMemberName || record.assignedMemberName,
      timestamp: now,
    });

    return newFollowUp;
  }

  completeFollowUp(workspaceId: string, id: string, dto: CompleteFollowUpDto): CrmFollowUpItem {
    if (!workspaceId) {
      throw new BadRequestException('Workspace ID is required.');
    }

    const followUp = this.followUps.find((f) => f.id === id);
    if (!followUp) {
      throw new NotFoundException(`Follow-up #${id} not found.`);
    }

    if (followUp.workspaceId !== workspaceId) {
      throw new ForbiddenException(`Follow-up #${id} belongs to a different workspace.`);
    }

    const now = new Date().toISOString();
    followUp.status = CrmFollowUpStatus.COMPLETED;
    followUp.completedAt = now;
    followUp.completedBy = dto.completedBy || 'Acting Profile';
    followUp.completionNotes = dto.completionNotes?.trim();
    followUp.updatedAt = now;

    // Log interaction on CRM record
    this.interactions.unshift({
      id: `int-${Date.now().toString(36)}`,
      workspaceId,
      recordId: followUp.recordId,
      recordType: followUp.recordType,
      type: CrmInteractionType.FOLLOW_UP,
      title: 'Follow-up Completed',
      description: dto.completionNotes?.trim() || `Completed follow-up: ${followUp.title}`,
      actorId: followUp.assignedMemberId,
      actorName: dto.completedBy || followUp.assignedMemberName,
      timestamp: now,
    });

    return followUp;
  }

  // ==========================================
  // LOG INTERACTION (Section 8)
  // ==========================================
  logInteraction(workspaceId: string, dto: LogInteractionDto): CrmInteractionItem {
    if (!workspaceId) {
      throw new BadRequestException('Workspace ID is required.');
    }

    const record = this.records.find((r) => r.id === dto.recordId);
    if (!record) {
      throw new NotFoundException(`CRM Record #${dto.recordId} not found.`);
    }

    if (record.workspaceId !== workspaceId) {
      throw new ForbiddenException(`Record #${dto.recordId} belongs to a different workspace.`);
    }

    const now = new Date().toISOString();
    const interaction: CrmInteractionItem = {
      id: `int-${Date.now().toString(36)}`,
      workspaceId,
      recordId: record.id,
      recordType: record.type,
      type: dto.type,
      title: dto.title.trim(),
      description: dto.description?.trim(),
      actorId: dto.actorId || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      actorName: dto.actorName || 'Acting Profile',
      timestamp: now,
      metadata: dto.metadata,
    };

    this.interactions.unshift(interaction);
    record.lastActivityDate = now;
    record.updatedAt = now;

    return interaction;
  }

  // ==========================================
  // CORVIIN TECH CRM IMPLEMENTATION (Feature 11)
  // ==========================================

  private validateTechWorkspace(workspaceId: string): void {
    if (!workspaceId) {
      throw new BadRequestException('Workspace ID is required.');
    }
    const isTech =
      workspaceId === 'ws-tech-0001-0000-000000000001' ||
      workspaceId.toLowerCase().includes('tech');
    if (!isTech) {
      throw new ForbiddenException(
        'Tech CRM is only accessible within the Corviin Tech workspace. Current workspace is isolated.',
      );
    }
  }

  private seedTechData() {
    const techWs = 'ws-tech-0001-0000-000000000001';

    this.techRecords = [
      {
        id: 'crm-tech-001',
        workspaceId: techWs,
        name: 'Rajesh Kumar',
        company: 'Acme Corp FinTech',
        phone: '+91 98201 12345',
        email: 'rajesh.k@acmefin.com',
        category: TechRecordCategory.POTENTIAL_PROJECT,
        stage: TechPipelineStage.PROPOSAL_QUOTATION,
        source: 'Referral',
        assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        assignedMemberName: 'Anant',
        serviceType: 'CLOUD_DEVOPS',
        requirementSummary: 'Cloud infrastructure migration and microservices audit for core ledger',
        detailedRequirements:
          'Migrate on-premise Oracle DB to AWS Aurora PostgreSQL, configure Kubernetes cluster with Terraform and implement zero-downtime blue/green deployment.',
        estimatedBudget: 450000,
        businessType: 'FinTech / Core Banking',
        website: 'https://acmefintech.in',
        location: 'Bandra Kurla Complex, Mumbai',
        stageHistory: [
          {
            stage: TechPipelineStage.NEW_ENQUIRY,
            timestamp: '2026-10-25T10:00:00.000Z',
            actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            actorName: 'Anant',
            notes: 'Initial referral from Angel Investor network',
          },
          {
            stage: TechPipelineStage.CONTACTED,
            timestamp: '2026-10-26T11:00:00.000Z',
            actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            actorName: 'Anant',
            notes: 'Brief telephone call with Rajesh',
          },
          {
            stage: TechPipelineStage.REQUIREMENT_DISCUSSION,
            timestamp: '2026-10-29T15:00:00.000Z',
            actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            actorName: 'Anant',
            notes: 'Technical scoping session on Zoom',
          },
          {
            stage: TechPipelineStage.QUALIFIED,
            timestamp: '2026-11-01T14:00:00.000Z',
            actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            actorName: 'Anant',
            notes: 'Budget and timeline approved by executive committee',
          },
          {
            stage: TechPipelineStage.PROPOSAL_QUOTATION,
            timestamp: '2026-11-04T16:00:00.000Z',
            actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            actorName: 'Anant',
            notes: 'Commercial proposal sent for ₹4.5 Lakhs',
          },
        ],
        proposals: [
          {
            id: 'prop-1',
            title: 'Corviin Cloud Architecture Proposal v1.2',
            amount: 450000,
            status: 'SENT',
            sentAt: '2026-11-04T16:00:00.000Z',
            referenceUrl: 'https://docs.corviin.tech/proposals/acme-fintech-v1.pdf',
          },
        ],
        nextFollowUpDate: '2026-11-06T11:00:00.000Z',
        nextFollowUpTitle: 'Review security compliance clause in proposal draft',
        lastActivityDate: '2026-11-04T16:30:00.000Z',
        attachments: [],
        createdAt: '2026-10-25T10:00:00.000Z',
        updatedAt: '2026-11-04T16:30:00.000Z',
      },
      {
        id: 'crm-tech-002',
        workspaceId: techWs,
        name: 'Dr. Priya Sharma',
        company: 'HealthFlow Telemedicine Labs',
        phone: '+91 98202 23456',
        email: 'priya.sharma@healthflow.io',
        category: TechRecordCategory.SOFTWARE_WEBSITE_ENQUIRY,
        stage: TechPipelineStage.REQUIREMENT_DISCUSSION,
        source: 'Website',
        assignedMemberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        assignedMemberName: 'Rohit',
        serviceType: 'MOBILE_APP',
        requirementSummary: 'HIPAA-compliant React Native tele-consultation app with live video calling',
        detailedRequirements:
          'Patient mobile app (iOS & Android) with WebRTC video calling, prescription generation, appointment slot booking, and Razorpay payment integration.',
        estimatedBudget: 850000,
        businessType: 'HealthTech',
        website: 'https://healthflow.io',
        location: 'Indiranagar, Bengaluru',
        stageHistory: [
          {
            stage: TechPipelineStage.NEW_ENQUIRY,
            timestamp: '2026-10-28T09:00:00.000Z',
            actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            actorName: 'Rohit',
            notes: 'Form submission on landing page',
          },
          {
            stage: TechPipelineStage.CONTACTED,
            timestamp: '2026-10-30T10:30:00.000Z',
            actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            actorName: 'Rohit',
            notes: 'Introductory call via WhatsApp Audio',
          },
          {
            stage: TechPipelineStage.REQUIREMENT_DISCUSSION,
            timestamp: '2026-11-03T11:15:00.000Z',
            actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            actorName: 'Rohit',
            notes: 'Detailed feature checklist workshop',
          },
        ],
        nextFollowUpDate: '2026-11-07T14:00:00.000Z',
        nextFollowUpTitle: 'Present mobile architecture breakdown and API specs',
        lastActivityDate: '2026-11-03T11:15:00.000Z',
        attachments: [],
        createdAt: '2026-10-28T09:00:00.000Z',
        updatedAt: '2026-11-03T11:15:00.000Z',
      },
      {
        id: 'crm-tech-003',
        workspaceId: techWs,
        name: 'Arun Patel',
        company: 'LogiCore Supply Chain',
        phone: '+91 98203 34567',
        email: 'arun.patel@logicore.com',
        category: TechRecordCategory.AUTOMATION_ENQUIRY,
        stage: TechPipelineStage.NEW_ENQUIRY,
        source: 'LinkedIn',
        assignedMemberId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        assignedMemberName: 'Utkarsh',
        serviceType: 'AUTOMATION_AI',
        requirementSummary: 'Automated warehouse dispatch and vehicle telematics dashboard',
        detailedRequirements:
          'Automate order batching from Shopify and WooCommerce into regional dispatch routes; ingest GPS pings from vehicle IoT sensors.',
        estimatedBudget: 300000,
        businessType: 'Logistics / 3PL',
        website: 'https://logicore-logistics.in',
        location: 'Bhiwandi / Thane',
        stageHistory: [
          {
            stage: TechPipelineStage.NEW_ENQUIRY,
            timestamp: '2026-11-05T09:00:00.000Z',
            actorId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
            actorName: 'Utkarsh',
            notes: 'LinkedIn direct message inbound enquiry',
          },
        ],
        nextFollowUpDate: '2026-11-05T16:00:00.000Z',
        nextFollowUpTitle: 'Discovery call to clarify warehouse barcode scanning scope',
        lastActivityDate: '2026-11-05T09:00:00.000Z',
        attachments: [],
        createdAt: '2026-11-05T09:00:00.000Z',
        updatedAt: '2026-11-05T09:00:00.000Z',
      },
      {
        id: 'crm-tech-004',
        workspaceId: techWs,
        name: 'Karan Varma',
        company: 'Apex Retail India Ltd',
        phone: '+91 98204 45678',
        email: 'karan.v@apexretail.in',
        category: TechRecordCategory.EXISTING_CLIENT,
        stage: TechPipelineStage.WON_CLIENT,
        source: 'Referral',
        assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        assignedMemberName: 'Anant',
        serviceType: 'WEB_DEVELOPMENT',
        requirementSummary: 'Full-stack e-commerce optimization, payment gateway redundancy and SLA support',
        detailedRequirements:
          'Monthly engineering retainer for Next.js storefront performance tuning, zero-downtime sales events, and checkout conversion enhancement.',
        estimatedBudget: 120000,
        businessType: 'Retail / Omnichannel',
        website: 'https://apexretail.in',
        location: 'Lower Parel, Mumbai',
        stageHistory: [
          {
            stage: TechPipelineStage.NEW_ENQUIRY,
            timestamp: '2026-08-10T10:00:00.000Z',
            actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            actorName: 'Anant',
          },
          {
            stage: TechPipelineStage.QUALIFIED,
            timestamp: '2026-08-20T10:00:00.000Z',
            actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            actorName: 'Anant',
          },
          {
            stage: TechPipelineStage.PROPOSAL_QUOTATION,
            timestamp: '2026-08-25T10:00:00.000Z',
            actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            actorName: 'Anant',
          },
          {
            stage: TechPipelineStage.WON_CLIENT,
            timestamp: '2026-09-01T10:00:00.000Z',
            actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            actorName: 'Anant',
            notes: 'Master services agreement executed for 12 months.',
          },
        ],
        proposals: [
          {
            id: 'prop-apex-1',
            title: 'Annual Managed Engineering Retainer Agreement',
            amount: 1440000,
            status: 'ACCEPTED',
            sentAt: '2026-08-25T10:00:00.000Z',
          },
        ],
        projects: [
          {
            id: 'proj-apex-1',
            name: 'Q4 Peak Festive Concurrency Hardening',
            status: 'In Progress',
            startDate: '2026-10-01',
          },
        ],
        attachments: [],
        lastActivityDate: '2026-11-02T15:00:00.000Z',
        createdAt: '2026-08-10T10:00:00.000Z',
        updatedAt: '2026-11-02T15:00:00.000Z',
      },
      {
        id: 'crm-tech-005',
        workspaceId: techWs,
        name: 'Siddharth Mehta',
        company: 'CloudScale Technologies',
        phone: '+91 98205 56789',
        email: 'alliances@cloudscale.net',
        category: TechRecordCategory.TECHNOLOGY_PARTNER,
        stage: TechPipelineStage.WON_CLIENT,
        source: 'Partner',
        assignedMemberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        assignedMemberName: 'Rohit',
        serviceType: 'CLOUD_DEVOPS',
        requirementSummary: 'Kubernetes deployment referral partner with reciprocal client billing',
        stageHistory: [
          {
            stage: TechPipelineStage.NEW_ENQUIRY,
            timestamp: '2026-08-01T10:00:00.000Z',
            actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            actorName: 'Rohit',
          },
          {
            stage: TechPipelineStage.NEGOTIATION,
            timestamp: '2026-08-10T10:00:00.000Z',
            actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            actorName: 'Rohit',
          },
          {
            stage: TechPipelineStage.WON_CLIENT,
            timestamp: '2026-08-15T10:00:00.000Z',
            actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            actorName: 'Rohit',
            notes: 'Partner alliance MoU signed',
          },
        ],
        attachments: [],
        lastActivityDate: '2026-10-30T14:00:00.000Z',
        createdAt: '2026-08-01T10:00:00.000Z',
        updatedAt: '2026-10-30T14:00:00.000Z',
      },
      {
        id: 'crm-tech-006',
        workspaceId: techWs,
        name: 'Vikram Singhania',
        company: 'Singhania Real Estate Advisory',
        phone: '+91 98206 67890',
        email: 'vikram@singhania-advisory.com',
        category: TechRecordCategory.BUSINESS_CLIENT,
        stage: TechPipelineStage.FOLLOW_UP_LATER,
        source: 'Website',
        assignedMemberId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        assignedMemberName: 'Utkarsh',
        serviceType: 'CUSTOM_SOFTWARE',
        requirementSummary: 'Custom CRM and commission tracking software for luxury commercial brokers',
        detailedRequirements:
          'Multi-tier broker commission payout calculation and lead tracking portal.',
        estimatedBudget: 600000,
        followUpLaterDate: '2026-12-15T10:00:00.000Z',
        stageHistory: [
          {
            stage: TechPipelineStage.NEW_ENQUIRY,
            timestamp: '2026-09-15T10:00:00.000Z',
            actorId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
            actorName: 'Utkarsh',
          },
          {
            stage: TechPipelineStage.QUALIFIED,
            timestamp: '2026-09-22T10:00:00.000Z',
            actorId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
            actorName: 'Utkarsh',
          },
          {
            stage: TechPipelineStage.FOLLOW_UP_LATER,
            timestamp: '2026-10-05T10:00:00.000Z',
            actorId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
            actorName: 'Utkarsh',
            notes: 'Client paused project until Q1 FY27 budget allocation.',
          },
        ],
        attachments: [],
        lastActivityDate: '2026-10-05T10:00:00.000Z',
        createdAt: '2026-09-15T10:00:00.000Z',
        updatedAt: '2026-10-05T10:00:00.000Z',
      },
      {
        id: 'crm-tech-007',
        workspaceId: techWs,
        name: 'Deepak Chawla',
        company: 'Zenith EdTech',
        phone: '+91 98207 78901',
        email: 'deepak@zenithed.in',
        category: TechRecordCategory.SOFTWARE_WEBSITE_ENQUIRY,
        stage: TechPipelineStage.LOST,
        source: 'Inbound Call',
        assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        assignedMemberName: 'Anant',
        serviceType: 'WEB_DEVELOPMENT',
        requirementSummary: 'LMS student grading portal with video lectures',
        lostReason:
          'Decided to use off-the-shelf SaaS (Teachable/Kajabi) due to immediate launch timeline',
        stageHistory: [
          {
            stage: TechPipelineStage.NEW_ENQUIRY,
            timestamp: '2026-09-01T10:00:00.000Z',
            actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            actorName: 'Anant',
          },
          {
            stage: TechPipelineStage.LOST,
            timestamp: '2026-09-10T10:00:00.000Z',
            actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            actorName: 'Anant',
            notes: 'Lost to existing SaaS product',
          },
        ],
        attachments: [],
        lastActivityDate: '2026-09-10T10:00:00.000Z',
        createdAt: '2026-09-01T10:00:00.000Z',
        updatedAt: '2026-09-10T10:00:00.000Z',
      },
      {
        id: 'crm-tech-008',
        workspaceId: techWs,
        name: 'Neha Kapur',
        company: 'Kapur Fashion D2C',
        phone: '+91 98208 89012',
        email: 'neha@kapurfashion.com',
        category: TechRecordCategory.POTENTIAL_PROJECT,
        stage: TechPipelineStage.NEGOTIATION,
        source: 'Referral',
        assignedMemberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        assignedMemberName: 'Rohit',
        serviceType: 'WEB_DEVELOPMENT',
        requirementSummary: 'Headless Shopify storefront migration with custom 3D model viewer',
        detailedRequirements:
          'Migrate standard Shopify theme to Hydrogen/Oxygen headless store with Three.js 3D apparel preview.',
        estimatedBudget: 520000,
        stageHistory: [
          {
            stage: TechPipelineStage.NEW_ENQUIRY,
            timestamp: '2026-10-12T10:00:00.000Z',
            actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            actorName: 'Rohit',
          },
          {
            stage: TechPipelineStage.QUALIFIED,
            timestamp: '2026-10-20T10:00:00.000Z',
            actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            actorName: 'Rohit',
          },
          {
            stage: TechPipelineStage.PROPOSAL_QUOTATION,
            timestamp: '2026-10-28T10:00:00.000Z',
            actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            actorName: 'Rohit',
          },
          {
            stage: TechPipelineStage.NEGOTIATION,
            timestamp: '2026-11-04T10:00:00.000Z',
            actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            actorName: 'Rohit',
            notes: 'Discussing payment milestones (40/30/30)',
          },
        ],
        nextFollowUpDate: '2026-11-08T15:00:00.000Z',
        nextFollowUpTitle: 'Finalize milestone terms in revised contract',
        lastActivityDate: '2026-11-04T10:00:00.000Z',
        attachments: [],
        createdAt: '2026-10-12T10:00:00.000Z',
        updatedAt: '2026-11-04T10:00:00.000Z',
      },
    ];
  }

  // ==========================================
  // TECH SUMMARY & REPORTING (Section 9)
  // ==========================================
  getTechSummary(workspaceId: string): TechCrmSummaryDto {
    this.validateTechWorkspace(workspaceId);

    const records = this.techRecords.filter((r) => r.workspaceId === workspaceId);

    // Initialise stage map
    const enquiriesByStage: Record<TechPipelineStage, number> = {
      [TechPipelineStage.NEW_ENQUIRY]: 0,
      [TechPipelineStage.CONTACT_PENDING]: 0,
      [TechPipelineStage.CONTACTED]: 0,
      [TechPipelineStage.REQUIREMENT_DISCUSSION]: 0,
      [TechPipelineStage.QUALIFIED]: 0,
      [TechPipelineStage.PROPOSAL_QUOTATION]: 0,
      [TechPipelineStage.NEGOTIATION]: 0,
      [TechPipelineStage.WON_CLIENT]: 0,
      [TechPipelineStage.LOST]: 0,
      [TechPipelineStage.FOLLOW_UP_LATER]: 0,
    };

    let qualifiedOpportunities = 0;
    let wonClientsCount = 0;
    let lostCount = 0;

    const memberMap: Record<
      string,
      { memberId: string; memberName: string; activeCount: number; wonCount: number }
    > = {};

    records.forEach((r) => {
      enquiriesByStage[r.stage] = (enquiriesByStage[r.stage] || 0) + 1;

      if (
        r.stage === TechPipelineStage.QUALIFIED ||
        r.stage === TechPipelineStage.PROPOSAL_QUOTATION ||
        r.stage === TechPipelineStage.NEGOTIATION
      ) {
        qualifiedOpportunities++;
      }

      if (
        r.stage === TechPipelineStage.WON_CLIENT ||
        r.category === TechRecordCategory.EXISTING_CLIENT
      ) {
        wonClientsCount++;
      }

      if (r.stage === TechPipelineStage.LOST) {
        lostCount++;
      }

      if (!memberMap[r.assignedMemberId]) {
        memberMap[r.assignedMemberId] = {
          memberId: r.assignedMemberId,
          memberName: r.assignedMemberName,
          activeCount: 0,
          wonCount: 0,
        };
      }

      if (
        r.stage !== TechPipelineStage.LOST &&
        r.stage !== TechPipelineStage.WON_CLIENT
      ) {
        memberMap[r.assignedMemberId].activeCount++;
      } else if (r.stage === TechPipelineStage.WON_CLIENT) {
        memberMap[r.assignedMemberId].wonCount++;
      }
    });

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const techFollowUps = this.followUps.filter(
      (f) =>
        f.workspaceId === workspaceId &&
        f.status === CrmFollowUpStatus.PENDING,
    );

    const followUpsDueToday = techFollowUps.filter((f) =>
      f.dueDate.startsWith(todayStr),
    ).length;

    const overdueFollowUps = techFollowUps.filter(
      (f) => new Date(f.dueDate) < now && !f.dueDate.startsWith(todayStr),
    ).length;

    return {
      totalEnquiries: records.length,
      enquiriesByStage,
      followUpsDueToday,
      overdueFollowUps,
      qualifiedOpportunities,
      wonClientsCount,
      lostCount,
      workloadByMember: Object.values(memberMap),
    };
  }

  // ==========================================
  // GET TECH RECORDS (Table & Board Views) (Section 3)
  // ==========================================
  getTechRecords(
    workspaceId: string,
    filterDto: TechCrmFilterDto = {},
  ): PaginatedTechRecordsResponseDto {
    this.validateTechWorkspace(workspaceId);

    let items = this.techRecords.filter((r) => r.workspaceId === workspaceId);

    if (filterDto.category) {
      items = items.filter((r) => r.category === filterDto.category);
    }

    if (filterDto.stage) {
      items = items.filter((r) => r.stage === filterDto.stage);
    }

    if (filterDto.assignedMemberId) {
      items = items.filter((r) => r.assignedMemberId === filterDto.assignedMemberId);
    }

    if (filterDto.source) {
      items = items.filter((r) => r.source.toLowerCase() === filterDto.source?.toLowerCase());
    }

    if (filterDto.serviceType) {
      items = items.filter(
        (r) => r.serviceType && r.serviceType.toLowerCase() === filterDto.serviceType?.toLowerCase(),
      );
    }

    if (filterDto.minBudget !== undefined) {
      items = items.filter((r) => (r.estimatedBudget || 0) >= filterDto.minBudget!);
    }

    if (filterDto.maxBudget !== undefined) {
      items = items.filter((r) => (r.estimatedBudget || 0) <= filterDto.maxBudget!);
    }

    if (filterDto.search) {
      const q = filterDto.search.toLowerCase().trim();
      const normQ = this.normalizePhone(q);
      items = items.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          (r.email && r.email.toLowerCase().includes(q)) ||
          r.requirementSummary.toLowerCase().includes(q) ||
          (normQ.length >= 3 && this.normalizePhone(r.phone).includes(normQ)),
      );
    }

    if (filterDto.followUpFilter && filterDto.followUpFilter !== 'ALL') {
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      items = items.filter((r) => {
        if (!r.nextFollowUpDate) return false;
        const d = new Date(r.nextFollowUpDate);
        if (filterDto.followUpFilter === 'TODAY') {
          return r.nextFollowUpDate.startsWith(todayStr);
        }
        if (filterDto.followUpFilter === 'OVERDUE') {
          return d < now && !r.nextFollowUpDate.startsWith(todayStr);
        }
        if (filterDto.followUpFilter === 'THIS_WEEK') {
          return d >= now && d <= nextWeek;
        }
        return true;
      });
    }

    // Default sort: lastActivityDate desc
    items.sort(
      (a, b) =>
        new Date(b.lastActivityDate || b.updatedAt).getTime() -
        new Date(a.lastActivityDate || a.updatedAt).getTime(),
    );

    const page = filterDto.page || 1;
    const pageSize = filterDto.pageSize || 20;
    const total = items.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const pagedItems = items.slice(startIndex, startIndex + pageSize);

    return {
      items: pagedItems,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  // ==========================================
  // GET TECH RECORD DETAIL (Section 6)
  // ==========================================
  getTechRecordById(
    workspaceId: string,
    id: string,
  ): {
    record: TechCrmRecord;
    linkedTasks: any[];
    linkedMeetings: any[];
    followUps: CrmFollowUpItem[];
    interactions: CrmInteractionItem[];
  } {
    this.validateTechWorkspace(workspaceId);

    const record = this.techRecords.find((r) => r.id === id && r.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Tech CRM Record #${id} not found.`);
    }

    const followUps = this.followUps.filter((f) => f.recordId === id && f.workspaceId === workspaceId);
    const interactions = this.interactions.filter(
      (i) => i.recordId === id && i.workspaceId === workspaceId,
    );

    let linkedTasks: any[] = [];
    if (this.tasksService) {
      const allTasks = this.tasksService.findAll(workspaceId, record.assignedMemberId, {});
      linkedTasks = allTasks.filter(
        (t) => t.linkedRecord && t.linkedRecord.id === id,
      );
    }

    let linkedMeetings: any[] = [];
    if (this.meetingsService) {
      const allMeetings = this.meetingsService.findAllMeetings(workspaceId);
      linkedMeetings = allMeetings.filter(
        (m: any) => m.linkedRecord && m.linkedRecord.id === id,
      );
    }

    return {
      record,
      linkedTasks,
      linkedMeetings,
      followUps,
      interactions,
    };
  }

  // ==========================================
  // DUPLICATE HANDLING (Section 8)
  // ==========================================
  checkDuplicates(
    workspaceId: string,
    dto: CheckDuplicatesDto,
  ): DuplicateMatchResult | null {
    this.validateTechWorkspace(workspaceId);

    const records = this.techRecords.filter(
      (r) => r.workspaceId === workspaceId && r.id !== dto.excludeId,
    );

    // 1. Phone match (normalized)
    if (dto.phone) {
      const normInputPhone = this.normalizePhone(dto.phone);
      if (normInputPhone.length >= 7) {
        const match = records.find((r) => {
          const normRec = this.normalizePhone(r.phone);
          return (
            normRec === normInputPhone ||
            normRec.endsWith(normInputPhone) ||
            normInputPhone.endsWith(normRec)
          );
        });
        if (match) {
          return { matchedBy: 'phone', record: match };
        }
      }
    }

    // 2. Email match
    if (dto.email) {
      const cleanEmail = dto.email.trim().toLowerCase();
      if (cleanEmail.length > 3) {
        const match = records.find(
          (r) => r.email && r.email.trim().toLowerCase() === cleanEmail,
        );
        if (match) {
          return { matchedBy: 'email', record: match };
        }
      }
    }

    // 3. Company match (case-insensitive exact or strong substring)
    if (dto.company) {
      const cleanCompany = dto.company.trim().toLowerCase();
      if (cleanCompany.length >= 3) {
        const match = records.find(
          (r) => r.company && r.company.trim().toLowerCase() === cleanCompany,
        );
        if (match) {
          return { matchedBy: 'company', record: match };
        }
      }
    }

    return null;
  }

  // ==========================================
  // CREATE TECH RECORD (Section 4)
  // ==========================================
  createTechRecord(workspaceId: string, dto: CreateTechRecordDto): TechCrmRecord {
    this.validateTechWorkspace(workspaceId);

    const contactName = dto.name?.trim() || '';
    const companyName = dto.company?.trim() || '';
    if (!contactName && !companyName) {
      throw new BadRequestException('Either contact name or company name is required.');
    }

    const phone = dto.phone?.trim() || '';
    const email = dto.email?.trim() || '';
    if (!phone && !email) {
      throw new BadRequestException(
        'A reliable contact method (phone number or email) is required.',
      );
    }

    if (!dto.category) {
      throw new BadRequestException('Record category is required.');
    }

    if (!dto.assignedMemberId) {
      throw new BadRequestException('Assigned member is required.');
    }

    if (!dto.source) {
      throw new BadRequestException('Lead/Enquiry source is required.');
    }

    const now = new Date().toISOString();
    const id = `crm-tech-${Date.now().toString(36)}`;
    const initialStage = dto.initialStage || TechPipelineStage.NEW_ENQUIRY;

    const newRecord: TechCrmRecord = {
      id,
      workspaceId,
      name: contactName || companyName,
      company: companyName || contactName,
      phone: phone || '+91 00000 00000',
      email: email || undefined,
      category: dto.category,
      stage: initialStage,
      stageHistory: [
        {
          stage: initialStage,
          timestamp: now,
          actorId: dto.assignedMemberId,
          actorName: dto.assignedMemberName || 'Account Lead',
          notes: 'Record created in Corviin Tech CRM.',
        },
      ],
      source: dto.source.trim(),
      assignedMemberId: dto.assignedMemberId,
      assignedMemberName: dto.assignedMemberName || 'Account Lead',
      serviceType: dto.serviceType?.trim() || undefined,
      requirementSummary:
        dto.requirementSummary?.trim() || 'General technology service enquiry',
      detailedRequirements: dto.detailedRequirements?.trim() || undefined,
      estimatedBudget: dto.estimatedBudget,
      businessType: dto.businessType?.trim() || undefined,
      website: dto.website?.trim() || undefined,
      location: dto.location?.trim() || undefined,
      notes: dto.notes?.trim() || undefined,
      attachments: [],
      createdAt: now,
      updatedAt: now,
      lastActivityDate: now,
    };

    this.techRecords.unshift(newRecord);

    // Keep overview record list synced
    this.records.unshift({
      id: newRecord.id,
      workspaceId,
      type:
        newRecord.category === TechRecordCategory.EXISTING_CLIENT
          ? CrmType.TECH_CLIENT
          : newRecord.category === TechRecordCategory.TECHNOLOGY_PARTNER
            ? CrmType.TECH_PARTNER
            : CrmType.TECH_LEAD,
      name: newRecord.name,
      company: newRecord.company,
      phone: newRecord.phone,
      email: newRecord.email,
      stage: newRecord.stage,
      assignedMemberId: newRecord.assignedMemberId,
      assignedMemberName: newRecord.assignedMemberName,
      lastActivityDate: now,
      requirementSummary: newRecord.requirementSummary,
      estimatedValue: newRecord.estimatedBudget,
      projectOrLocation: newRecord.location,
      createdAt: now,
      updatedAt: now,
    });

    return newRecord;
  }

  // ==========================================
  // UPDATE TECH RECORD (Section 4 & 6)
  // ==========================================
  updateTechRecord(
    workspaceId: string,
    id: string,
    dto: UpdateTechRecordDto,
  ): TechCrmRecord {
    this.validateTechWorkspace(workspaceId);

    const record = this.techRecords.find((r) => r.id === id && r.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Tech CRM Record #${id} not found.`);
    }

    if (dto.name !== undefined) record.name = dto.name.trim();
    if (dto.company !== undefined) record.company = dto.company.trim();
    if (dto.phone !== undefined) record.phone = dto.phone.trim();
    if (dto.email !== undefined) record.email = dto.email.trim() || undefined;
    if (dto.category !== undefined) record.category = dto.category;
    if (dto.source !== undefined) record.source = dto.source.trim();
    if (dto.assignedMemberId !== undefined) {
      record.assignedMemberId = dto.assignedMemberId;
      if (dto.assignedMemberName) record.assignedMemberName = dto.assignedMemberName;
    }
    if (dto.serviceType !== undefined) record.serviceType = dto.serviceType.trim() || undefined;
    if (dto.requirementSummary !== undefined) {
      record.requirementSummary = dto.requirementSummary.trim();
    }
    if (dto.detailedRequirements !== undefined) {
      record.detailedRequirements = dto.detailedRequirements.trim() || undefined;
    }
    if (dto.estimatedBudget !== undefined) record.estimatedBudget = dto.estimatedBudget;
    if (dto.businessType !== undefined) record.businessType = dto.businessType.trim() || undefined;
    if (dto.website !== undefined) record.website = dto.website.trim() || undefined;
    if (dto.location !== undefined) record.location = dto.location.trim() || undefined;
    if (dto.notes !== undefined) record.notes = dto.notes.trim() || undefined;

    const now = new Date().toISOString();
    record.updatedAt = now;
    record.lastActivityDate = now;

    // Sync overview summary
    const summary = this.records.find((r) => r.id === id);
    if (summary) {
      summary.name = record.name;
      summary.company = record.company;
      summary.phone = record.phone;
      summary.email = record.email;
      summary.requirementSummary = record.requirementSummary;
      summary.estimatedValue = record.estimatedBudget;
      summary.lastActivityDate = now;
      summary.updatedAt = now;
    }

    return record;
  }

  // ==========================================
  // CHANGE TECH STAGE (Section 5 & 7)
  // ==========================================
  changeTechStage(
    workspaceId: string,
    id: string,
    dto: ChangeTechStageDto,
  ): TechCrmRecord {
    this.validateTechWorkspace(workspaceId);

    const record = this.techRecords.find((r) => r.id === id && r.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Tech CRM Record #${id} not found.`);
    }

    const previousStage = record.stage;
    record.stage = dto.stage;

    const now = new Date().toISOString();
    record.updatedAt = now;
    record.lastActivityDate = now;

    if (dto.stage === TechPipelineStage.LOST) {
      record.lostReason = dto.lostReason?.trim() || dto.notes?.trim() || 'Marked as Lost without specific reason.';
    }

    if (dto.stage === TechPipelineStage.FOLLOW_UP_LATER) {
      record.followUpLaterDate = dto.followUpLaterDate || new Date(Date.now() + 14 * 86400000).toISOString();
      record.nextFollowUpDate = record.followUpLaterDate;
      record.nextFollowUpTitle = `Follow up later: ${record.company}`;

      // Automatically create a pending follow-up
      this.followUps.push({
        id: `fup-auto-${Date.now().toString(36)}`,
        workspaceId,
        recordId: record.id,
        recordType: CrmType.TECH_LEAD,
        recordTitle: record.company || record.name,
        title: `Follow up later: ${record.company}`,
        assignedMemberId: record.assignedMemberId,
        assignedMemberName: record.assignedMemberName,
        dueDate: record.followUpLaterDate,
        status: CrmFollowUpStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        createdAt: now,
        updatedAt: now,
      });
    }

    const historyEntry: TechStageHistoryEntry = {
      stage: dto.stage,
      timestamp: now,
      actorId: dto.actorId || record.assignedMemberId,
      actorName: dto.actorName || record.assignedMemberName,
      notes: dto.notes?.trim() || `Moved from ${previousStage} to ${dto.stage}`,
    };
    record.stageHistory.push(historyEntry);

    // Log interaction
    this.interactions.unshift({
      id: `int-stg-${Date.now().toString(36)}`,
      workspaceId,
      recordId: record.id,
      recordType: CrmType.TECH_LEAD,
      type: CrmInteractionType.STAGE_CHANGE,
      title: `Stage changed to ${dto.stage}`,
      description: historyEntry.notes,
      actorId: historyEntry.actorId,
      actorName: historyEntry.actorName,
      timestamp: now,
    });

    // Sync overview summary
    const summary = this.records.find((r) => r.id === id);
    if (summary) {
      summary.stage = dto.stage;
      summary.lastActivityDate = now;
      summary.updatedAt = now;
      if (record.nextFollowUpDate) {
        summary.nextFollowUpDate = record.nextFollowUpDate;
        summary.nextFollowUpTitle = record.nextFollowUpTitle;
      }
    }

    return record;
  }

  // ==========================================
  // CONVERT WON TO CLIENT (Section 7)
  // ==========================================
  convertWonToClient(
    workspaceId: string,
    id: string,
    dto: ConvertWonToClientDto = {},
  ): TechCrmRecord {
    this.validateTechWorkspace(workspaceId);

    const record = this.techRecords.find((r) => r.id === id && r.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Tech CRM Record #${id} not found.`);
    }

    const now = new Date().toISOString();

    // Mark as WON_CLIENT if not already
    if (record.stage !== TechPipelineStage.WON_CLIENT) {
      record.stage = TechPipelineStage.WON_CLIENT;
      record.stageHistory.push({
        stage: TechPipelineStage.WON_CLIENT,
        timestamp: now,
        actorId: dto.actorId || record.assignedMemberId,
        actorName: dto.actorName || record.assignedMemberName,
        notes: 'Converted to Won / Client.',
      });
    }

    // Convert category to EXISTING_CLIENT
    record.category = TechRecordCategory.EXISTING_CLIENT;
    record.updatedAt = now;
    record.lastActivityDate = now;

    if (dto.retainerAmount) {
      record.estimatedBudget = dto.retainerAmount;
    }

    if (dto.createProject && dto.projectName) {
      if (!record.projects) record.projects = [];
      record.projects.push({
        id: `proj-${Date.now().toString(36)}`,
        name: dto.projectName.trim(),
        status: 'Active / Kickoff',
        startDate: now.slice(0, 10),
      });
    }

    // Log contract signed / client onboarding interaction
    this.interactions.unshift({
      id: `int-won-${Date.now().toString(36)}`,
      workspaceId,
      recordId: record.id,
      recordType: CrmType.TECH_CLIENT,
      type: CrmInteractionType.NOTE,
      title: 'Converted to Existing Client Account',
      description:
        dto.serviceAgreementDetails ||
        `Onboarded as active client. Retainer: ${dto.retainerAmount ? `₹${dto.retainerAmount}` : 'Per project agreement'}. Original enquiry and pipeline history fully preserved.`,
      actorId: dto.actorId || record.assignedMemberId,
      actorName: dto.actorName || record.assignedMemberName,
      timestamp: now,
    });

    // Update summary type in overview
    const summary = this.records.find((r) => r.id === id);
    if (summary) {
      summary.type = CrmType.TECH_CLIENT;
      summary.stage = 'Active Client Retainer';
      summary.lastActivityDate = now;
      summary.updatedAt = now;
    }

    return record;
  }

  // ==========================================
  // CREATE LINKED TASK (Idempotent) (Section 7)
  // ==========================================
  createTechLinkedTask(
    workspaceId: string,
    recordId: string,
    dto: CreateTechLinkedTaskDto,
  ) {
    this.validateTechWorkspace(workspaceId);

    const record = this.techRecords.find((r) => r.id === recordId && r.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Tech CRM Record #${recordId} not found.`);
    }

    if (!dto.title || !dto.title.trim()) {
      throw new BadRequestException('Task title is required.');
    }

    if (this.tasksService) {
      const task = this.tasksService.create(
        {
          workspaceId,
          title: dto.title.trim(),
          description:
            dto.description?.trim() ||
            `Action item for ${record.company} (${record.name}). Requirements: ${record.requirementSummary}`,
          priority: dto.priority || TaskPriority.MEDIUM,
          assigneeId: dto.assigneeId || record.assignedMemberId,
          deadline: dto.deadline || new Date(Date.now() + 3 * 86400000).toISOString(),
          plannedStart: new Date().toISOString(),
          linkedRecord: {
            id: record.id,
            title: `${record.company} (${record.name})`,
            type: 'crm',
          },
        },
        record.assignedMemberId,
        record.assignedMemberName,
      );

      // Log task interaction
      const now = new Date().toISOString();
      this.interactions.unshift({
        id: `int-tsk-${Date.now().toString(36)}`,
        workspaceId,
        recordId: record.id,
        recordType: CrmType.TECH_LEAD,
        type: CrmInteractionType.TASK,
        title: `Task created: ${dto.title.trim()}`,
        description: `Linked task assigned to ${record.assignedMemberName}`,
        actorId: record.assignedMemberId,
        actorName: record.assignedMemberName,
        timestamp: now,
        metadata: { taskId: task.id },
      });

      record.lastActivityDate = now;
      record.updatedAt = now;

      return task;
    }

    throw new BadRequestException('Tasks service unavailable.');
  }

  // ==========================================
  // ADD PROPOSAL / QUOTATION REF (Section 6)
  // ==========================================
  addTechProposal(
    workspaceId: string,
    recordId: string,
    dto: AddTechProposalDto,
  ): TechProposalRef {
    this.validateTechWorkspace(workspaceId);

    const record = this.techRecords.find((r) => r.id === recordId && r.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Tech CRM Record #${recordId} not found.`);
    }

    if (!dto.title || !dto.title.trim()) {
      throw new BadRequestException('Proposal title is required.');
    }

    if (!record.proposals) record.proposals = [];

    const now = new Date().toISOString();
    const proposal: TechProposalRef = {
      id: `prop-${Date.now().toString(36)}`,
      title: dto.title.trim(),
      amount: dto.amount,
      status: dto.status || 'SENT',
      sentAt: now,
      referenceUrl: dto.referenceUrl?.trim() || undefined,
    };

    record.proposals.push(proposal);
    record.lastActivityDate = now;
    record.updatedAt = now;

    // Log document interaction
    this.interactions.unshift({
      id: `int-doc-${Date.now().toString(36)}`,
      workspaceId,
      recordId: record.id,
      recordType: CrmType.TECH_LEAD,
      type: CrmInteractionType.DOCUMENT,
      title: `Proposal added: ${proposal.title}`,
      description: `Amount: ${proposal.amount ? `₹${proposal.amount}` : 'N/A'}. Status: ${proposal.status}`,
      actorId: record.assignedMemberId,
      actorName: record.assignedMemberName,
      timestamp: now,
    });

    return proposal;
  }

  // ==========================================
  // ADD REQUIREMENT NOTE (Section 7)
  // ==========================================
  addTechRequirementNote(
    workspaceId: string,
    recordId: string,
    noteText: string,
    actorId?: string,
    actorName?: string,
  ): CrmInteractionItem {
    this.validateTechWorkspace(workspaceId);

    const record = this.techRecords.find((r) => r.id === recordId && r.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Tech CRM Record #${recordId} not found.`);
    }

    if (!noteText || !noteText.trim()) {
      throw new BadRequestException('Note text is required.');
    }

    const now = new Date().toISOString();
    const interaction: CrmInteractionItem = {
      id: `int-not-${Date.now().toString(36)}`,
      workspaceId,
      recordId: record.id,
      recordType: CrmType.TECH_LEAD,
      type: CrmInteractionType.NOTE,
      title: 'Requirement & Technical Note',
      description: noteText.trim(),
      actorId: actorId || record.assignedMemberId,
      actorName: actorName || record.assignedMemberName,
      timestamp: now,
    };

    this.interactions.unshift(interaction);
    record.lastActivityDate = now;
    record.updatedAt = now;

    return interaction;
  }

  // ============================================================
  // REAL ESTATE DEVELOPERS & PARTNERS CRM (FEATURE 12)
  // ============================================================

  validateRealEstateWorkspace(workspaceId: string): void {
    if (workspaceId !== 'ws-real-0002-0000-000000000002') {
      throw new ForbiddenException(
        'Real Estate Developers & Partners CRM is strictly isolated to Corviin Real Estate (ws-real-0002-0000-000000000002). Access from other workspaces is forbidden.',
      );
    }
  }

  private seedPartnerData() {
    const realWs = 'ws-real-0002-0000-000000000002';
    const anantId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    const rohitId = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';
    const utkarshId = 'c3d4e5f6-a7b8-9012-cdef-123456789012';

    this.partnerRecords = [
      {
        id: 'partner-re-001',
        workspaceId: realWs,
        companyName: 'Skyline Developers Pvt Ltd',
        contactPerson: 'Sanjay Mehta',
        phone: '+91 99301 11223',
        email: 'sanjay.m@skylinedev.com',
        partnerType: RealEstatePartnerType.DEVELOPER,
        stage: RealEstatePartnerStage.FOLLOWUP_NEGOTIATION,
        assignedMemberId: anantId,
        assignedMemberName: 'Anant',
        location: 'Alibaug & South Mumbai',
        website: 'https://skylinedevelopers.in',
        projects: [
          {
            id: 'proj-sky-1',
            name: 'Emerald Heights Luxury Villas',
            projectType: 'LUXURY_VILLAS',
            location: 'Awas Road, Alibaug',
            reraNumber: 'P52000018902',
            totalUnitsOrAcres: '45 Private Pool Villas',
            status: 'UNDER_CONSTRUCTION',
            linkedCampaignIds: ['camp-re-001'],
          },
          {
            id: 'proj-sky-2',
            name: 'Skyline Marina Bay Residences',
            projectType: 'RESIDENTIAL',
            location: 'Mandwa Jetty Road, Alibaug',
            reraNumber: 'P52000022341',
            totalUnitsOrAcres: '24 Seafront Apartments',
            status: 'UPCOMING',
            linkedCampaignIds: [],
          },
        ],
        marketingRequirements: ['3D Visualization', 'Sole Selling Mandate', 'HNI Influencer Campaign', 'Brochure Design'],
        serviceRequirementsText: 'Exclusive 3% sales mandate & complete digital launch campaign for 45 luxury villas.',
        partnershipInterest: 'Sole Selling & Digital Launch Mandate',
        source: 'Referral (Anant Network)',
        notes: 'Promoters are keen on an exclusive 6-month marketing and sales window. Legal team reviewing MoU draft.',
        tags: ['developer', 'luxury-villas', 'alibaug', 'mandate'],
        estimatedPortfolioValue: 250000000,
        nextFollowUpDate: '2026-11-06T15:00:00.000Z',
        nextFollowUpTitle: 'Present marketing mandate draft for Emerald Heights Phase 2',
        lastActivityDate: '2026-11-04T14:00:00.000Z',
        stageHistory: [
          {
            id: 'sh-p1-1',
            toStage: RealEstatePartnerStage.NEW_PARTNER_LEAD,
            changedAt: '2026-10-10T10:00:00.000Z',
            actorId: anantId,
            actorName: 'Anant',
            notes: 'Initial referral received from coastal investor syndicate.',
          },
          {
            id: 'sh-p1-2',
            fromStage: RealEstatePartnerStage.NEW_PARTNER_LEAD,
            toStage: RealEstatePartnerStage.INITIAL_CONTACT,
            changedAt: '2026-10-14T11:30:00.000Z',
            actorId: anantId,
            actorName: 'Anant',
            notes: 'Introductory phone call with MD Sanjay Mehta.',
          },
          {
            id: 'sh-p1-3',
            fromStage: RealEstatePartnerStage.INITIAL_CONTACT,
            toStage: RealEstatePartnerStage.MEETING_PLANNED,
            changedAt: '2026-10-18T16:00:00.000Z',
            actorId: anantId,
            actorName: 'Anant',
            notes: 'Scheduled site visit and boardroom meeting at Alibaug site office.',
          },
          {
            id: 'sh-p1-4',
            fromStage: RealEstatePartnerStage.MEETING_PLANNED,
            toStage: RealEstatePartnerStage.REQUIREMENT_DISCUSSION,
            changedAt: '2026-10-24T14:00:00.000Z',
            actorId: anantId,
            actorName: 'Anant',
            notes: 'Discussed scope: drone walkthrough, CGI renders, and sole selling mandate.',
          },
          {
            id: 'sh-p1-5',
            fromStage: RealEstatePartnerStage.REQUIREMENT_DISCUSSION,
            toStage: RealEstatePartnerStage.PROPOSAL_SERVICE_DETAILS,
            changedAt: '2026-10-29T10:00:00.000Z',
            actorId: anantId,
            actorName: 'Anant',
            notes: 'Sent formal service proposal and commission schedule (3% sole mandate).',
          },
          {
            id: 'sh-p1-6',
            fromStage: RealEstatePartnerStage.PROPOSAL_SERVICE_DETAILS,
            toStage: RealEstatePartnerStage.FOLLOWUP_NEGOTIATION,
            changedAt: '2026-11-03T12:00:00.000Z',
            actorId: anantId,
            actorName: 'Anant',
            notes: 'Reviewing minor commercial adjustments regarding marketing budget sharing.',
          },
        ],
        linkedTaskIds: ['task-re-p1-1'],
        linkedMeetingIds: ['mtg-re-p1-1'],
        linkedCampaignIds: ['camp-re-001'],
        createdAt: '2026-10-10T10:00:00.000Z',
        updatedAt: '2026-11-04T14:00:00.000Z',
      },
      {
        id: 'partner-re-002',
        workspaceId: realWs,
        companyName: 'Prestige Land Holdings',
        contactPerson: 'Mahendra Gaikwad',
        phone: '+91 99302 22334',
        email: 'land@prestigeland.com',
        partnerType: RealEstatePartnerType.LANDOWNER,
        stage: RealEstatePartnerStage.REQUIREMENT_DISCUSSION,
        assignedMemberId: rohitId,
        assignedMemberName: 'Rohit',
        location: 'North Pune Expressway Corridor',
        projects: [
          {
            id: 'proj-prest-1',
            name: 'Hinjawadi Vista Land Parcel',
            projectType: 'PLOTTED_DEVELOPMENT',
            location: 'Hinjawadi Phase 3 Extension, Pune',
            totalUnitsOrAcres: '15.5 Clear Title Acres',
            status: 'UPCOMING',
          },
        ],
        marketingRequirements: ['JV Structuring', 'Feasibility Study', 'Developer Matching'],
        serviceRequirementsText: 'Joint Venture development partnership matching with top Tier-1 Pune developers.',
        partnershipInterest: 'JV Land Development & Project Advisory',
        source: 'Direct Inbound',
        notes: 'Family-owned 15-acre plot. 7/12 extract verified clean. Searching for reputable development partner.',
        tags: ['landowner', 'pune', 'jv', 'plotted'],
        estimatedPortfolioValue: 180000000,
        nextFollowUpDate: '2026-11-08T10:30:00.000Z',
        nextFollowUpTitle: 'Review title search report and FSI valuation with legal team',
        lastActivityDate: '2026-11-03T16:00:00.000Z',
        stageHistory: [
          {
            id: 'sh-p2-1',
            toStage: RealEstatePartnerStage.NEW_PARTNER_LEAD,
            changedAt: '2026-10-18T10:00:00.000Z',
            actorId: rohitId,
            actorName: 'Rohit',
            notes: 'Inbound enquiry via website land acquisition form.',
          },
          {
            id: 'sh-p2-2',
            fromStage: RealEstatePartnerStage.NEW_PARTNER_LEAD,
            toStage: RealEstatePartnerStage.INITIAL_CONTACT,
            changedAt: '2026-10-21T15:00:00.000Z',
            actorId: rohitId,
            actorName: 'Rohit',
            notes: 'Phone screening regarding plot dimensions and zoning clearances.',
          },
          {
            id: 'sh-p2-3',
            fromStage: RealEstatePartnerStage.INITIAL_CONTACT,
            toStage: RealEstatePartnerStage.REQUIREMENT_DISCUSSION,
            changedAt: '2026-10-28T11:00:00.000Z',
            actorId: rohitId,
            actorName: 'Rohit',
            notes: 'Meeting held at Pune office to evaluate JV ratio expectations (55:45).',
          },
        ],
        linkedTaskIds: [],
        linkedMeetingIds: [],
        createdAt: '2026-10-18T10:00:00.000Z',
        updatedAt: '2026-11-03T16:00:00.000Z',
      },
      {
        id: 'partner-re-003',
        workspaceId: realWs,
        companyName: 'Oberoi & Shapoorji Infra Builders',
        contactPerson: 'Vikramaditya Singhania',
        phone: '+91 99303 33445',
        email: 'v.singhania@oberoibuild.in',
        partnerType: RealEstatePartnerType.BUILDER,
        stage: RealEstatePartnerStage.ACTIVE_PARTNER,
        assignedMemberId: anantId,
        assignedMemberName: 'Anant',
        location: 'Worli & Lower Parel, Mumbai',
        website: 'https://oberoishapoorji.com',
        mandateSignedAt: '2026-06-01T10:00:00.000Z',
        activeSince: '2026-06-15T10:00:00.000Z',
        projects: [
          {
            id: 'proj-obs-1',
            name: 'The Grand Horizon Luxury Towers',
            projectType: 'RESIDENTIAL',
            location: 'Worli Sea Face, Mumbai',
            reraNumber: 'P51900009876',
            totalUnitsOrAcres: '120 Ultra-Luxury 4BHKs',
            status: 'UNDER_CONSTRUCTION',
            linkedCampaignIds: ['camp-re-002'],
          },
          {
            id: 'proj-obs-2',
            name: 'Horizon Enclave Commercial',
            projectType: 'COMMERCIAL',
            location: 'Lower Parel, Mumbai',
            reraNumber: 'P51900011234',
            totalUnitsOrAcres: '60 Premium Office Suites',
            status: 'READY_TO_MOVE',
            linkedCampaignIds: [],
          },
        ],
        marketingRequirements: ['Performance Ads', 'Lead Qualification Desk', 'Model Apartment VR Tours', 'Channel Partner Activation'],
        serviceRequirementsText: 'Ongoing digital lead generation and onsite customer closing assistance.',
        partnershipInterest: 'Long-term Tier-1 Builder Retainer & Sales Mandate',
        source: 'Corporate Alliance',
        notes: 'Key anchor client. Monthly reviews held on the 12th. Velocity currently at 6 units sold per month.',
        tags: ['builder', 'active-partner', 'mumbai', 'ultra-luxury'],
        estimatedPortfolioValue: 850000000,
        nextFollowUpDate: '2026-11-12T11:00:00.000Z',
        nextFollowUpTitle: 'Monthly sales velocity review and broker channel commission payout',
        lastActivityDate: '2026-11-04T18:00:00.000Z',
        stageHistory: [
          {
            id: 'sh-p3-1',
            toStage: RealEstatePartnerStage.PARTNERSHIP_CONFIRMED,
            changedAt: '2026-06-01T10:00:00.000Z',
            actorId: anantId,
            actorName: 'Anant',
            notes: 'Marketing mandate executed with promoter board approval.',
          },
          {
            id: 'sh-p3-2',
            fromStage: RealEstatePartnerStage.PARTNERSHIP_CONFIRMED,
            toStage: RealEstatePartnerStage.ACTIVE_PARTNER,
            changedAt: '2026-06-15T10:00:00.000Z',
            actorId: anantId,
            actorName: 'Anant',
            notes: 'Campaign went live. Transitioned to active operational account.',
          },
        ],
        linkedTaskIds: [],
        linkedMeetingIds: [],
        createdAt: '2026-05-15T10:00:00.000Z',
        updatedAt: '2026-11-04T18:00:00.000Z',
      },
      {
        id: 'partner-re-004',
        workspaceId: realWs,
        companyName: 'Western Maharashtra Channel Network',
        contactPerson: 'Rajesh Shinde',
        phone: '+91 99304 44556',
        email: 'rajesh@wmcpnetwork.com',
        partnerType: RealEstatePartnerType.CHANNEL_PARTNER,
        stage: RealEstatePartnerStage.PARTNERSHIP_CONFIRMED,
        assignedMemberId: rohitId,
        assignedMemberName: 'Rohit',
        location: 'Baner & Wakad, Pune',
        mandateSignedAt: '2026-11-02T14:00:00.000Z',
        projects: [
          {
            id: 'proj-wmcp-1',
            name: 'Emerald Heights Luxury Villas',
            location: 'Alibaug',
            status: 'UNDER_CONSTRUCTION',
          },
          {
            id: 'proj-wmcp-2',
            name: 'The Grand Horizon Luxury Towers',
            location: 'Worli',
            status: 'UNDER_CONSTRUCTION',
          },
        ],
        marketingRequirements: ['Channel Partner Incentive Kit', 'Co-branded Collateral', 'Sub-broker Training'],
        serviceRequirementsText: 'Network aggregation of 180+ real estate agents across Pune and Navi Mumbai.',
        partnershipInterest: 'Channel Partner Distribution Agreement',
        source: 'Industry Event (CREDAI Expo)',
        notes: 'Signed partnership agreement on Nov 2nd. Setting up broker portal access and digital kits.',
        tags: ['channel-partner', 'broker-network', 'pune'],
        estimatedPortfolioValue: 75000000,
        nextFollowUpDate: '2026-11-09T16:00:00.000Z',
        nextFollowUpTitle: 'Distribute Q4 broker slab incentives and project brochures',
        lastActivityDate: '2026-11-04T11:00:00.000Z',
        stageHistory: [
          {
            id: 'sh-p4-1',
            toStage: RealEstatePartnerStage.PARTNERSHIP_CONFIRMED,
            changedAt: '2026-11-02T14:00:00.000Z',
            actorId: rohitId,
            actorName: 'Rohit',
            notes: 'Channel partner master agreement signed with 1.75% payout terms.',
          },
        ],
        createdAt: '2026-10-15T09:00:00.000Z',
        updatedAt: '2026-11-04T11:00:00.000Z',
      },
      {
        id: 'partner-re-005',
        workspaceId: realWs,
        companyName: 'Sterling Heights & Estates',
        contactPerson: 'Aditya Kothari',
        phone: '+91 99305 55667',
        email: 'aditya@sterlingheights.com',
        partnerType: RealEstatePartnerType.DEVELOPER,
        stage: RealEstatePartnerStage.PROPOSAL_SERVICE_DETAILS,
        assignedMemberId: utkarshId,
        assignedMemberName: 'Utkarsh',
        location: 'Kharadi, Pune',
        projects: [
          {
            id: 'proj-ster-1',
            name: 'Sterling Park Residences',
            projectType: 'RESIDENTIAL',
            location: 'EON IT Park Road, Kharadi',
            reraNumber: 'P52100033445',
            totalUnitsOrAcres: '320 High-Rise 2 & 3 BHKs',
            status: 'UNDER_CONSTRUCTION',
          },
        ],
        marketingRequirements: ['Performance Ads', 'Landing Pages', 'Sales CRM Setup'],
        serviceRequirementsText: 'Digital mandate to generate 400 verified site visits within 90 days.',
        partnershipInterest: 'Digital Marketing & Lead Generation Mandate',
        source: 'Direct Inbound',
        notes: 'Delivering revised commercial proposal today. Competing with local Pune agency.',
        tags: ['developer', 'kharadi', 'residential'],
        estimatedPortfolioValue: 120000000,
        nextFollowUpDate: '2026-11-05T14:00:00.000Z',
        nextFollowUpTitle: 'Deliver proposal deck with revised 2.5% success fee mandate',
        lastActivityDate: '2026-11-05T08:30:00.000Z',
        stageHistory: [
          {
            id: 'sh-p5-1',
            toStage: RealEstatePartnerStage.PROPOSAL_SERVICE_DETAILS,
            changedAt: '2026-11-01T10:00:00.000Z',
            actorId: utkarshId,
            actorName: 'Utkarsh',
            notes: 'Presented first draft of proposal. Requested slight discount on setup fee.',
          },
        ],
        createdAt: '2026-10-22T10:00:00.000Z',
        updatedAt: '2026-11-05T08:30:00.000Z',
      },
      {
        id: 'partner-re-006',
        workspaceId: realWs,
        companyName: 'Prime Realty Advisory',
        contactPerson: 'Gaurav Bhasin',
        phone: '+91 99306 66778',
        email: 'gaurav@primerealty.co.in',
        partnerType: RealEstatePartnerType.BROKER_AGENT,
        stage: RealEstatePartnerStage.INITIAL_CONTACT,
        assignedMemberId: anantId,
        assignedMemberName: 'Anant',
        location: 'Bandra West, Mumbai',
        projects: [
          {
            id: 'proj-pra-1',
            name: 'Bandra & Khar HNI Portfolio',
            location: 'Bandra West, Mumbai',
            status: 'READY_TO_MOVE',
          },
        ],
        marketingRequirements: ['Exclusive Inventory Access', 'Direct Promoter Link'],
        serviceRequirementsText: 'Broker tie-up for HNI buyers looking for coastal luxury properties.',
        partnershipInterest: 'Broker Representation Tie-up',
        source: 'Referral (Anant)',
        notes: 'High-performing boutique broker in Pali Hill. Has 4 active buyers for Alibaug villas.',
        tags: ['broker', 'hni', 'bandra'],
        estimatedPortfolioValue: 50000000,
        nextFollowUpDate: '2026-11-07T17:00:00.000Z',
        nextFollowUpTitle: 'Introductory call on buyer pipeline sharing',
        lastActivityDate: '2026-11-03T17:00:00.000Z',
        stageHistory: [
          {
            id: 'sh-p6-1',
            toStage: RealEstatePartnerStage.INITIAL_CONTACT,
            changedAt: '2026-11-03T17:00:00.000Z',
            actorId: anantId,
            actorName: 'Anant',
            notes: 'Contacted Gaurav after mutual acquaintance introduction.',
          },
        ],
        createdAt: '2026-11-02T11:00:00.000Z',
        updatedAt: '2026-11-03T17:00:00.000Z',
      },
      {
        id: 'partner-re-007',
        workspaceId: realWs,
        companyName: 'Deccan Heavy Construction Corp',
        contactPerson: 'Amit Deshpande',
        phone: '+91 99307 77889',
        email: 'amit@deccanconstruct.in',
        partnerType: RealEstatePartnerType.CONSTRUCTION_COMPANY,
        stage: RealEstatePartnerStage.MEETING_PLANNED,
        assignedMemberId: utkarshId,
        assignedMemberName: 'Utkarsh',
        location: 'Chakan & PCMC, Pune',
        projects: [
          {
            id: 'proj-dhc-1',
            name: 'Chakan Industrial Logistics Hub',
            projectType: 'COMMERCIAL',
            location: 'Chakan MIDC Phase 2',
            totalUnitsOrAcres: '40 Acres Warehousing',
            status: 'UPCOMING',
          },
        ],
        marketingRequirements: ['Construction Progress Videography', 'Investor Pitch Deck'],
        serviceRequirementsText: 'Construction videography, monthly drone reporting, and institutional lease pitch decks.',
        partnershipInterest: 'Construction Media & Investor Marketing',
        source: 'Cold Outreach',
        notes: 'Meeting scheduled for Nov 10th at their Chakan site office with civil engineers.',
        tags: ['construction', 'industrial', 'chakan'],
        estimatedPortfolioValue: 90000000,
        nextFollowUpDate: '2026-11-10T11:00:00.000Z',
        nextFollowUpTitle: 'Site visit and videography drone feasibility inspection',
        lastActivityDate: '2026-11-02T14:00:00.000Z',
        stageHistory: [
          {
            id: 'sh-p7-1',
            toStage: RealEstatePartnerStage.MEETING_PLANNED,
            changedAt: '2026-11-02T14:00:00.000Z',
            actorId: utkarshId,
            actorName: 'Utkarsh',
            notes: 'Confirmed site inspection meeting date.',
          },
        ],
        createdAt: '2026-10-26T14:00:00.000Z',
        updatedAt: '2026-11-02T14:00:00.000Z',
      },
      {
        id: 'partner-re-008',
        workspaceId: realWs,
        companyName: 'Hillside Greenery Development',
        contactPerson: 'Neha Parekh',
        phone: '+91 99308 88990',
        email: 'neha@hillsidegreen.com',
        partnerType: RealEstatePartnerType.OTHER_PARTNER,
        stage: RealEstatePartnerStage.NEW_PARTNER_LEAD,
        assignedMemberId: rohitId,
        assignedMemberName: 'Rohit',
        location: 'Lonavala & Khandala, Maharashtra',
        projects: [
          {
            id: 'proj-hgd-1',
            name: 'Lonavala Eco Retreat',
            projectType: 'MIXED_USE',
            location: 'Tungarli, Lonavala',
            totalUnitsOrAcres: '25 Eco Farmhouses',
            status: 'UPCOMING',
          },
        ],
        marketingRequirements: ['Eco-Living Branding', 'Campaign Shoot', 'Social Media Strategy'],
        serviceRequirementsText: 'Branding and launch campaign for boutique nature estate.',
        partnershipInterest: 'Branding & Go-To-Market Strategy',
        source: 'Inbound Web Lead',
        notes: 'Promoter interested in creative branding and influencer weekend getaway campaign.',
        tags: ['eco-resort', 'lonavala', 'branding'],
        estimatedPortfolioValue: 40000000,
        nextFollowUpDate: '2026-11-06T10:00:00.000Z',
        nextFollowUpTitle: 'First qualification call with promoter',
        lastActivityDate: '2026-11-05T09:30:00.000Z',
        stageHistory: [
          {
            id: 'sh-p8-1',
            toStage: RealEstatePartnerStage.NEW_PARTNER_LEAD,
            changedAt: '2026-11-05T09:30:00.000Z',
            actorId: rohitId,
            actorName: 'Rohit',
            notes: 'New enquiry received through website form.',
          },
        ],
        createdAt: '2026-11-05T09:30:00.000Z',
        updatedAt: '2026-11-05T09:30:00.000Z',
      },
    ];
  }

  // ==========================================
  // GET PARTNER SUMMARY (Metrics & Breakdown)
  // ==========================================
  getPartnerSummary(workspaceId: string): PartnerCrmSummaryDto {
    this.validateRealEstateWorkspace(workspaceId);

    const partners = this.partnerRecords.filter((p) => p.workspaceId === workspaceId);
    const now = new Date();

    const activePartners = partners.filter((p) => p.stage === RealEstatePartnerStage.ACTIVE_PARTNER).length;
    const confirmedPartners = partners.filter((p) => p.stage === RealEstatePartnerStage.PARTNERSHIP_CONFIRMED).length;
    
    const pipelineStages = [
      RealEstatePartnerStage.NEW_PARTNER_LEAD,
      RealEstatePartnerStage.INITIAL_CONTACT,
      RealEstatePartnerStage.MEETING_PLANNED,
      RealEstatePartnerStage.REQUIREMENT_DISCUSSION,
      RealEstatePartnerStage.PROPOSAL_SERVICE_DETAILS,
      RealEstatePartnerStage.FOLLOWUP_NEGOTIATION,
    ];
    const leadsInPipeline = partners.filter((p) => pipelineStages.includes(p.stage)).length;

    let totalProjectsCount = 0;
    partners.forEach((p) => {
      totalProjectsCount += p.projects?.length || 0;
    });

    const overdueFollowUpsCount = partners.filter((p) => {
      if (!p.nextFollowUpDate) return false;
      const fDate = new Date(p.nextFollowUpDate);
      return fDate < now && p.stage !== RealEstatePartnerStage.LOST && p.stage !== RealEstatePartnerStage.NOT_INTERESTED;
    }).length;

    const byType: Record<RealEstatePartnerType, number> = {
      [RealEstatePartnerType.DEVELOPER]: 0,
      [RealEstatePartnerType.BUILDER]: 0,
      [RealEstatePartnerType.CONSTRUCTION_COMPANY]: 0,
      [RealEstatePartnerType.LANDOWNER]: 0,
      [RealEstatePartnerType.CHANNEL_PARTNER]: 0,
      [RealEstatePartnerType.BROKER_AGENT]: 0,
      [RealEstatePartnerType.OTHER_PARTNER]: 0,
    };
    partners.forEach((p) => {
      if (byType[p.partnerType] !== undefined) {
        byType[p.partnerType]++;
      }
    });

    const byStage: Record<RealEstatePartnerStage, number> = {
      [RealEstatePartnerStage.NEW_PARTNER_LEAD]: 0,
      [RealEstatePartnerStage.INITIAL_CONTACT]: 0,
      [RealEstatePartnerStage.MEETING_PLANNED]: 0,
      [RealEstatePartnerStage.REQUIREMENT_DISCUSSION]: 0,
      [RealEstatePartnerStage.PROPOSAL_SERVICE_DETAILS]: 0,
      [RealEstatePartnerStage.FOLLOWUP_NEGOTIATION]: 0,
      [RealEstatePartnerStage.PARTNERSHIP_CONFIRMED]: 0,
      [RealEstatePartnerStage.ACTIVE_PARTNER]: 0,
      [RealEstatePartnerStage.NOT_INTERESTED]: 0,
      [RealEstatePartnerStage.LOST]: 0,
      [RealEstatePartnerStage.FOLLOW_UP_LATER]: 0,
    };
    partners.forEach((p) => {
      if (byStage[p.stage] !== undefined) {
        byStage[p.stage]++;
      }
    });

    // Group by member
    const memberMap = new Map<string, { memberName: string; totalAssigned: number; activeCount: number }>();
    partners.forEach((p) => {
      const entry = memberMap.get(p.assignedMemberId) || {
        memberName: p.assignedMemberName,
        totalAssigned: 0,
        activeCount: 0,
      };
      entry.totalAssigned++;
      if (p.stage === RealEstatePartnerStage.ACTIVE_PARTNER || p.stage === RealEstatePartnerStage.PARTNERSHIP_CONFIRMED) {
        entry.activeCount++;
      }
      memberMap.set(p.assignedMemberId, entry);
    });

    const byMember = Array.from(memberMap.entries()).map(([memberId, data]) => ({
      memberId,
      memberName: data.memberName,
      totalAssigned: data.totalAssigned,
      activeCount: data.activeCount,
    }));

    return {
      totalPartners: partners.length,
      activePartners,
      confirmedPartners,
      leadsInPipeline,
      totalProjectsCount,
      overdueFollowUpsCount,
      byType,
      byStage,
      byMember,
    };
  }

  // ==========================================
  // GET PARTNER RECORDS (Search, Filter, Sort, Paginate)
  // ==========================================
  getPartnerRecords(
    workspaceId: string,
    filterDto: PartnerCrmFilterDto = {},
  ): PaginatedPartnerRecordsResponseDto {
    this.validateRealEstateWorkspace(workspaceId);

    let items = this.partnerRecords.filter((p) => p.workspaceId === workspaceId);

    // 1. Text Search
    if (filterDto.search && filterDto.search.trim()) {
      const q = filterDto.search.toLowerCase().trim();
      const normQueryPhone = q.replace(/\D/g, '');

      items = items.filter((p) => {
        const matchCompany = p.companyName.toLowerCase().includes(q);
        const matchContact = p.contactPerson ? p.contactPerson.toLowerCase().includes(q) : false;
        const matchEmail = p.email ? p.email.toLowerCase().includes(q) : false;
        const matchLocation = p.location ? p.location.toLowerCase().includes(q) : false;
        const matchNotes = p.notes ? p.notes.toLowerCase().includes(q) : false;

        const matchProject = p.projects?.some((proj) => proj.name.toLowerCase().includes(q) || proj.location.toLowerCase().includes(q));

        let matchPhone = false;
        if (normQueryPhone.length >= 3) {
          const recPhone = p.phone.replace(/\D/g, '');
          matchPhone = recPhone.includes(normQueryPhone);
        }

        return matchCompany || matchContact || matchEmail || matchLocation || matchNotes || matchProject || matchPhone;
      });
    }

    // 2. Partner Type Filter
    if (filterDto.partnerType) {
      items = items.filter((p) => p.partnerType === filterDto.partnerType);
    }

    // 3. Stage Filter
    if (filterDto.stage) {
      items = items.filter((p) => p.stage === filterDto.stage);
    }

    // 4. Assigned Member Filter
    if (filterDto.assignedMemberId) {
      items = items.filter((p) => p.assignedMemberId === filterDto.assignedMemberId);
    }

    // 5. Location Filter
    if (filterDto.location && filterDto.location.trim()) {
      const loc = filterDto.location.toLowerCase().trim();
      items = items.filter((p) => p.location && p.location.toLowerCase().includes(loc));
    }

    // 6. Project Name Filter
    if (filterDto.projectName && filterDto.projectName.trim()) {
      const projQ = filterDto.projectName.toLowerCase().trim();
      items = items.filter((p) => p.projects?.some((proj) => proj.name.toLowerCase().includes(projQ)));
    }

    // 7. Source Filter
    if (filterDto.source && filterDto.source.trim()) {
      const srcQ = filterDto.source.toLowerCase().trim();
      items = items.filter((p) => p.source && p.source.toLowerCase().includes(srcQ));
    }

    // 8. Follow-up Due Filter
    if (filterDto.followUpDue && filterDto.followUpDue !== 'ALL') {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      const endOfWeek = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);

      items = items.filter((p) => {
        if (!p.nextFollowUpDate) return false;
        const fDate = new Date(p.nextFollowUpDate);

        if (filterDto.followUpDue === 'OVERDUE') {
          return fDate < startOfToday;
        }
        if (filterDto.followUpDue === 'TODAY') {
          return fDate >= startOfToday && fDate <= endOfToday;
        }
        if (filterDto.followUpDue === 'THIS_WEEK') {
          return fDate >= startOfToday && fDate <= endOfWeek;
        }
        return true;
      });
    }

    // 9. Sorting
    const sortBy = filterDto.sortBy || 'createdAt';
    const sortOrder = filterDto.sortOrder || 'desc';

    items.sort((a, b) => {
      let valA: any = a.createdAt;
      let valB: any = b.createdAt;

      if (sortBy === 'companyName') {
        valA = a.companyName.toLowerCase();
        valB = b.companyName.toLowerCase();
      } else if (sortBy === 'nextFollowUpDate') {
        valA = a.nextFollowUpDate ? new Date(a.nextFollowUpDate).getTime() : 0;
        valB = b.nextFollowUpDate ? new Date(b.nextFollowUpDate).getTime() : 0;
      } else if (sortBy === 'stage') {
        valA = a.stage;
        valB = b.stage;
      } else {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // 10. Pagination
    const page = filterDto.page && filterDto.page > 0 ? filterDto.page : 1;
    const pageSize = filterDto.pageSize && filterDto.pageSize > 0 ? filterDto.pageSize : 20;
    const total = items.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

    return {
      items: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  // ==========================================
  // GET PARTNER RECORD BY ID
  // ==========================================
  getPartnerRecordById(workspaceId: string, id: string): RealEstatePartnerRecord {
    this.validateRealEstateWorkspace(workspaceId);

    const record = this.partnerRecords.find((p) => p.id === id && p.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Real Estate Partner Record #${id} not found in this workspace.`);
    }
    return record;
  }

  // ==========================================
  // CHECK PARTNER DUPLICATES
  // ==========================================
  checkPartnerDuplicates(
    workspaceId: string,
    dto: CheckPartnerDuplicatesDto,
  ): PartnerDuplicateMatchResult[] {
    this.validateRealEstateWorkspace(workspaceId);

    const matches: PartnerDuplicateMatchResult[] = [];
    const normPhone = dto.phone ? dto.phone.replace(/\D/g, '') : '';
    const normEmail = dto.email ? dto.email.trim().toLowerCase() : '';
    const normCompany = dto.companyName ? dto.companyName.trim().toLowerCase() : '';

    for (const record of this.partnerRecords) {
      if (record.workspaceId !== workspaceId) continue;
      if (dto.excludeId && record.id === dto.excludeId) continue;

      if (normPhone && normPhone.length >= 8) {
        const recPhone = record.phone.replace(/\D/g, '');
        if (recPhone && (recPhone.endsWith(normPhone) || normPhone.endsWith(recPhone))) {
          matches.push({ matchedBy: 'phone', record });
          continue;
        }
      }

      if (normEmail && record.email && record.email.trim().toLowerCase() === normEmail) {
        matches.push({ matchedBy: 'email', record });
        continue;
      }

      if (normCompany && record.companyName.trim().toLowerCase() === normCompany) {
        matches.push({ matchedBy: 'companyName', record });
        continue;
      }
    }

    return matches;
  }

  // ==========================================
  // CREATE PARTNER RECORD
  // ==========================================
  createPartnerRecord(
    workspaceId: string,
    dto: CreatePartnerRecordDto,
  ): RealEstatePartnerRecord {
    this.validateRealEstateWorkspace(workspaceId);

    if (!dto.companyName || !dto.companyName.trim()) {
      throw new BadRequestException('Company or partner name is required.');
    }
    if (!dto.phone || !dto.phone.trim()) {
      throw new BadRequestException('Contact phone number is required.');
    }
    if (!dto.partnerType) {
      throw new BadRequestException('Partner type is required.');
    }
    if (!dto.assignedMemberId) {
      throw new BadRequestException('Assigned team member is required.');
    }

    const now = new Date().toISOString();
    const id = `partner-re-${Date.now().toString(36)}`;
    const stage = dto.initialStage || RealEstatePartnerStage.NEW_PARTNER_LEAD;

    // Build projects array
    const projects: PartnerProjectRef[] = [];
    if (dto.initialProject && dto.initialProject.name?.trim()) {
      projects.push({
        id: `proj-${Date.now().toString(36)}-1`,
        name: dto.initialProject.name.trim(),
        projectType: dto.initialProject.projectType,
        location: dto.initialProject.location || dto.location || 'Maharashtra',
        reraNumber: dto.initialProject.reraNumber,
        totalUnitsOrAcres: dto.initialProject.totalUnitsOrAcres,
        status: dto.initialProject.status || 'UPCOMING',
      });
    } else if (dto.projectNames && dto.projectNames.length > 0) {
      dto.projectNames.forEach((pName, idx) => {
        if (pName && pName.trim()) {
          projects.push({
            id: `proj-${Date.now().toString(36)}-${idx + 1}`,
            name: pName.trim(),
            location: dto.location || 'Maharashtra',
            status: 'UPCOMING',
          });
        }
      });
    }

    const stageHistory: PartnerStageHistoryEntry[] = [
      {
        id: `sh-${Date.now().toString(36)}-init`,
        toStage: stage,
        changedAt: now,
        actorId: dto.assignedMemberId,
        actorName: dto.assignedMemberName || 'Team Member',
        notes: 'Partner record created.',
      },
    ];

    const newPartner: RealEstatePartnerRecord = {
      id,
      workspaceId,
      companyName: dto.companyName.trim(),
      contactPerson: dto.contactPerson?.trim() || undefined,
      phone: dto.phone.trim(),
      email: dto.email?.trim() || undefined,
      partnerType: dto.partnerType,
      stage,
      assignedMemberId: dto.assignedMemberId,
      assignedMemberName: dto.assignedMemberName || 'Assigned Member',
      location: dto.location?.trim() || undefined,
      website: dto.website?.trim() || undefined,
      projects,
      marketingRequirements: dto.marketingRequirements || [],
      serviceRequirementsText: dto.serviceRequirementsText?.trim() || undefined,
      partnershipInterest: dto.partnershipInterest?.trim() || undefined,
      source: dto.source?.trim() || 'Direct Inbound',
      notes: dto.notes?.trim() || undefined,
      tags: [dto.partnerType.toLowerCase().replace(/_/g, '-')],
      lastActivityDate: now,
      stageHistory,
      linkedTaskIds: [],
      linkedMeetingIds: [],
      linkedCampaignIds: [],
      documents: [],
      createdAt: now,
      updatedAt: now,
    };

    this.partnerRecords.unshift(newPartner);

    // Also register in shared CRM summary list for overview and global search
    this.records.unshift({
      id: newPartner.id,
      workspaceId,
      type: CrmType.RE_PARTNER,
      name: newPartner.companyName,
      company: newPartner.companyName,
      phone: newPartner.phone,
      email: newPartner.email,
      stage: newPartner.stage,
      assignedMemberId: newPartner.assignedMemberId,
      assignedMemberName: newPartner.assignedMemberName,
      lastActivityDate: now,
      requirementSummary: newPartner.serviceRequirementsText || newPartner.partnershipInterest || `${newPartner.partnerType} partner`,
      projectOrLocation: newPartner.projects[0]?.name || newPartner.location,
      tags: newPartner.tags,
      createdAt: now,
      updatedAt: now,
    });

    // Log interaction
    this.interactions.unshift({
      id: `int-part-${Date.now().toString(36)}`,
      workspaceId,
      recordId: newPartner.id,
      recordType: CrmType.RE_PARTNER,
      type: CrmInteractionType.NOTE,
      title: `New Partner created: ${newPartner.companyName}`,
      description: `Partner Type: ${newPartner.partnerType}. Initial Stage: ${stage}`,
      actorId: newPartner.assignedMemberId,
      actorName: newPartner.assignedMemberName,
      timestamp: now,
    });

    return newPartner;
  }

  // ==========================================
  // UPDATE PARTNER RECORD
  // ==========================================
  updatePartnerRecord(
    workspaceId: string,
    id: string,
    dto: UpdatePartnerRecordDto,
  ): RealEstatePartnerRecord {
    this.validateRealEstateWorkspace(workspaceId);

    const record = this.partnerRecords.find((p) => p.id === id && p.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Partner record #${id} not found.`);
    }

    const now = new Date().toISOString();

    if (dto.companyName !== undefined) record.companyName = dto.companyName.trim();
    if (dto.contactPerson !== undefined) record.contactPerson = dto.contactPerson?.trim() || undefined;
    if (dto.phone !== undefined) record.phone = dto.phone.trim();
    if (dto.email !== undefined) record.email = dto.email?.trim() || undefined;
    if (dto.partnerType !== undefined) record.partnerType = dto.partnerType;
    if (dto.assignedMemberId !== undefined) record.assignedMemberId = dto.assignedMemberId;
    if (dto.assignedMemberName !== undefined) record.assignedMemberName = dto.assignedMemberName;
    if (dto.location !== undefined) record.location = dto.location?.trim() || undefined;
    if (dto.website !== undefined) record.website = dto.website?.trim() || undefined;
    if (dto.marketingRequirements !== undefined) record.marketingRequirements = dto.marketingRequirements;
    if (dto.serviceRequirementsText !== undefined) record.serviceRequirementsText = dto.serviceRequirementsText?.trim() || undefined;
    if (dto.partnershipInterest !== undefined) record.partnershipInterest = dto.partnershipInterest?.trim() || undefined;
    if (dto.source !== undefined) record.source = dto.source?.trim() || undefined;
    if (dto.notes !== undefined) record.notes = dto.notes?.trim() || undefined;

    record.lastActivityDate = now;
    record.updatedAt = now;

    // Sync shared record
    const summaryItem = this.records.find((r) => r.id === id);
    if (summaryItem) {
      summaryItem.name = record.companyName;
      summaryItem.company = record.companyName;
      summaryItem.phone = record.phone;
      summaryItem.email = record.email;
      summaryItem.assignedMemberId = record.assignedMemberId;
      summaryItem.assignedMemberName = record.assignedMemberName;
      summaryItem.lastActivityDate = now;
      summaryItem.updatedAt = now;
    }

    return record;
  }

  // ==========================================
  // CHANGE PARTNER STAGE
  // ==========================================
  changePartnerStage(
    workspaceId: string,
    id: string,
    dto: ChangePartnerStageDto,
  ): RealEstatePartnerRecord {
    this.validateRealEstateWorkspace(workspaceId);

    const record = this.partnerRecords.find((p) => p.id === id && p.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Partner record #${id} not found.`);
    }

    if (!dto.stage) {
      throw new BadRequestException('Target stage is required.');
    }

    if (
      (dto.stage === RealEstatePartnerStage.LOST || dto.stage === RealEstatePartnerStage.NOT_INTERESTED) &&
      !dto.lostReason &&
      !dto.notes
    ) {
      throw new BadRequestException('A reason or note is required when marking a partner as Lost or Not Interested.');
    }

    if (dto.stage === RealEstatePartnerStage.FOLLOW_UP_LATER && !dto.followUpLaterDate) {
      throw new BadRequestException('Next follow-up date is required when moving to Follow Up Later stage.');
    }

    const now = new Date().toISOString();
    const fromStage = record.stage;
    record.stage = dto.stage;

    if (dto.stage === RealEstatePartnerStage.FOLLOW_UP_LATER && dto.followUpLaterDate) {
      record.nextFollowUpDate = dto.followUpLaterDate;
      record.nextFollowUpTitle = dto.notes || 'Follow-up scheduled with partner';
    }

    const stageEntry: PartnerStageHistoryEntry = {
      id: `sh-${Date.now().toString(36)}`,
      fromStage,
      toStage: dto.stage,
      changedAt: now,
      actorId: dto.actorId || record.assignedMemberId,
      actorName: dto.actorName || record.assignedMemberName,
      notes: dto.notes,
      lostReason: dto.lostReason,
      followUpLaterDate: dto.followUpLaterDate,
    };

    record.stageHistory.push(stageEntry);
    record.lastActivityDate = now;
    record.updatedAt = now;

    // Sync shared summary
    const summaryItem = this.records.find((r) => r.id === id);
    if (summaryItem) {
      summaryItem.stage = dto.stage;
      summaryItem.lastActivityDate = now;
      summaryItem.updatedAt = now;
    }

    // Log interaction
    this.interactions.unshift({
      id: `int-stg-${Date.now().toString(36)}`,
      workspaceId,
      recordId: record.id,
      recordType: CrmType.RE_PARTNER,
      type: CrmInteractionType.STAGE_CHANGE,
      title: `Partner stage changed: ${fromStage} → ${dto.stage}`,
      description: dto.notes || dto.lostReason || `Transitioned by ${dto.actorName || 'Team'}`,
      actorId: dto.actorId || record.assignedMemberId,
      actorName: dto.actorName || record.assignedMemberName,
      timestamp: now,
    });

    return record;
  }

  // ==========================================
  // CONFIRM OR ACTIVATE PARTNER
  // ==========================================
  confirmOrActivatePartner(
    workspaceId: string,
    id: string,
    dto: ConfirmOrActivatePartnerDto,
  ): RealEstatePartnerRecord {
    this.validateRealEstateWorkspace(workspaceId);

    const record = this.partnerRecords.find((p) => p.id === id && p.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Partner record #${id} not found.`);
    }

    const now = new Date().toISOString();
    const fromStage = record.stage;

    if (dto.mode === 'CONFIRM') {
      record.stage = RealEstatePartnerStage.PARTNERSHIP_CONFIRMED;
      record.mandateSignedAt = now;
    } else {
      record.stage = RealEstatePartnerStage.ACTIVE_PARTNER;
      record.activeSince = now;
    }

    const historyEntry: PartnerStageHistoryEntry = {
      id: `sh-conf-${Date.now().toString(36)}`,
      fromStage,
      toStage: record.stage,
      changedAt: now,
      actorId: dto.actorId || record.assignedMemberId,
      actorName: dto.actorName || record.assignedMemberName,
      mandateType: dto.mandateType,
      notes: dto.notes || (dto.mode === 'CONFIRM' ? 'Partnership mandate confirmed and signed.' : 'Partner activated for operational delivery.'),
    };

    record.stageHistory.push(historyEntry);
    record.lastActivityDate = now;
    record.updatedAt = now;

    // Sync shared record
    const summaryItem = this.records.find((r) => r.id === id);
    if (summaryItem) {
      summaryItem.stage = record.stage;
      summaryItem.lastActivityDate = now;
      summaryItem.updatedAt = now;
    }

    this.interactions.unshift({
      id: `int-act-${Date.now().toString(36)}`,
      workspaceId,
      recordId: record.id,
      recordType: CrmType.RE_PARTNER,
      type: CrmInteractionType.STAGE_CHANGE,
      title: dto.mode === 'CONFIRM' ? 'Partnership Confirmed' : 'Partner Activated',
      description: dto.notes || `Mandate: ${dto.mandateType || 'Commercial agreement executed'}`,
      actorId: dto.actorId || record.assignedMemberId,
      actorName: dto.actorName || record.assignedMemberName,
      timestamp: now,
    });

    return record;
  }

  // ==========================================
  // ADD PARTNER PROJECT
  // ==========================================
  addPartnerProject(
    workspaceId: string,
    id: string,
    dto: AddPartnerProjectDto,
  ): PartnerProjectRef {
    this.validateRealEstateWorkspace(workspaceId);

    const record = this.partnerRecords.find((p) => p.id === id && p.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Partner record #${id} not found.`);
    }

    if (!dto.name || !dto.name.trim()) {
      throw new BadRequestException('Project name is required.');
    }

    const now = new Date().toISOString();
    const project: PartnerProjectRef = {
      id: `proj-${Date.now().toString(36)}`,
      name: dto.name.trim(),
      projectType: dto.projectType,
      location: dto.location ? dto.location.trim() : (record.location || 'Maharashtra'),
      reraNumber: dto.reraNumber ? dto.reraNumber.trim() : undefined,
      totalUnitsOrAcres: dto.totalUnitsOrAcres ? dto.totalUnitsOrAcres.trim() : undefined,
      status: dto.status || 'UPCOMING',
      linkedCampaignIds: [],
    };

    if (!record.projects) record.projects = [];
    record.projects.push(project);
    record.lastActivityDate = now;
    record.updatedAt = now;

    this.interactions.unshift({
      id: `int-proj-${Date.now().toString(36)}`,
      workspaceId,
      recordId: record.id,
      recordType: CrmType.RE_PARTNER,
      type: CrmInteractionType.NOTE,
      title: `Project added: ${project.name}`,
      description: `Location: ${project.location}. Status: ${project.status}${project.reraNumber ? `. RERA: ${project.reraNumber}` : ''}`,
      actorId: record.assignedMemberId,
      actorName: record.assignedMemberName,
      timestamp: now,
    });

    return project;
  }

  // ==========================================
  // CREATE PARTNER LINKED TASK (Shared Task Engine)
  // ==========================================
  async createPartnerLinkedTask(
    workspaceId: string,
    id: string,
    dto: CreatePartnerLinkedTaskDto,
  ) {
    this.validateRealEstateWorkspace(workspaceId);

    const record = this.partnerRecords.find((p) => p.id === id && p.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Partner record #${id} not found.`);
    }

    if (!dto.title || !dto.title.trim()) {
      throw new BadRequestException('Task title is required.');
    }

    const now = new Date().toISOString();
    let createdTaskId = `task-${Date.now().toString(36)}`;

    if (this.tasksService) {
      const task = this.tasksService.create(
        {
          workspaceId,
          title: dto.title.trim(),
          description: dto.description?.trim() || `Follow-up task for partner: ${record.companyName}`,
          deadline: dto.deadline || new Date(Date.now() + 3 * 86400000).toISOString(),
          priority: dto.priority || TaskPriority.MEDIUM,
          assigneeId: dto.assigneeId || record.assignedMemberId,
          plannedStart: new Date().toISOString(),
          linkedRecord: {
            id: record.id,
            title: record.companyName,
            type: 'crm',
          },
        },
        record.assignedMemberId,
        record.assignedMemberName,
      );
      createdTaskId = task.id;
    }

    if (!record.linkedTaskIds) record.linkedTaskIds = [];
    record.linkedTaskIds.push(createdTaskId);
    record.lastActivityDate = now;
    record.updatedAt = now;

    // Log interaction
    this.interactions.unshift({
      id: `int-tsk-${Date.now().toString(36)}`,
      workspaceId,
      recordId: record.id,
      recordType: CrmType.RE_PARTNER,
      type: CrmInteractionType.NOTE,
      title: `Linked task created: ${dto.title}`,
      description: dto.description || 'Task registered in workspace task register.',
      actorId: record.assignedMemberId,
      actorName: record.assignedMemberName,
      timestamp: now,
    });

    return {
      taskId: createdTaskId,
      title: dto.title,
      recordId: record.id,
    };
  }

  // ==========================================
  // SCHEDULE PARTNER MEETING (Meetings API)
  // ==========================================
  async schedulePartnerMeeting(
    workspaceId: string,
    id: string,
    dto: SchedulePartnerMeetingDto,
  ) {
    this.validateRealEstateWorkspace(workspaceId);

    const record = this.partnerRecords.find((p) => p.id === id && p.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Partner record #${id} not found.`);
    }

    if (!dto.title || !dto.title.trim()) {
      throw new BadRequestException('Meeting title is required.');
    }
    if (!dto.scheduledAt) {
      throw new BadRequestException('Meeting scheduled time is required.');
    }

    const now = new Date().toISOString();
    let meetingId = `mtg-re-${Date.now().toString(36)}`;

    if (this.meetingsService) {
      try {
        const meeting = await (this.meetingsService as any).create({
          workspaceId,
          title: dto.title.trim(),
          scheduledAt: dto.scheduledAt,
          agenda: dto.agenda || `Meeting with ${record.companyName} (${record.contactPerson || 'Key Executive'})`,
          hostId: dto.hostId || record.assignedMemberId,
          linkedPartnerId: record.id,
          linkedProjectId: dto.projectId,
        });
        if (meeting?.id) meetingId = meeting.id;
      } catch (err) {
        // Fallback to local ID if meetingsService has different signature
      }
    }

    if (!record.linkedMeetingIds) record.linkedMeetingIds = [];
    record.linkedMeetingIds.push(meetingId);
    record.lastActivityDate = now;
    record.updatedAt = now;

    // If meeting planned, optionally progress stage if still at initial contact
    if (record.stage === RealEstatePartnerStage.NEW_PARTNER_LEAD || record.stage === RealEstatePartnerStage.INITIAL_CONTACT) {
      this.changePartnerStage(workspaceId, record.id, {
        stage: RealEstatePartnerStage.MEETING_PLANNED,
        notes: `Meeting scheduled: ${dto.title}`,
      });
    }

    this.interactions.unshift({
      id: `int-mtg-${Date.now().toString(36)}`,
      workspaceId,
      recordId: record.id,
      recordType: CrmType.RE_PARTNER,
      type: CrmInteractionType.MEETING,
      title: `Meeting scheduled: ${dto.title}`,
      description: `Scheduled at: ${dto.scheduledAt}. ${dto.agenda || ''}`,
      actorId: dto.hostId || record.assignedMemberId,
      actorName: record.assignedMemberName,
      timestamp: now,
    });

    return {
      meetingId,
      title: dto.title,
      scheduledAt: dto.scheduledAt,
      recordId: record.id,
    };
  }

  // ==========================================
  // ADD PARTNER INTERACTION / NOTE
  // ==========================================
  addPartnerInteraction(
    workspaceId: string,
    id: string,
    dto: {
      type: CrmInteractionType;
      title: string;
      description?: string;
      actorId?: string;
      actorName?: string;
    },
  ): CrmInteractionItem {
    this.validateRealEstateWorkspace(workspaceId);

    const record = this.partnerRecords.find((p) => p.id === id && p.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Partner record #${id} not found.`);
    }

    if (!dto.title || !dto.title.trim()) {
      throw new BadRequestException('Interaction title is required.');
    }

    const now = new Date().toISOString();
    const interaction: CrmInteractionItem = {
      id: `int-part-${Date.now().toString(36)}`,
      workspaceId,
      recordId: record.id,
      recordType: CrmType.RE_PARTNER,
      type: dto.type || CrmInteractionType.NOTE,
      title: dto.title.trim(),
      description: dto.description?.trim(),
      actorId: dto.actorId || record.assignedMemberId,
      actorName: dto.actorName || record.assignedMemberName,
      timestamp: now,
    };

    this.interactions.unshift(interaction);
    record.lastActivityDate = now;
    record.updatedAt = now;

    return interaction;
  }

  // ============================================================
  // REAL ESTATE BUYERS & PROPERTY CUSTOMERS CRM (FEATURE 13)
  // ============================================================

  private seedBuyerData() {
    const realWs = 'ws-real-0002-0000-000000000002';
    const anantId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    const rohitId = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';
    const utkarshId = 'c3d4e5f6-a7b8-9012-cdef-123456789012';

    this.buyerRecords = [
      {
        id: 'buyer-re-001',
        workspaceId: realWs,
        customerName: 'Vikram Malhotra',
        phone: '+91 99304 44556',
        email: 'vikram.m@gmail.com',
        preferredContactMethod: 'PHONE',
        stage: RealEstateBuyerStage.SITE_VISIT_COMPLETED,
        assignedMemberId: anantId,
        assignedMemberName: 'Anant',
        locality: 'Alibaug Coast',
        propertyType: BuyerPropertyType.VILLA,
        configuration: BuyerPropertyConfiguration.FOUR_PLUS_BHK,
        minBudget: 30000000,
        maxBudget: 45000000,
        buyingTimeline: BuyerBuyingTimeline.ONE_TO_THREE_MONTHS,
        purpose: BuyerPurchasePurpose.SECOND_HOME,
        preferredProject: 'Emerald Heights Luxury Villas',
        sourceCampaign: 'camp-re-001',
        enquirySource: 'Meta Coastal Luxury Campaign',
        notes: 'Visited Villa 12 on Nov 4th. Very positive about private pool and sunset deck. Discussing payment milestones.',
        tags: ['buyer', 'hni', 'coastal-villa', 'alibaug'],
        nextFollowUpDate: '2026-11-06T10:00:00.000Z',
        nextFollowUpTitle: 'Review customized milestone schedule and furniture package with Vikram',
        lastActivityDate: '2026-11-04T17:00:00.000Z',
        stageHistory: [
          {
            id: 'sh-b1-1',
            toStage: RealEstateBuyerStage.NEW_ENQUIRY,
            changedAt: '2026-10-20T11:00:00.000Z',
            actorId: anantId,
            actorName: 'Anant',
            notes: 'Enquiry received from Meta lead gen campaign.',
          },
          {
            id: 'sh-b1-2',
            fromStage: RealEstateBuyerStage.NEW_ENQUIRY,
            toStage: RealEstateBuyerStage.CONTACTED,
            changedAt: '2026-10-21T10:30:00.000Z',
            actorId: anantId,
            actorName: 'Anant',
            notes: 'Spoke with Vikram. Looking for weekend family getaway home.',
          },
          {
            id: 'sh-b1-3',
            fromStage: RealEstateBuyerStage.CONTACTED,
            toStage: RealEstateBuyerStage.QUALIFIED_BUYER,
            changedAt: '2026-10-25T14:00:00.000Z',
            actorId: anantId,
            actorName: 'Anant',
            notes: 'Budget verified: ₹3.5 - 4 Cr self-funded.',
          },
          {
            id: 'sh-b1-4',
            fromStage: RealEstateBuyerStage.QUALIFIED_BUYER,
            toStage: RealEstateBuyerStage.SITE_VISIT_PLANNED,
            changedAt: '2026-10-30T16:00:00.000Z',
            actorId: anantId,
            actorName: 'Anant',
            notes: 'Scheduled site visit for Nov 4th.',
          },
          {
            id: 'sh-b1-5',
            fromStage: RealEstateBuyerStage.SITE_VISIT_PLANNED,
            toStage: RealEstateBuyerStage.SITE_VISIT_COMPLETED,
            changedAt: '2026-11-04T17:00:00.000Z',
            actorId: anantId,
            actorName: 'Anant',
            notes: 'Site visit completed. Customer walked through Villa 12.',
          },
        ],
        sharedProperties: [
          {
            id: 'sp-1',
            name: 'Emerald Heights Villa 12',
            location: 'Awas Road, Alibaug',
            propertyType: 'Luxury Villa',
            configuration: '4 BHK + Pool',
            priceEstimate: 38500000,
            sharedAt: '2026-10-26T12:00:00.000Z',
            feedback: 'Loved the architecture and high ceilings.',
          },
        ],
        siteVisitIds: ['vis-re-001'],
        linkedTaskIds: ['task-b1-1'],
        createdAt: '2026-10-20T11:00:00.000Z',
        updatedAt: '2026-11-04T17:00:00.000Z',
      },
      {
        id: 'buyer-re-002',
        workspaceId: realWs,
        customerName: 'Pooja Sharma',
        phone: '+91 99305 55667',
        email: 'pooja.sharma@outlook.com',
        preferredContactMethod: 'WHATSAPP',
        stage: RealEstateBuyerStage.FOLLOWUP_DISCUSSION,
        assignedMemberId: rohitId,
        assignedMemberName: 'Rohit',
        locality: 'Worli Sea Face, Mumbai',
        propertyType: BuyerPropertyType.APARTMENT,
        configuration: BuyerPropertyConfiguration.THREE_BHK,
        minBudget: 18000000,
        maxBudget: 25000000,
        buyingTimeline: BuyerBuyingTimeline.IMMEDIATE,
        purpose: BuyerPurchasePurpose.END_USE,
        preferredProject: 'The Grand Horizon Luxury Towers',
        sourceCampaign: 'camp-re-002',
        enquirySource: 'Google Search Ads',
        notes: 'Requested unit hold on 1402 (East-facing 3BHK). Token cheque ready, waiting for bank loan pre-approval letter.',
        tags: ['buyer', 'token-hold', 'worli', 'apartment'],
        nextFollowUpDate: '2026-11-07T11:30:00.000Z',
        nextFollowUpTitle: 'Send payment schedule and token receipt for Unit 1402',
        lastActivityDate: '2026-11-04T12:00:00.000Z',
        stageHistory: [
          {
            id: 'sh-b2-1',
            toStage: RealEstateBuyerStage.NEW_ENQUIRY,
            changedAt: '2026-10-25T14:00:00.000Z',
            actorId: rohitId,
            actorName: 'Rohit',
            notes: 'Inbound enquiry for Worli 3BHK.',
          },
          {
            id: 'sh-b2-2',
            fromStage: RealEstateBuyerStage.NEW_ENQUIRY,
            toStage: RealEstateBuyerStage.FOLLOWUP_DISCUSSION,
            changedAt: '2026-11-04T12:00:00.000Z',
            actorId: rohitId,
            actorName: 'Rohit',
            notes: 'Discussing token receipt and unit hold agreement.',
          },
        ],
        sharedProperties: [
          {
            id: 'sp-2',
            name: 'The Grand Horizon Unit 1402',
            location: 'Worli Sea Face, Mumbai',
            propertyType: 'Luxury Apartment',
            configuration: '3 BHK',
            priceEstimate: 21500000,
            sharedAt: '2026-10-28T10:00:00.000Z',
            feedback: 'Selected floor 14 for morning sunlight.',
          },
        ],
        siteVisitIds: [],
        createdAt: '2026-10-25T14:00:00.000Z',
        updatedAt: '2026-11-04T12:00:00.000Z',
      },
      {
        id: 'buyer-re-003',
        workspaceId: realWs,
        customerName: 'Dr. Sameer Joshi',
        phone: '+91 99306 66778',
        email: 'sameer.joshi@mednet.org',
        preferredContactMethod: 'PHONE',
        stage: RealEstateBuyerStage.NEW_ENQUIRY,
        assignedMemberId: utkarshId,
        assignedMemberName: 'Utkarsh',
        locality: 'Kharadi, Pune',
        propertyType: BuyerPropertyType.PENTHOUSE,
        configuration: BuyerPropertyConfiguration.FOUR_PLUS_BHK,
        minBudget: 35000000,
        maxBudget: 50000000,
        buyingTimeline: BuyerBuyingTimeline.THREE_TO_SIX_MONTHS,
        purpose: BuyerPurchasePurpose.END_USE,
        preferredProject: 'Sterling Park Residences',
        enquirySource: 'Direct Website Form',
        notes: 'Senior cardiologist at Ruby Hall. Needs rooftop terrace and dual car park.',
        tags: ['buyer', 'penthouse', 'pune', 'doctor'],
        nextFollowUpDate: '2026-11-05T17:00:00.000Z',
        nextFollowUpTitle: 'Call to introduce Emerald Heights floorplans and understand timeline',
        lastActivityDate: '2026-11-05T10:00:00.000Z',
        stageHistory: [
          {
            id: 'sh-b3-1',
            toStage: RealEstateBuyerStage.NEW_ENQUIRY,
            changedAt: '2026-11-05T10:00:00.000Z',
            actorId: utkarshId,
            actorName: 'Utkarsh',
            notes: 'Enquiry received today.',
          },
        ],
        sharedProperties: [],
        siteVisitIds: [],
        createdAt: '2026-11-05T10:00:00.000Z',
        updatedAt: '2026-11-05T10:00:00.000Z',
      },
      {
        id: 'buyer-re-004',
        workspaceId: realWs,
        customerName: 'Rajesh & Sunita Aggarwal',
        phone: '+91 99309 11223',
        email: 'aggarwal.family@gmail.com',
        preferredContactMethod: 'PHONE',
        stage: RealEstateBuyerStage.SITE_VISIT_PLANNED,
        assignedMemberId: anantId,
        assignedMemberName: 'Anant',
        locality: 'Mandwa / Awas, Alibaug',
        propertyType: BuyerPropertyType.VILLA,
        configuration: BuyerPropertyConfiguration.THREE_BHK,
        minBudget: 20000000,
        maxBudget: 30000000,
        buyingTimeline: BuyerBuyingTimeline.ONE_TO_THREE_MONTHS,
        purpose: BuyerPurchasePurpose.SECOND_HOME,
        preferredProject: 'Skyline Marina Bay Residences',
        enquirySource: 'Referral (Anant)',
        notes: 'Planning weekend trip on speed-boat from Gateway to Mandwa.',
        tags: ['buyer', 'alibaug', 'coastal'],
        nextFollowUpDate: '2026-11-08T15:00:00.000Z',
        nextFollowUpTitle: 'Coordinate private speedboat jetty pickup and site escort',
        lastActivityDate: '2026-11-04T15:00:00.000Z',
        stageHistory: [
          {
            id: 'sh-b4-1',
            toStage: RealEstateBuyerStage.SITE_VISIT_PLANNED,
            changedAt: '2026-11-04T15:00:00.000Z',
            actorId: anantId,
            actorName: 'Anant',
            notes: 'Site visit fixed for Nov 8th afternoon.',
          },
        ],
        sharedProperties: [],
        siteVisitIds: [],
        createdAt: '2026-10-28T09:00:00.000Z',
        updatedAt: '2026-11-04T15:00:00.000Z',
      },
      {
        id: 'buyer-re-005',
        workspaceId: realWs,
        customerName: 'Kunal Mehta (NRI)',
        phone: '+91 99310 22334',
        email: 'kunal.mehta@sgfund.com',
        preferredContactMethod: 'EMAIL',
        stage: RealEstateBuyerStage.BOOKING_CONVERTED,
        assignedMemberId: anantId,
        assignedMemberName: 'Anant',
        locality: 'Worli Sea Face, Mumbai',
        propertyType: BuyerPropertyType.APARTMENT,
        configuration: BuyerPropertyConfiguration.FOUR_PLUS_BHK,
        minBudget: 60000000,
        maxBudget: 80000000,
        buyingTimeline: BuyerBuyingTimeline.IMMEDIATE,
        purpose: BuyerPurchasePurpose.INVESTMENT,
        preferredProject: 'The Grand Horizon Luxury Towers',
        enquirySource: 'NRI Showcase Webinar',
        notes: 'Booking converted for Penthouse B on floor 32. Total consideration: ₹7.2 Cr.',
        tags: ['buyer', 'converted', 'nri', 'worli'],
        nextFollowUpDate: '2026-11-15T12:00:00.000Z',
        nextFollowUpTitle: 'Registration agreement signing and stamp duty payment',
        lastActivityDate: '2026-11-03T18:00:00.000Z',
        stageHistory: [
          {
            id: 'sh-b5-1',
            toStage: RealEstateBuyerStage.BOOKING_CONVERTED,
            changedAt: '2026-11-03T18:00:00.000Z',
            actorId: anantId,
            actorName: 'Anant',
            notes: 'Formal booking form executed with 10% earnest money deposit.',
          },
        ],
        sharedProperties: [],
        siteVisitIds: [],
        createdAt: '2026-10-15T10:00:00.000Z',
        updatedAt: '2026-11-03T18:00:00.000Z',
      },
      {
        id: 'buyer-re-006',
        workspaceId: realWs,
        customerName: 'Sneha Kulkarni',
        phone: '+91 99311 33445',
        email: 'sneha.k@infosys.com',
        preferredContactMethod: 'WHATSAPP',
        stage: RealEstateBuyerStage.QUALIFIED_BUYER,
        assignedMemberId: rohitId,
        assignedMemberName: 'Rohit',
        locality: 'Hinjawadi, Pune',
        propertyType: BuyerPropertyType.PLOT,
        configuration: BuyerPropertyConfiguration.PLOT_LAND,
        minBudget: 8000000,
        maxBudget: 12000000,
        buyingTimeline: BuyerBuyingTimeline.THREE_TO_SIX_MONTHS,
        purpose: BuyerPurchasePurpose.INVESTMENT,
        preferredProject: 'Hinjawadi Vista Land Parcel',
        enquirySource: 'Property Portal (99acres)',
        notes: 'Software architect looking for 2000 sq ft residential plot near Phase 3 tech park.',
        tags: ['buyer', 'plot', 'hinjawadi', 'tech-worker'],
        nextFollowUpDate: '2026-11-09T14:00:00.000Z',
        nextFollowUpTitle: 'Share plot layout blueprints and FSI approvals',
        lastActivityDate: '2026-11-02T16:00:00.000Z',
        stageHistory: [
          {
            id: 'sh-b6-1',
            toStage: RealEstateBuyerStage.QUALIFIED_BUYER,
            changedAt: '2026-11-02T16:00:00.000Z',
            actorId: rohitId,
            actorName: 'Rohit',
            notes: 'Qualified on budget and clear title requirements.',
          },
        ],
        sharedProperties: [],
        siteVisitIds: [],
        createdAt: '2026-10-26T11:00:00.000Z',
        updatedAt: '2026-11-02T16:00:00.000Z',
      },
      {
        id: 'buyer-re-007',
        workspaceId: realWs,
        customerName: 'Harish Chawla',
        phone: '+91 99312 44556',
        email: 'harish.chawla@rediffmail.com',
        preferredContactMethod: 'PHONE',
        stage: RealEstateBuyerStage.CONTACT_PENDING,
        assignedMemberId: utkarshId,
        assignedMemberName: 'Utkarsh',
        locality: 'Lonavala',
        propertyType: BuyerPropertyType.VILLA,
        configuration: BuyerPropertyConfiguration.VILLA,
        minBudget: 15000000,
        maxBudget: 22000000,
        buyingTimeline: BuyerBuyingTimeline.MORE_THAN_SIX_MONTHS,
        purpose: BuyerPurchasePurpose.SECOND_HOME,
        preferredProject: 'Lonavala Eco Retreat',
        enquirySource: 'Instagram Ad Campaign',
        notes: 'Submitted lead form for eco-farmhouse. Needs initial discovery call.',
        tags: ['buyer', 'lonavala', 'farmhouse'],
        nextFollowUpDate: '2026-11-06T16:00:00.000Z',
        nextFollowUpTitle: 'Attempt first outbound call',
        lastActivityDate: '2026-11-05T09:00:00.000Z',
        stageHistory: [
          {
            id: 'sh-b7-1',
            toStage: RealEstateBuyerStage.CONTACT_PENDING,
            changedAt: '2026-11-05T09:00:00.000Z',
            actorId: utkarshId,
            actorName: 'Utkarsh',
            notes: 'Assigned to Utkarsh for initial contact.',
          },
        ],
        sharedProperties: [],
        siteVisitIds: [],
        createdAt: '2026-11-05T09:00:00.000Z',
        updatedAt: '2026-11-05T09:00:00.000Z',
      },
      {
        id: 'buyer-re-008',
        workspaceId: realWs,
        customerName: 'Anandita Ray',
        phone: '+91 99313 55667',
        email: 'anandita.ray@tcs.com',
        preferredContactMethod: 'WHATSAPP',
        stage: RealEstateBuyerStage.PROPERTY_SHARED,
        assignedMemberId: rohitId,
        assignedMemberName: 'Rohit',
        locality: 'Kharadi, Pune',
        propertyType: BuyerPropertyType.APARTMENT,
        configuration: BuyerPropertyConfiguration.TWO_BHK,
        minBudget: 7500000,
        maxBudget: 9500000,
        buyingTimeline: BuyerBuyingTimeline.ONE_TO_THREE_MONTHS,
        purpose: BuyerPurchasePurpose.END_USE,
        preferredProject: 'Sterling Park Residences',
        enquirySource: 'Housing.com',
        notes: 'Shared 2BHK brochures and carpet area specs. Likes Tower 2 floor plans.',
        tags: ['buyer', 'kharadi', '2bhk'],
        nextFollowUpDate: '2026-11-07T18:00:00.000Z',
        nextFollowUpTitle: 'Follow up on brochure and payment plan shared on WhatsApp',
        lastActivityDate: '2026-11-03T15:00:00.000Z',
        stageHistory: [
          {
            id: 'sh-b8-1',
            toStage: RealEstateBuyerStage.PROPERTY_SHARED,
            changedAt: '2026-11-03T15:00:00.000Z',
            actorId: rohitId,
            actorName: 'Rohit',
            notes: 'Sent digital brochure and pricing matrix via WhatsApp.',
          },
        ],
        sharedProperties: [
          {
            id: 'sp-8',
            name: 'Sterling Park Tower 2 Unit 504',
            location: 'Kharadi, Pune',
            propertyType: 'Apartment',
            configuration: '2 BHK (810 sqft)',
            priceEstimate: 8500000,
            sharedAt: '2026-11-03T15:00:00.000Z',
          },
        ],
        siteVisitIds: [],
        createdAt: '2026-10-30T10:00:00.000Z',
        updatedAt: '2026-11-03T15:00:00.000Z',
      },
    ];
  }

  // ==========================================
  // GET BUYER SUMMARY (Metrics & Breakdown)
  // ==========================================
  getBuyerSummary(workspaceId: string): BuyerCrmSummaryDto {
    this.validateRealEstateWorkspace(workspaceId);

    const buyers = this.buyerRecords.filter((b) => b.workspaceId === workspaceId);
    const now = new Date();

    const activePipelineCount = buyers.filter(
      (b) =>
        b.stage !== RealEstateBuyerStage.BOOKING_CONVERTED &&
        b.stage !== RealEstateBuyerStage.LOST &&
        b.stage !== RealEstateBuyerStage.NOT_INTERESTED,
    ).length;

    const siteVisitsPlannedCount = buyers.filter(
      (b) => b.stage === RealEstateBuyerStage.SITE_VISIT_PLANNED,
    ).length;

    const siteVisitsCompletedCount = buyers.filter(
      (b) => b.stage === RealEstateBuyerStage.SITE_VISIT_COMPLETED,
    ).length;

    const bookingsConvertedCount = buyers.filter(
      (b) => b.stage === RealEstateBuyerStage.BOOKING_CONVERTED,
    ).length;

    const overdueFollowUpsCount = buyers.filter((b) => {
      if (!b.nextFollowUpDate) return false;
      const fDate = new Date(b.nextFollowUpDate);
      return (
        fDate < now &&
        b.stage !== RealEstateBuyerStage.LOST &&
        b.stage !== RealEstateBuyerStage.NOT_INTERESTED
      );
    }).length;

    const byStage: Record<RealEstateBuyerStage, number> = {
      [RealEstateBuyerStage.NEW_ENQUIRY]: 0,
      [RealEstateBuyerStage.CONTACT_PENDING]: 0,
      [RealEstateBuyerStage.CONTACTED]: 0,
      [RealEstateBuyerStage.REQUIREMENT_CAPTURED]: 0,
      [RealEstateBuyerStage.QUALIFIED_BUYER]: 0,
      [RealEstateBuyerStage.PROPERTY_SHARED]: 0,
      [RealEstateBuyerStage.SITE_VISIT_PLANNED]: 0,
      [RealEstateBuyerStage.SITE_VISIT_COMPLETED]: 0,
      [RealEstateBuyerStage.FOLLOWUP_DISCUSSION]: 0,
      [RealEstateBuyerStage.BOOKING_CONVERTED]: 0,
      [RealEstateBuyerStage.NOT_INTERESTED]: 0,
      [RealEstateBuyerStage.LOST]: 0,
      [RealEstateBuyerStage.FOLLOW_UP_LATER]: 0,
    };
    buyers.forEach((b) => {
      if (byStage[b.stage] !== undefined) {
        byStage[b.stage]++;
      }
    });

    const byConfiguration: Record<string, number> = {};
    buyers.forEach((b) => {
      if (b.configuration) {
        byConfiguration[b.configuration] = (byConfiguration[b.configuration] || 0) + 1;
      }
    });

    const memberMap = new Map<string, { memberName: string; totalAssigned: number; activeCount: number }>();
    buyers.forEach((b) => {
      const entry = memberMap.get(b.assignedMemberId) || {
        memberName: b.assignedMemberName,
        totalAssigned: 0,
        activeCount: 0,
      };
      entry.totalAssigned++;
      if (
        b.stage !== RealEstateBuyerStage.LOST &&
        b.stage !== RealEstateBuyerStage.NOT_INTERESTED
      ) {
        entry.activeCount++;
      }
      memberMap.set(b.assignedMemberId, entry);
    });

    const byMember = Array.from(memberMap.entries()).map(([memberId, data]) => ({
      memberId,
      memberName: data.memberName,
      totalAssigned: data.totalAssigned,
      activeCount: data.activeCount,
    }));

    return {
      totalBuyers: buyers.length,
      activePipelineCount,
      siteVisitsPlannedCount,
      siteVisitsCompletedCount,
      bookingsConvertedCount,
      overdueFollowUpsCount,
      byStage,
      byConfiguration,
      byMember,
    };
  }

  // ==========================================
  // GET BUYER RECORDS (Search, Filter, Sort, Paginate)
  // ==========================================
  getBuyerRecords(
    workspaceId: string,
    filterDto: BuyerCrmFilterDto = {},
  ): PaginatedBuyerRecordsResponseDto {
    this.validateRealEstateWorkspace(workspaceId);

    let items = this.buyerRecords.filter((b) => b.workspaceId === workspaceId);

    // 1. Text Search
    if (filterDto.search && filterDto.search.trim()) {
      const q = filterDto.search.toLowerCase().trim();
      const normPhoneQuery = q.replace(/\D/g, '');

      items = items.filter((b) => {
        const matchName = b.customerName.toLowerCase().includes(q);
        const matchEmail = b.email ? b.email.toLowerCase().includes(q) : false;
        const matchLocality = b.locality ? b.locality.toLowerCase().includes(q) : false;
        const matchProject = b.preferredProject ? b.preferredProject.toLowerCase().includes(q) : false;
        const matchNotes = b.notes ? b.notes.toLowerCase().includes(q) : false;

        let matchPhone = false;
        if (normPhoneQuery.length >= 3) {
          const recPhone = b.phone.replace(/\D/g, '');
          matchPhone = recPhone.includes(normPhoneQuery);
        }

        return matchName || matchEmail || matchLocality || matchProject || matchNotes || matchPhone;
      });
    }

    // 2. Stage Filter
    if (filterDto.stage) {
      items = items.filter((b) => b.stage === filterDto.stage);
    }

    // 3. Assigned Member Filter
    if (filterDto.assignedMemberId) {
      items = items.filter((b) => b.assignedMemberId === filterDto.assignedMemberId);
    }

    // 4. Locality Filter
    if (filterDto.locality && filterDto.locality.trim()) {
      const loc = filterDto.locality.toLowerCase().trim();
      items = items.filter((b) => b.locality && b.locality.toLowerCase().includes(loc));
    }

    // 5. Configuration Filter
    if (filterDto.configuration) {
      items = items.filter((b) => b.configuration === filterDto.configuration);
    }

    // 6. Property Type Filter
    if (filterDto.propertyType) {
      items = items.filter((b) => b.propertyType === filterDto.propertyType);
    }

    // 7. Preferred Project Filter
    if (filterDto.preferredProject && filterDto.preferredProject.trim()) {
      const projQ = filterDto.preferredProject.toLowerCase().trim();
      items = items.filter((b) => b.preferredProject && b.preferredProject.toLowerCase().includes(projQ));
    }

    // 8. Buying Timeline Filter
    if (filterDto.buyingTimeline) {
      items = items.filter((b) => b.buyingTimeline === filterDto.buyingTimeline);
    }

    // 9. Source Campaign Filter
    if (filterDto.sourceCampaign && filterDto.sourceCampaign.trim()) {
      items = items.filter((b) => b.sourceCampaign === filterDto.sourceCampaign);
    }

    // 10. Budget Filter
    if (filterDto.minBudget) {
      items = items.filter((b) => (b.maxBudget || b.minBudget || 0) >= filterDto.minBudget!);
    }
    if (filterDto.maxBudget) {
      items = items.filter((b) => (b.minBudget || b.maxBudget || 0) <= filterDto.maxBudget!);
    }

    // 11. Follow-up Due Filter
    if (filterDto.followUpDue && filterDto.followUpDue !== 'ALL') {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      const endOfWeek = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);

      items = items.filter((b) => {
        if (!b.nextFollowUpDate) return false;
        const fDate = new Date(b.nextFollowUpDate);

        if (filterDto.followUpDue === 'OVERDUE') {
          return fDate < startOfToday;
        }
        if (filterDto.followUpDue === 'TODAY') {
          return fDate >= startOfToday && fDate <= endOfToday;
        }
        if (filterDto.followUpDue === 'THIS_WEEK') {
          return fDate >= startOfToday && fDate <= endOfWeek;
        }
        return true;
      });
    }

    // 12. Sorting
    const sortBy = filterDto.sortBy || 'createdAt';
    const sortOrder = filterDto.sortOrder || 'desc';

    items.sort((a, b) => {
      let valA: any = a.createdAt;
      let valB: any = b.createdAt;

      if (sortBy === 'customerName') {
        valA = a.customerName.toLowerCase();
        valB = b.customerName.toLowerCase();
      } else if (sortBy === 'nextFollowUpDate') {
        valA = a.nextFollowUpDate ? new Date(a.nextFollowUpDate).getTime() : 0;
        valB = b.nextFollowUpDate ? new Date(b.nextFollowUpDate).getTime() : 0;
      } else if (sortBy === 'stage') {
        valA = a.stage;
        valB = b.stage;
      } else {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // 13. Pagination
    const page = filterDto.page && filterDto.page > 0 ? filterDto.page : 1;
    const pageSize = filterDto.pageSize && filterDto.pageSize > 0 ? filterDto.pageSize : 20;
    const total = items.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

    return {
      items: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  // ==========================================
  // GET BUYER RECORD BY ID
  // ==========================================
  getBuyerRecordById(workspaceId: string, id: string): RealEstateBuyerRecord {
    this.validateRealEstateWorkspace(workspaceId);

    const record = this.buyerRecords.find((b) => b.id === id && b.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Buyer record #${id} not found in this workspace.`);
    }
    return record;
  }

  // ==========================================
  // CHECK BUYER DUPLICATES
  // ==========================================
  checkBuyerDuplicates(
    workspaceId: string,
    dto: CheckBuyerDuplicatesDto,
  ): BuyerDuplicateMatchResult[] {
    this.validateRealEstateWorkspace(workspaceId);

    const matches: BuyerDuplicateMatchResult[] = [];
    const normPhone = dto.phone ? dto.phone.replace(/\D/g, '') : '';
    const normEmail = dto.email ? dto.email.trim().toLowerCase() : '';
    const normName = dto.customerName ? dto.customerName.trim().toLowerCase() : '';

    for (const record of this.buyerRecords) {
      if (record.workspaceId !== workspaceId) continue;
      if (dto.excludeId && record.id === dto.excludeId) continue;

      if (normPhone && normPhone.length >= 8) {
        const recPhone = record.phone.replace(/\D/g, '');
        if (recPhone && (recPhone.endsWith(normPhone) || normPhone.endsWith(recPhone))) {
          matches.push({ matchedBy: 'phone', record });
          continue;
        }
      }

      if (normEmail && record.email && record.email.trim().toLowerCase() === normEmail) {
        matches.push({ matchedBy: 'email', record });
        continue;
      }

      if (normName && record.customerName.trim().toLowerCase() === normName) {
        matches.push({ matchedBy: 'customerName', record });
        continue;
      }
    }

    return matches;
  }

  // ==========================================
  // CREATE BUYER RECORD
  // ==========================================
  createBuyerRecord(
    workspaceId: string,
    dto: CreateBuyerRecordDto,
  ): RealEstateBuyerRecord {
    this.validateRealEstateWorkspace(workspaceId);

    if (!dto.customerName || !dto.customerName.trim()) {
      throw new BadRequestException('Customer name is required.');
    }
    if (!dto.phone || !dto.phone.trim()) {
      throw new BadRequestException('Contact phone number is required.');
    }
    if (!dto.assignedMemberId) {
      throw new BadRequestException('Assigned team member is required.');
    }
    if (!dto.enquirySource || !dto.enquirySource.trim()) {
      throw new BadRequestException('Enquiry source is required.');
    }

    const now = new Date().toISOString();
    const id = `buyer-re-${Date.now().toString(36)}`;
    const stage = dto.initialStage || RealEstateBuyerStage.NEW_ENQUIRY;

    const stageHistory: BuyerStageHistoryEntry[] = [
      {
        id: `sh-${Date.now().toString(36)}-init`,
        toStage: stage,
        changedAt: now,
        actorId: dto.assignedMemberId,
        actorName: dto.assignedMemberName || 'Team Member',
        notes: `Buyer lead created from source: ${dto.enquirySource}`,
      },
    ];

    const newBuyer: RealEstateBuyerRecord = {
      id,
      workspaceId,
      customerName: dto.customerName.trim(),
      phone: dto.phone.trim(),
      email: dto.email?.trim() || undefined,
      preferredContactMethod: dto.preferredContactMethod || 'PHONE',
      stage,
      assignedMemberId: dto.assignedMemberId,
      assignedMemberName: dto.assignedMemberName || 'Assigned Member',
      locality: dto.locality?.trim() || undefined,
      propertyType: dto.propertyType,
      configuration: dto.configuration,
      minBudget: dto.minBudget,
      maxBudget: dto.maxBudget,
      buyingTimeline: dto.buyingTimeline,
      purpose: dto.purpose,
      preferredProject: dto.preferredProject?.trim() || undefined,
      sourceCampaign: dto.sourceCampaign?.trim() || undefined,
      enquirySource: dto.enquirySource.trim(),
      notes: dto.notes?.trim() || undefined,
      tags: ['buyer', dto.enquirySource.toLowerCase().replace(/\s+/g, '-')],
      lastActivityDate: now,
      stageHistory,
      sharedProperties: [],
      siteVisitIds: [],
      linkedTaskIds: [],
      createdAt: now,
      updatedAt: now,
    };

    this.buyerRecords.unshift(newBuyer);

    // Register in shared CRM summary list
    this.records.unshift({
      id: newBuyer.id,
      workspaceId,
      type: CrmType.RE_BUYER,
      name: newBuyer.customerName,
      phone: newBuyer.phone,
      email: newBuyer.email,
      stage: newBuyer.stage,
      assignedMemberId: newBuyer.assignedMemberId,
      assignedMemberName: newBuyer.assignedMemberName,
      lastActivityDate: now,
      requirementSummary: `${newBuyer.configuration || 'Property'} in ${newBuyer.locality || 'Alibaug/Pune'}`,
      projectOrLocation: newBuyer.preferredProject || newBuyer.locality,
      tags: newBuyer.tags,
      createdAt: now,
      updatedAt: now,
    });

    // Log interaction
    this.interactions.unshift({
      id: `int-byr-${Date.now().toString(36)}`,
      workspaceId,
      recordId: newBuyer.id,
      recordType: CrmType.RE_BUYER,
      type: CrmInteractionType.NOTE,
      title: `Buyer enquiry registered: ${newBuyer.customerName}`,
      description: `Source: ${newBuyer.enquirySource}. Stage: ${stage}`,
      actorId: newBuyer.assignedMemberId,
      actorName: newBuyer.assignedMemberName,
      timestamp: now,
    });

    return newBuyer;
  }

  // ==========================================
  // UPDATE BUYER RECORD
  // ==========================================
  updateBuyerRecord(
    workspaceId: string,
    id: string,
    dto: UpdateBuyerRecordDto,
  ): RealEstateBuyerRecord {
    this.validateRealEstateWorkspace(workspaceId);

    const record = this.buyerRecords.find((b) => b.id === id && b.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Buyer record #${id} not found.`);
    }

    const now = new Date().toISOString();

    if (dto.customerName !== undefined) record.customerName = dto.customerName.trim();
    if (dto.phone !== undefined) record.phone = dto.phone.trim();
    if (dto.email !== undefined) record.email = dto.email?.trim() || undefined;
    if (dto.preferredContactMethod !== undefined) record.preferredContactMethod = dto.preferredContactMethod;
    if (dto.assignedMemberId !== undefined) record.assignedMemberId = dto.assignedMemberId;
    if (dto.assignedMemberName !== undefined) record.assignedMemberName = dto.assignedMemberName;
    if (dto.locality !== undefined) record.locality = dto.locality?.trim() || undefined;
    if (dto.propertyType !== undefined) record.propertyType = dto.propertyType;
    if (dto.configuration !== undefined) record.configuration = dto.configuration;
    if (dto.minBudget !== undefined) record.minBudget = dto.minBudget;
    if (dto.maxBudget !== undefined) record.maxBudget = dto.maxBudget;
    if (dto.buyingTimeline !== undefined) record.buyingTimeline = dto.buyingTimeline;
    if (dto.purpose !== undefined) record.purpose = dto.purpose;
    if (dto.preferredProject !== undefined) record.preferredProject = dto.preferredProject?.trim() || undefined;
    if (dto.sourceCampaign !== undefined) record.sourceCampaign = dto.sourceCampaign?.trim() || undefined;
    if (dto.enquirySource !== undefined) record.enquirySource = dto.enquirySource.trim();
    if (dto.notes !== undefined) record.notes = dto.notes?.trim() || undefined;

    record.lastActivityDate = now;
    record.updatedAt = now;

    // Sync summary
    const summaryItem = this.records.find((r) => r.id === id);
    if (summaryItem) {
      summaryItem.name = record.customerName;
      summaryItem.phone = record.phone;
      summaryItem.email = record.email;
      summaryItem.assignedMemberId = record.assignedMemberId;
      summaryItem.assignedMemberName = record.assignedMemberName;
      summaryItem.lastActivityDate = now;
      summaryItem.updatedAt = now;
    }

    return record;
  }

  // ==========================================
  // CHANGE BUYER STAGE
  // ==========================================
  changeBuyerStage(
    workspaceId: string,
    id: string,
    dto: ChangeBuyerStageDto,
  ): RealEstateBuyerRecord {
    this.validateRealEstateWorkspace(workspaceId);

    const record = this.buyerRecords.find((b) => b.id === id && b.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Buyer record #${id} not found.`);
    }

    if (!dto.stage) {
      throw new BadRequestException('Target stage is required.');
    }

    if (
      (dto.stage === RealEstateBuyerStage.LOST || dto.stage === RealEstateBuyerStage.NOT_INTERESTED) &&
      !dto.lostReason &&
      !dto.notes
    ) {
      throw new BadRequestException('A reason or explanatory note is required when marking a buyer as Lost or Not Interested.');
    }

    if (dto.stage === RealEstateBuyerStage.FOLLOW_UP_LATER && !dto.followUpLaterDate) {
      throw new BadRequestException('Next follow-up date is required when moving to Follow Up Later stage.');
    }

    const now = new Date().toISOString();
    const fromStage = record.stage;
    record.stage = dto.stage;

    if (dto.stage === RealEstateBuyerStage.FOLLOW_UP_LATER && dto.followUpLaterDate) {
      record.nextFollowUpDate = dto.followUpLaterDate;
      record.nextFollowUpTitle = dto.notes || 'Scheduled follow-up with buyer';
    }

    const stageEntry: BuyerStageHistoryEntry = {
      id: `sh-${Date.now().toString(36)}`,
      fromStage,
      toStage: dto.stage,
      changedAt: now,
      actorId: dto.actorId || record.assignedMemberId,
      actorName: dto.actorName || record.assignedMemberName,
      notes: dto.notes,
      lostReason: dto.lostReason,
      followUpLaterDate: dto.followUpLaterDate,
    };

    record.stageHistory.push(stageEntry);
    record.lastActivityDate = now;
    record.updatedAt = now;

    // Sync summary
    const summaryItem = this.records.find((r) => r.id === id);
    if (summaryItem) {
      summaryItem.stage = dto.stage;
      summaryItem.lastActivityDate = now;
      summaryItem.updatedAt = now;
    }

    // Log interaction
    this.interactions.unshift({
      id: `int-stg-${Date.now().toString(36)}`,
      workspaceId,
      recordId: record.id,
      recordType: CrmType.RE_BUYER,
      type: CrmInteractionType.STAGE_CHANGE,
      title: `Buyer stage changed: ${fromStage} → ${dto.stage}`,
      description: dto.notes || dto.lostReason || `Transitioned by ${dto.actorName || 'Team'}`,
      actorId: dto.actorId || record.assignedMemberId,
      actorName: dto.actorName || record.assignedMemberName,
      timestamp: now,
    });

    return record;
  }

  // ==========================================
  // SCHEDULE BUYER SITE VISIT (Meetings & Calendar Sync)
  // ==========================================
  scheduleBuyerSiteVisit(
    workspaceId: string,
    id: string,
    dto: ScheduleBuyerSiteVisitDto,
  ): SiteVisitItem {
    this.validateRealEstateWorkspace(workspaceId);

    const record = this.buyerRecords.find((b) => b.id === id && b.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Buyer record #${id} not found.`);
    }

    if (!dto.projectName || !dto.projectName.trim()) {
      throw new BadRequestException('Project name is required for site visit.');
    }
    if (!dto.visitDate || !dto.startTime || !dto.endTime) {
      throw new BadRequestException('Visit date, start time, and end time are required.');
    }

    const now = new Date().toISOString();
    let siteVisit: SiteVisitItem;

    if (this.meetingsService) {
      siteVisit = this.meetingsService.createSiteVisit({
        workspaceId,
        buyerId: record.id,
        buyerName: record.customerName,
        buyerPhone: record.phone,
        projectName: dto.projectName.trim(),
        projectLocation: dto.projectLocation?.trim() || record.locality || 'Alibaug',
        propertyUnit: dto.propertyUnit?.trim(),
        visitDate: dto.visitDate,
        startTime: dto.startTime,
        endTime: dto.endTime,
        responsibleMemberId: dto.responsibleMemberId || record.assignedMemberId,
        notes: dto.notes,
      });
    } else {
      siteVisit = {
        id: `vis-${Date.now().toString(36)}`,
        workspaceId,
        buyerId: record.id,
        buyerName: record.customerName,
        buyerPhone: record.phone,
        projectId: `proj-${Date.now()}`,
        projectName: dto.projectName.trim(),
        projectLocation: dto.projectLocation || 'Alibaug',
        propertyUnit: dto.propertyUnit,
        visitDate: dto.visitDate,
        startTime: dto.startTime,
        endTime: dto.endTime,
        responsibleMemberId: dto.responsibleMemberId || record.assignedMemberId,
        status: MeetingStatus.SCHEDULED,
        rescheduleHistory: [],
        activity: [],
        createdAt: now,
        updatedAt: now,
      };
    }

    if (!record.siteVisitIds) record.siteVisitIds = [];
    record.siteVisitIds.push(siteVisit.id);

    // If buyer was at an earlier stage, automatically advance to SITE_VISIT_PLANNED
    const earlierStages = [
      RealEstateBuyerStage.NEW_ENQUIRY,
      RealEstateBuyerStage.CONTACT_PENDING,
      RealEstateBuyerStage.CONTACTED,
      RealEstateBuyerStage.REQUIREMENT_CAPTURED,
      RealEstateBuyerStage.QUALIFIED_BUYER,
      RealEstateBuyerStage.PROPERTY_SHARED,
    ];
    if (earlierStages.includes(record.stage)) {
      this.changeBuyerStage(workspaceId, record.id, {
        stage: RealEstateBuyerStage.SITE_VISIT_PLANNED,
        notes: `Site visit scheduled at ${siteVisit.projectName} for ${siteVisit.visitDate}`,
      });
    } else {
      record.lastActivityDate = now;
      record.updatedAt = now;
    }

    this.interactions.unshift({
      id: `int-vis-${Date.now().toString(36)}`,
      workspaceId,
      recordId: record.id,
      recordType: CrmType.RE_BUYER,
      type: CrmInteractionType.MEETING,
      title: `Site visit scheduled: ${siteVisit.projectName}`,
      description: `Date: ${siteVisit.visitDate} (${new Date(siteVisit.startTime).toLocaleTimeString()} - ${new Date(siteVisit.endTime).toLocaleTimeString()})`,
      actorId: dto.responsibleMemberId || record.assignedMemberId,
      actorName: record.assignedMemberName,
      timestamp: now,
    });

    return siteVisit;
  }

  // ==========================================
  // SHARE PROPERTY REFERENCE
  // ==========================================
  shareBuyerProperty(
    workspaceId: string,
    id: string,
    dto: ShareBuyerPropertyDto,
  ): BuyerSharedPropertyRef {
    this.validateRealEstateWorkspace(workspaceId);

    const record = this.buyerRecords.find((b) => b.id === id && b.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Buyer record #${id} not found.`);
    }

    if (!dto.name || !dto.name.trim()) {
      throw new BadRequestException('Property or project name is required.');
    }

    const now = new Date().toISOString();
    const propRef: BuyerSharedPropertyRef = {
      id: `prop-sh-${Date.now().toString(36)}`,
      name: dto.name.trim(),
      location: dto.location ? dto.location.trim() : (record.locality || 'Alibaug'),
      propertyType: dto.propertyType,
      configuration: dto.configuration,
      priceEstimate: dto.priceEstimate,
      sharedAt: now,
      feedback: dto.feedback?.trim(),
    };

    if (!record.sharedProperties) record.sharedProperties = [];
    record.sharedProperties.push(propRef);

    // If at earlier stage, advance to PROPERTY_SHARED
    if (
      record.stage === RealEstateBuyerStage.NEW_ENQUIRY ||
      record.stage === RealEstateBuyerStage.CONTACT_PENDING ||
      record.stage === RealEstateBuyerStage.CONTACTED ||
      record.stage === RealEstateBuyerStage.REQUIREMENT_CAPTURED ||
      record.stage === RealEstateBuyerStage.QUALIFIED_BUYER
    ) {
      this.changeBuyerStage(workspaceId, record.id, {
        stage: RealEstateBuyerStage.PROPERTY_SHARED,
        notes: `Property brochure shared: ${propRef.name}`,
      });
    } else {
      record.lastActivityDate = now;
      record.updatedAt = now;
    }

    this.interactions.unshift({
      id: `int-shr-${Date.now().toString(36)}`,
      workspaceId,
      recordId: record.id,
      recordType: CrmType.RE_BUYER,
      type: CrmInteractionType.DOCUMENT,
      title: `Property shared: ${propRef.name}`,
      description: `Location: ${propRef.location}. Price estimate: ${propRef.priceEstimate ? `₹${propRef.priceEstimate}` : 'N/A'}`,
      actorId: record.assignedMemberId,
      actorName: record.assignedMemberName,
      timestamp: now,
    });

    return propRef;
  }

  // ==========================================
  // CREATE BUYER LINKED TASK
  // ==========================================
  createBuyerLinkedTask(
    workspaceId: string,
    id: string,
    dto: CreateBuyerLinkedTaskDto,
  ) {
    this.validateRealEstateWorkspace(workspaceId);

    const record = this.buyerRecords.find((b) => b.id === id && b.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Buyer record #${id} not found.`);
    }

    if (!dto.title || !dto.title.trim()) {
      throw new BadRequestException('Task title is required.');
    }

    const now = new Date().toISOString();
    let createdTaskId = `task-${Date.now().toString(36)}`;

    if (this.tasksService) {
      const task = this.tasksService.create(
        {
          workspaceId,
          title: dto.title.trim(),
          description: dto.description?.trim() || `Follow-up task for customer: ${record.customerName}`,
          deadline: dto.deadline || new Date(Date.now() + 2 * 86400000).toISOString(),
          priority: dto.priority || TaskPriority.MEDIUM,
          assigneeId: dto.assigneeId || record.assignedMemberId,
          plannedStart: new Date().toISOString(),
          linkedRecord: {
            id: record.id,
            title: record.customerName,
            type: 'crm',
          },
        },
        record.assignedMemberId,
        record.assignedMemberName,
      );
      createdTaskId = task.id;
    }

    if (!record.linkedTaskIds) record.linkedTaskIds = [];
    record.linkedTaskIds.push(createdTaskId);
    record.lastActivityDate = now;
    record.updatedAt = now;

    this.interactions.unshift({
      id: `int-tsk-${Date.now().toString(36)}`,
      workspaceId,
      recordId: record.id,
      recordType: CrmType.RE_BUYER,
      type: CrmInteractionType.NOTE,
      title: `Linked task created: ${dto.title}`,
      description: dto.description || 'Task registered in workspace task register.',
      actorId: record.assignedMemberId,
      actorName: record.assignedMemberName,
      timestamp: now,
    });

    return {
      taskId: createdTaskId,
      title: dto.title,
      recordId: record.id,
    };
  }

  // ==========================================
  // ADD BUYER INTERACTION / NOTE
  // ==========================================
  addBuyerInteraction(
    workspaceId: string,
    id: string,
    dto: {
      type: CrmInteractionType;
      title: string;
      description?: string;
      actorId?: string;
      actorName?: string;
    },
  ): CrmInteractionItem {
    this.validateRealEstateWorkspace(workspaceId);

    const record = this.buyerRecords.find((b) => b.id === id && b.workspaceId === workspaceId);
    if (!record) {
      throw new NotFoundException(`Buyer record #${id} not found.`);
    }

    if (!dto.title || !dto.title.trim()) {
      throw new BadRequestException('Interaction title is required.');
    }

    const now = new Date().toISOString();
    const interaction: CrmInteractionItem = {
      id: `int-byr-${Date.now().toString(36)}`,
      workspaceId,
      recordId: record.id,
      recordType: CrmType.RE_BUYER,
      type: dto.type || CrmInteractionType.NOTE,
      title: dto.title.trim(),
      description: dto.description?.trim(),
      actorId: dto.actorId || record.assignedMemberId,
      actorName: dto.actorName || record.assignedMemberName,
      timestamp: now,
    };

    this.interactions.unshift(interaction);
    record.lastActivityDate = now;
    record.updatedAt = now;

    return interaction;
  }
}




