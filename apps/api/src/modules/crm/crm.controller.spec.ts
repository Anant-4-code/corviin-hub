import { Test, TestingModule } from '@nestjs/testing';
import { CrmController } from './crm.controller';
import { CrmService } from './crm.service';
import {
  CrmType,
  CrmFollowUpStatus,
  CrmInteractionType,
  TaskPriority,
  QuickCreateCrmRecordDto,
  CreateFollowUpDto,
  CompleteFollowUpDto,
  LogInteractionDto,
  TechRecordCategory,
  TechPipelineStage,
  CreateTechRecordDto,
  ChangeTechStageDto,
  ConvertWonToClientDto,
  CheckDuplicatesDto,
  AddTechProposalDto,
  RealEstatePartnerType,
  RealEstatePartnerStage,
  CreatePartnerRecordDto,
  ChangePartnerStageDto,
  ConfirmOrActivatePartnerDto,
  AddPartnerProjectDto,
  RealEstateBuyerStage,
  BuyerPropertyConfiguration,
  BuyerPropertyType,
  BuyerBuyingTimeline,
  BuyerPurchasePurpose,
  CreateBuyerRecordDto,
  ChangeBuyerStageDto,
  ScheduleBuyerSiteVisitDto,
  ShareBuyerPropertyDto,
} from '@corviin-hub/shared';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

describe('CrmController', () => {
  let controller: CrmController;
  let service: CrmService;

  const techWs = 'ws-tech-0001-0000-000000000001';
  const realWs = 'ws-real-0002-0000-000000000002';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrmController],
      providers: [CrmService],
    }).compile();

    controller = module.get<CrmController>(CrmController);
    service = module.get<CrmService>(CrmService);
  });

  describe('Workspace Scoping & Distinct Pipelines (Section 2)', () => {
    it('returns Tech CRM overview and metrics for Corviin Tech workspace', () => {
      const overview = controller.getOverview(techWs);
      expect(overview.workspaceType).toBe('TECH');
      expect(overview.techMetrics).toBeDefined();
      expect(overview.realEstateMetrics).toBeUndefined();
      expect(overview.techMetrics?.openEnquiriesCount).toBeGreaterThan(0);
      expect(overview.recentRecords.every((r) => r.workspaceId === techWs)).toBe(true);

      // Verifies no Real Estate records in Tech
      expect(
        overview.recentRecords.some(
          (r) => r.type === CrmType.RE_BUYER || r.type === CrmType.RE_PARTNER,
        ),
      ).toBe(false);
    });

    it('returns Real Estate CRM overview and metrics for Corviin Real Estate workspace', () => {
      const overview = controller.getOverview(realWs);
      expect(overview.workspaceType).toBe('REAL_ESTATE');
      expect(overview.realEstateMetrics).toBeDefined();
      expect(overview.techMetrics).toBeUndefined();
      expect(overview.realEstateMetrics?.activeBuyersCount).toBeGreaterThan(0);
      expect(overview.realEstateMetrics?.activeDevelopersCount).toBeGreaterThan(0);
      expect(overview.recentRecords.every((r) => r.workspaceId === realWs)).toBe(true);

      // Verifies no Tech records in Real Estate
      expect(
        overview.recentRecords.some(
          (r) => r.type === CrmType.TECH_LEAD || r.type === CrmType.TECH_CLIENT,
        ),
      ).toBe(false);
    });

    it('denies creating Real Estate record in Tech workspace', () => {
      const dto: QuickCreateCrmRecordDto = {
        type: CrmType.RE_BUYER,
        name: 'Illegal Buyer Attempt',
        phone: '+91 99999 11111',
      };

      expect(() => controller.createRecord(dto, techWs)).toThrow(BadRequestException);
    });

    it('denies creating Tech Lead in Real Estate workspace', () => {
      const dto: QuickCreateCrmRecordDto = {
        type: CrmType.TECH_LEAD,
        name: 'Illegal Tech Lead Attempt',
        phone: '+91 99999 22222',
      };

      expect(() => controller.createRecord(dto, realWs)).toThrow(BadRequestException);
    });
  });

  describe('Global CRM Search & Phone Normalization (Section 3 & 10)', () => {
    it('searches by name or company in workspace', () => {
      const searchRes = controller.search(techWs, undefined, 'Acme');
      expect(searchRes.items.length).toBeGreaterThan(0);
      expect(searchRes.items[0].name).toContain('Acme');
    });

    it('normalizes phone numbers to match partial or formatted numbers', () => {
      // "+91 98201 12345" seeded for Acme
      const searchRaw = controller.search(techWs, undefined, '9820112345');
      expect(searchRaw.items.length).toBeGreaterThan(0);
      expect(searchRaw.items[0].name).toContain('Acme');

      const searchPartial = controller.search(techWs, undefined, '98201');
      expect(searchPartial.items.length).toBeGreaterThan(0);
      expect(searchPartial.items[0].name).toContain('Acme');
    });

    it('strictly isolates search results by workspace', () => {
      // Vikram Malhotra is a Real Estate Buyer
      const techSearch = controller.search(techWs, undefined, 'Vikram');
      expect(techSearch.items.length).toBe(0);

      const realSearch = controller.search(realWs, undefined, 'Vikram');
      expect(realSearch.items.length).toBeGreaterThan(0);
      expect(realSearch.items[0].name).toBe('Vikram Malhotra');
    });
  });

  describe('Structured Follow-ups (Section 7)', () => {
    it('creates structured follow-up and updates parent record next action', () => {
      const createDto: CreateFollowUpDto = {
        recordId: 'crm-tech-002',
        recordType: CrmType.TECH_LEAD,
        title: 'Send formal quote breakdown',
        dueDate: '2026-11-08T15:00:00.000Z',
        priority: TaskPriority.HIGH,
        assignedMemberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        assignedMemberName: 'Rohit',
      };

      const followUp = controller.createFollowUp(createDto, techWs);
      expect(followUp.id).toBeDefined();
      expect(followUp.status).toBe(CrmFollowUpStatus.PENDING);
      expect(followUp.title).toBe('Send formal quote breakdown');

      // Check overview reflects follow-up
      const overview = controller.getOverview(techWs);
      expect(overview.upcomingFollowUps.some((f) => f.id === followUp.id)).toBe(true);
    });

    it('completes follow-up with notes and logs interaction event', () => {
      const completeDto: CompleteFollowUpDto = {
        completionNotes: 'Call completed. Client approved revised timeline.',
        completedBy: 'Anant',
      };

      const completed = controller.completeFollowUp('fup-tech-1', completeDto, techWs);
      expect(completed.status).toBe(CrmFollowUpStatus.COMPLETED);
      expect(completed.completedBy).toBe('Anant');
      expect(completed.completionNotes).toContain('Client approved revised timeline');

      // Interaction timeline on overview contains completion
      const overview = controller.getOverview(techWs);
      expect(
        overview.recentInteractions.some(
          (i) => i.title === 'Follow-up Completed' && i.description?.includes('Client approved'),
        ),
      ).toBe(true);
    });

    it('rejects follow-up creation on cross-workspace record', () => {
      // crm-re-001 is a Real Estate record
      const createDto: CreateFollowUpDto = {
        recordId: 'crm-re-001',
        recordType: CrmType.RE_PARTNER,
        title: 'Cross workspace attempt',
        dueDate: '2026-11-09T10:00:00.000Z',
      };

      expect(() => controller.createFollowUp(createDto, techWs)).toThrow(ForbiddenException);
    });
  });

  describe('Interaction Timeline Logging (Section 8)', () => {
    it('logs interaction events and updates last activity date', () => {
      const logDto: LogInteractionDto = {
        recordId: 'crm-tech-001',
        recordType: CrmType.TECH_LEAD,
        type: CrmInteractionType.CALL,
        title: 'Follow-up discussion with Finance Director',
        description: 'Confirmed annual payment cycle rather than monthly billing.',
        actorId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        actorName: 'Anant',
      };

      const interaction = controller.logInteraction(logDto, techWs);
      expect(interaction.id).toBeDefined();
      expect(interaction.type).toBe(CrmInteractionType.CALL);

      const overview = controller.getOverview(techWs);
      expect(overview.recentInteractions[0].title).toBe('Follow-up discussion with Finance Director');
    });
  });

  // ==========================================
  // FEATURE 11: CORVIIN TECH CRM TESTS
  // ==========================================

  describe('Tech CRM Summary & Metrics (Section 9)', () => {
    it('returns summary metrics and workload distribution for Corviin Tech', () => {
      const summary = controller.getTechSummary(techWs);
      expect(summary.totalEnquiries).toBeGreaterThanOrEqual(8);
      expect(summary.qualifiedOpportunities).toBeGreaterThanOrEqual(2);
      expect(summary.wonClientsCount).toBeGreaterThanOrEqual(2);
      expect(summary.enquiriesByStage[TechPipelineStage.PROPOSAL_QUOTATION]).toBeGreaterThanOrEqual(1);
      expect(summary.workloadByMember.length).toBeGreaterThanOrEqual(3);
    });

    it('rejects access to Tech CRM when active workspace is Corviin Real Estate', () => {
      expect(() => controller.getTechSummary(realWs)).toThrow(ForbiddenException);
      expect(() => controller.getTechRecords(realWs)).toThrow(ForbiddenException);
    });
  });

  describe('Tech CRM Listing & Filters (Section 3)', () => {
    it('filters records by category and stage', () => {
      const automationRecords = controller.getTechRecords(
        techWs,
        undefined,
        TechRecordCategory.AUTOMATION_ENQUIRY,
      );
      expect(automationRecords.items.every((r) => r.category === TechRecordCategory.AUTOMATION_ENQUIRY)).toBe(true);

      const quotationRecords = controller.getTechRecords(
        techWs,
        undefined,
        undefined,
        TechPipelineStage.PROPOSAL_QUOTATION,
      );
      expect(quotationRecords.items.every((r) => r.stage === TechPipelineStage.PROPOSAL_QUOTATION)).toBe(true);
    });

    it('supports search by contact name, company and normalized phone', () => {
      const nameSearch = controller.getTechRecords(
        techWs,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        'Rajesh',
      );
      expect(nameSearch.items.some((r) => r.name.includes('Rajesh'))).toBe(true);

      const phoneSearch = controller.getTechRecords(
        techWs,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        '98202', // HealthFlow
      );
      expect(phoneSearch.items.some((r) => r.company.includes('HealthFlow'))).toBe(true);
    });
  });

  describe('Tech CRM Record Creation & Validation (Section 4)', () => {
    it('creates a new Tech enquiry with required essentials and initializes stage history', () => {
      const createDto: CreateTechRecordDto = {
        name: 'Tarun Mehta',
        company: 'FinPulse Analytics',
        phone: '+91 98333 44556',
        email: 'tarun@finpulse.io',
        category: TechRecordCategory.POTENTIAL_PROJECT,
        source: 'Website',
        assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        assignedMemberName: 'Anant',
        serviceType: 'AUTOMATION_AI',
        requirementSummary: 'AI-assisted automated ledger reconciliation pipeline',
        estimatedBudget: 650000,
      };

      const record = controller.createTechRecord(createDto, techWs);
      expect(record.id).toBeDefined();
      expect(record.stage).toBe(TechPipelineStage.NEW_ENQUIRY);
      expect(record.stageHistory.length).toBe(1);
      expect(record.stageHistory[0].stage).toBe(TechPipelineStage.NEW_ENQUIRY);

      // Detail endpoint returns created record
      const detail = controller.getTechRecordById(record.id, techWs);
      expect(detail.record.company).toBe('FinPulse Analytics');
    });

    it('rejects creation without contact or company name', () => {
      const invalidDto: CreateTechRecordDto = {
        phone: '+91 98000 00000',
        category: TechRecordCategory.POTENTIAL_PROJECT,
        source: 'Website',
        assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        requirementSummary: 'Testing',
      };
      expect(() => controller.createTechRecord(invalidDto, techWs)).toThrow(BadRequestException);
    });

    it('rejects creation without phone or email', () => {
      const invalidDto: CreateTechRecordDto = {
        name: 'No Contact Person',
        company: 'Mystery Corp',
        category: TechRecordCategory.POTENTIAL_PROJECT,
        source: 'Website',
        assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        requirementSummary: 'Testing',
      };
      expect(() => controller.createTechRecord(invalidDto, techWs)).toThrow(BadRequestException);
    });
  });

  describe('Tech CRM Duplicate Detection (Section 8)', () => {
    it('detects duplicate by normalized phone number', () => {
      const dupByPhone = controller.checkDuplicates(
        { phone: '9820112345' }, // Acme FinTech (+91 98201 12345)
        techWs,
      );
      expect(dupByPhone).not.toBeNull();
      expect(dupByPhone?.matchedBy).toBe('phone');
      expect(dupByPhone?.record.company).toContain('Acme');
    });

    it('detects duplicate by email', () => {
      const dupByEmail = controller.checkDuplicates(
        { email: 'priya.sharma@healthflow.io' },
        techWs,
      );
      expect(dupByEmail).not.toBeNull();
      expect(dupByEmail?.matchedBy).toBe('email');
    });

    it('returns null when no duplicates exist', () => {
      const noDup = controller.checkDuplicates(
        { phone: '+91 91111 22222', email: 'unique@corp.com', company: 'Brand New Entity' },
        techWs,
      );
      expect(noDup).toBeNull();
    });
  });

  describe('Tech CRM Stage Transitions & Outcomes (Section 5 & 7)', () => {
    it('transitions stage and appends to audit stageHistory', () => {
      const stageDto: ChangeTechStageDto = {
        stage: TechPipelineStage.QUALIFIED,
        notes: 'Tech requirements and budget verified on client call.',
        actorId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        actorName: 'Rohit',
      };

      const updated = controller.changeTechStage('crm-tech-002', stageDto, techWs);
      expect(updated.stage).toBe(TechPipelineStage.QUALIFIED);
      expect(updated.stageHistory[updated.stageHistory.length - 1].stage).toBe(TechPipelineStage.QUALIFIED);
      expect(updated.stageHistory[updated.stageHistory.length - 1].notes).toContain('Tech requirements');
    });

    it('captures lost reason when moved to LOST stage', () => {
      const stageDto: ChangeTechStageDto = {
        stage: TechPipelineStage.LOST,
        lostReason: 'Client chose internal development team.',
      };

      const updated = controller.changeTechStage('crm-tech-003', stageDto, techWs);
      expect(updated.stage).toBe(TechPipelineStage.LOST);
      expect(updated.lostReason).toBe('Client chose internal development team.');
    });

    it('schedules follow-up when moved to FOLLOW_UP_LATER stage', () => {
      const laterDate = new Date(Date.now() + 30 * 86400000).toISOString();
      const stageDto: ChangeTechStageDto = {
        stage: TechPipelineStage.FOLLOW_UP_LATER,
        followUpLaterDate: laterDate,
      };

      const updated = controller.changeTechStage('crm-tech-001', stageDto, techWs);
      expect(updated.stage).toBe(TechPipelineStage.FOLLOW_UP_LATER);
      expect(updated.nextFollowUpDate).toBe(laterDate);
    });
  });

  describe('Tech CRM Won Conversion to Client (Section 7)', () => {
    it('converts Won record to Existing Client while preserving history', () => {
      const convertDto: ConvertWonToClientDto = {
        retainerAmount: 250000,
        serviceAgreementDetails: '12-month managed cloud and microservices retainer',
        createProject: true,
        projectName: 'Cloud Modernization Project',
      };

      const converted = controller.convertWonToClient('crm-tech-008', convertDto, techWs);
      expect(converted.stage).toBe(TechPipelineStage.WON_CLIENT);
      expect(converted.category).toBe(TechRecordCategory.EXISTING_CLIENT);
      expect(converted.projects?.some((p) => p.name === 'Cloud Modernization Project')).toBe(true);

      // Detail verification preserves stage history
      const detail = controller.getTechRecordById('crm-tech-008', techWs);
      expect(detail.record.stageHistory.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Tech CRM Proposals & Notes (Section 6 & 7)', () => {
    it('attaches proposal reference and logs document event', () => {
      const propDto: AddTechProposalDto = {
        title: 'Microservices Redesign Proposal v2',
        amount: 500000,
        status: 'SENT',
        referenceUrl: 'https://docs.corviin.tech/proposals/redesign.pdf',
      };

      const prop = controller.addTechProposal('crm-tech-001', propDto, techWs);
      expect(prop.id).toBeDefined();
      expect(prop.amount).toBe(500000);

      const detail = controller.getTechRecordById('crm-tech-001', techWs);
      expect(detail.record.proposals?.some((p) => p.title.includes('Microservices Redesign'))).toBe(true);
    });

    it('adds requirement note and logs interaction', () => {
      const note = controller.addTechRequirementNote(
        'crm-tech-001',
        { note: 'Client requested multi-tenant DB tenancy with data encryption at rest.' },
        techWs,
      );
      expect(note.id).toBeDefined();
      expect(note.description).toContain('multi-tenant DB tenancy');
    });
  });

  describe('Real Estate Developers & Partners CRM (Feature 12)', () => {
    it('strictly forbids access from Corviin Tech workspace', () => {
      expect(() => controller.getPartnerSummary(techWs)).toThrow(ForbiddenException);
      expect(() => controller.getPartnerRecords(techWs)).toThrow(ForbiddenException);
      expect(() => controller.getPartnerRecordById('partner-re-001', techWs)).toThrow(ForbiddenException);
      expect(() =>
        controller.createPartnerRecord(
          {
            companyName: 'Unauthorized Corp',
            phone: '9999999999',
            partnerType: RealEstatePartnerType.DEVELOPER,
            assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          },
          techWs,
        ),
      ).toThrow(ForbiddenException);
    });

    it('returns partner summary metrics, stage breakdowns, and project counts for Real Estate workspace', () => {
      const summary = controller.getPartnerSummary(realWs);
      expect(summary.totalPartners).toBeGreaterThanOrEqual(8);
      expect(summary.activePartners).toBeGreaterThanOrEqual(1);
      expect(summary.confirmedPartners).toBeGreaterThanOrEqual(1);
      expect(summary.leadsInPipeline).toBeGreaterThanOrEqual(4);
      expect(summary.totalProjectsCount).toBeGreaterThanOrEqual(8);
      expect(summary.byType[RealEstatePartnerType.DEVELOPER]).toBeGreaterThanOrEqual(2);
      expect(summary.byType[RealEstatePartnerType.LANDOWNER]).toBeGreaterThanOrEqual(1);
      expect(summary.byType[RealEstatePartnerType.BUILDER]).toBeGreaterThanOrEqual(1);
      expect(summary.byType[RealEstatePartnerType.CHANNEL_PARTNER]).toBeGreaterThanOrEqual(1);
      expect(summary.byMember.length).toBeGreaterThanOrEqual(2);
    });

    it('filters partner records by partner type, stage, and location', () => {
      const devRecords = controller.getPartnerRecords(realWs, undefined, undefined, RealEstatePartnerType.DEVELOPER);
      expect(devRecords.items.every((p) => p.partnerType === RealEstatePartnerType.DEVELOPER)).toBe(true);
      expect(devRecords.total).toBeGreaterThanOrEqual(2);

      const alibaugRecords = controller.getPartnerRecords(realWs, undefined, undefined, undefined, undefined, undefined, 'Alibaug');
      expect(alibaugRecords.items.some((p) => p.companyName.includes('Skyline'))).toBe(true);

      const activeRecords = controller.getPartnerRecords(realWs, undefined, undefined, undefined, RealEstatePartnerStage.ACTIVE_PARTNER);
      expect(activeRecords.items.some((p) => p.companyName.includes('Oberoi'))).toBe(true);
    });

    it('detects duplicate partners by phone suffix, email, and company name', () => {
      // 1. Phone match (+91 99301 11223 -> 9930111223)
      const phoneMatches = controller.checkPartnerDuplicates({ phone: '9930111223' }, realWs);
      expect(phoneMatches.length).toBeGreaterThan(0);
      expect(phoneMatches[0].matchedBy).toBe('phone');
      expect(phoneMatches[0].record.companyName).toContain('Skyline');

      // 2. Email match
      const emailMatches = controller.checkPartnerDuplicates({ email: 'land@prestigeland.com' }, realWs);
      expect(emailMatches.length).toBeGreaterThan(0);
      expect(emailMatches[0].matchedBy).toBe('email');

      // 3. Company match
      const companyMatches = controller.checkPartnerDuplicates({ companyName: 'Skyline Developers Pvt Ltd' }, realWs);
      expect(companyMatches.length).toBeGreaterThan(0);
      expect(companyMatches[0].matchedBy).toBe('companyName');

      // 4. Non-matching query
      const noMatches = controller.checkPartnerDuplicates({ phone: '9123456789', email: 'unique@xyz.com' }, realWs);
      expect(noMatches.length).toBe(0);
    });

    it('creates a new partner record with initial projects and required essentials', () => {
      const newDto: CreatePartnerRecordDto = {
        companyName: 'Godrej Coastal Estates',
        contactPerson: 'Karan Godrej',
        phone: '+91 99881 22334',
        email: 'karan@godrejcoastal.in',
        partnerType: RealEstatePartnerType.DEVELOPER,
        assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        assignedMemberName: 'Anant',
        location: 'Mandwa, Alibaug',
        website: 'https://godrejcoastal.in',
        initialProject: {
          name: 'Godrej Palm Grove Villas',
          projectType: 'LUXURY_VILLAS',
          location: 'Mandwa Coast Road',
          totalUnitsOrAcres: '30 Coastal Villas',
          status: 'UPCOMING',
        },
        marketingRequirements: ['Drone Videography', 'Digital Launch Mandate'],
        notes: 'High-intent builder seeking full marketing agency partnership.',
      };

      const created = controller.createPartnerRecord(newDto, realWs);
      expect(created.id).toBeDefined();
      expect(created.companyName).toBe('Godrej Coastal Estates');
      expect(created.stage).toBe(RealEstatePartnerStage.NEW_PARTNER_LEAD);
      expect(created.projects.length).toBe(1);
      expect(created.projects[0].name).toBe('Godrej Palm Grove Villas');
      expect(created.stageHistory.length).toBe(1);

      // Verify retrieval
      const fetched = controller.getPartnerRecordById(created.id, realWs);
      expect(fetched.companyName).toBe('Godrej Coastal Estates');
    });

    it('enforces stage transition validation (lostReason and followUpLaterDate)', () => {
      // Missing lostReason throws BadRequestException
      expect(() =>
        controller.changePartnerStage(
          'partner-re-002',
          { stage: RealEstatePartnerStage.LOST },
          realWs,
        ),
      ).toThrow(BadRequestException);

      // Missing followUpLaterDate throws BadRequestException
      expect(() =>
        controller.changePartnerStage(
          'partner-re-002',
          { stage: RealEstatePartnerStage.FOLLOW_UP_LATER },
          realWs,
        ),
      ).toThrow(BadRequestException);

      // Valid stage transition appends to stageHistory
      const updated = controller.changePartnerStage(
        'partner-re-002',
        {
          stage: RealEstatePartnerStage.PROPOSAL_SERVICE_DETAILS,
          notes: 'Sent JV feasibility structuring agreement.',
        },
        realWs,
      );
      expect(updated.stage).toBe(RealEstatePartnerStage.PROPOSAL_SERVICE_DETAILS);
      expect(updated.stageHistory.some((sh) => sh.toStage === RealEstatePartnerStage.PROPOSAL_SERVICE_DETAILS)).toBe(true);
    });

    it('distinguishes Partnership Confirmed from Active Partner', () => {
      // 1. Confirm Partnership
      const confirmed = controller.confirmOrActivatePartner(
        'partner-re-001',
        {
          mode: 'CONFIRM',
          mandateType: 'Exclusive 3% Sole Selling Mandate',
          notes: 'MoU signed by promoters.',
        },
        realWs,
      );
      expect(confirmed.stage).toBe(RealEstatePartnerStage.PARTNERSHIP_CONFIRMED);
      expect(confirmed.mandateSignedAt).toBeDefined();

      // 2. Activate Partner
      const activated = controller.confirmOrActivatePartner(
        'partner-re-001',
        {
          mode: 'ACTIVATE',
          notes: 'Go-live launch meeting completed.',
        },
        realWs,
      );
      expect(activated.stage).toBe(RealEstatePartnerStage.ACTIVE_PARTNER);
      expect(activated.activeSince).toBeDefined();
    });

    it('adds multiple project references to a partner record', () => {
      const projDto: AddPartnerProjectDto = {
        name: 'Emerald Heights Phase 3 Sky-Suites',
        projectType: 'RESIDENTIAL',
        location: 'Awas Road, Alibaug',
        reraNumber: 'P52000034567',
        totalUnitsOrAcres: '18 Penthouses',
        status: 'UPCOMING',
      };

      const addedProj = controller.addPartnerProject('partner-re-001', projDto, realWs);
      expect(addedProj.id).toBeDefined();
      expect(addedProj.name).toBe('Emerald Heights Phase 3 Sky-Suites');

      const partner = controller.getPartnerRecordById('partner-re-001', realWs);
      expect(partner.projects.some((p) => p.name === 'Emerald Heights Phase 3 Sky-Suites')).toBe(true);
    });

    it('creates linked tasks and schedules meetings', async () => {
      // Linked task
      const taskResult = await controller.createPartnerLinkedTask(
        'partner-re-001',
        {
          title: 'Draft RERA compliance checklist for Alibaug Phase 2',
          priority: TaskPriority.HIGH,
        },
        realWs,
      );
      expect(taskResult.taskId).toBeDefined();

      // Scheduled meeting
      const meetingResult = await controller.schedulePartnerMeeting(
        'partner-re-001',
        {
          title: 'Promoter Commercial Alignment Meeting',
          scheduledAt: '2026-11-15T11:00:00.000Z',
          agenda: 'Review commission milestone schedule.',
        },
        realWs,
      );
      expect(meetingResult.meetingId).toBeDefined();

      const partner = controller.getPartnerRecordById('partner-re-001', realWs);
      expect(partner.linkedTaskIds?.includes(taskResult.taskId)).toBe(true);
      expect(partner.linkedMeetingIds?.includes(meetingResult.meetingId)).toBe(true);
    });
  });

  describe('Real Estate Buyers & Property Customers CRM (Feature 13)', () => {
    it('strictly forbids access from Corviin Tech workspace', () => {
      expect(() => controller.getBuyerSummary(techWs)).toThrow(ForbiddenException);
      expect(() => controller.getBuyerRecords(techWs)).toThrow(ForbiddenException);
      expect(() => controller.getBuyerRecordById('buyer-re-001', techWs)).toThrow(ForbiddenException);
      expect(() =>
        controller.createBuyerRecord(
          {
            customerName: 'Unauthorized Customer',
            phone: '9999999999',
            assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            enquirySource: 'Web',
          },
          techWs,
        ),
      ).toThrow(ForbiddenException);
    });

    it('returns buyer summary metrics, pipeline distributions, and site visit counts for Real Estate workspace', () => {
      const summary = controller.getBuyerSummary(realWs);
      expect(summary.totalBuyers).toBeGreaterThanOrEqual(8);
      expect(summary.activePipelineCount).toBeGreaterThanOrEqual(5);
      expect(summary.siteVisitsPlannedCount).toBeGreaterThanOrEqual(1);
      expect(summary.siteVisitsCompletedCount).toBeGreaterThanOrEqual(1);
      expect(summary.bookingsConvertedCount).toBeGreaterThanOrEqual(1);
      expect(summary.byStage[RealEstateBuyerStage.SITE_VISIT_COMPLETED]).toBeGreaterThanOrEqual(1);
      expect(summary.byStage[RealEstateBuyerStage.BOOKING_CONVERTED]).toBeGreaterThanOrEqual(1);
      expect(summary.byMember.length).toBeGreaterThanOrEqual(2);
    });

    it('filters buyer records by stage, configuration, locality, and search query', () => {
      // Configuration filter (4+ BHK)
      const fourBhkRecords = controller.getBuyerRecords(
        realWs,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        BuyerPropertyConfiguration.FOUR_PLUS_BHK,
      );
      expect(fourBhkRecords.items.every((b) => b.configuration === BuyerPropertyConfiguration.FOUR_PLUS_BHK)).toBe(true);
      expect(fourBhkRecords.total).toBeGreaterThanOrEqual(2);

      // Search query (Vikram)
      const searchRecords = controller.getBuyerRecords(realWs, undefined, 'Vikram');
      expect(searchRecords.items.some((b) => b.customerName.includes('Vikram'))).toBe(true);

      // Stage filter (BOOKING_CONVERTED)
      const convertedRecords = controller.getBuyerRecords(realWs, undefined, undefined, RealEstateBuyerStage.BOOKING_CONVERTED);
      expect(convertedRecords.items.some((b) => b.customerName.includes('Kunal Mehta'))).toBe(true);
    });

    it('detects duplicate buyers by normalized phone suffix, email, and customer name', () => {
      // 1. Phone match (+91 99304 44556 -> 9930444556)
      const phoneMatches = controller.checkBuyerDuplicates({ phone: '9930444556' }, realWs);
      expect(phoneMatches.length).toBeGreaterThan(0);
      expect(phoneMatches[0].matchedBy).toBe('phone');
      expect(phoneMatches[0].record.customerName).toContain('Vikram');

      // 2. Email match
      const emailMatches = controller.checkBuyerDuplicates({ email: 'pooja.sharma@outlook.com' }, realWs);
      expect(emailMatches.length).toBeGreaterThan(0);
      expect(emailMatches[0].matchedBy).toBe('email');

      // 3. Name match
      const nameMatches = controller.checkBuyerDuplicates({ customerName: 'Dr. Sameer Joshi' }, realWs);
      expect(nameMatches.length).toBeGreaterThan(0);
      expect(nameMatches[0].matchedBy).toBe('customerName');

      // 4. Non-matching query
      const noMatches = controller.checkBuyerDuplicates({ phone: '9123456789', email: 'unique@xyz.com' }, realWs);
      expect(noMatches.length).toBe(0);
    });

    it('creates a new buyer record with required essentials and progressive details', () => {
      const newDto: CreateBuyerRecordDto = {
        customerName: 'Rohit Verma',
        phone: '+91 99882 33445',
        email: 'rohit.v@techcorp.in',
        preferredContactMethod: 'WHATSAPP',
        assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        assignedMemberName: 'Anant',
        enquirySource: 'Meta Ad Campaign',
        locality: 'Alibaug',
        propertyType: BuyerPropertyType.VILLA,
        configuration: BuyerPropertyConfiguration.THREE_BHK,
        minBudget: 25000000,
        maxBudget: 35000000,
        buyingTimeline: BuyerBuyingTimeline.ONE_TO_THREE_MONTHS,
        purpose: BuyerPurchasePurpose.SECOND_HOME,
        preferredProject: 'Emerald Heights Luxury Villas',
        notes: 'Looking for a sea-facing 3BHK villa with private garden.',
      };

      const created = controller.createBuyerRecord(newDto, realWs);
      expect(created.id).toBeDefined();
      expect(created.customerName).toBe('Rohit Verma');
      expect(created.stage).toBe(RealEstateBuyerStage.NEW_ENQUIRY);
      expect(created.stageHistory.length).toBe(1);

      // Verify retrieval
      const fetched = controller.getBuyerRecordById(created.id, realWs);
      expect(fetched.customerName).toBe('Rohit Verma');
    });

    it('enforces stage transitions, lost reasons, and next follow-up dates', () => {
      // Missing lostReason throws BadRequestException
      expect(() =>
        controller.changeBuyerStage(
          'buyer-re-003',
          { stage: RealEstateBuyerStage.LOST },
          realWs,
        ),
      ).toThrow(BadRequestException);

      // Missing followUpLaterDate throws BadRequestException
      expect(() =>
        controller.changeBuyerStage(
          'buyer-re-003',
          { stage: RealEstateBuyerStage.FOLLOW_UP_LATER },
          realWs,
        ),
      ).toThrow(BadRequestException);

      // Valid stage transition
      const updated = controller.changeBuyerStage(
        'buyer-re-003',
        {
          stage: RealEstateBuyerStage.REQUIREMENT_CAPTURED,
          notes: 'Customer confirmed budget is ₹4 Cr for penthouse.',
        },
        realWs,
      );
      expect(updated.stage).toBe(RealEstateBuyerStage.REQUIREMENT_CAPTURED);
      expect(updated.stageHistory.some((sh) => sh.toStage === RealEstateBuyerStage.REQUIREMENT_CAPTURED)).toBe(true);
    });

    it('schedules a site visit and advances buyer stage to SITE_VISIT_PLANNED', () => {
      const visitDto: ScheduleBuyerSiteVisitDto = {
        projectName: 'Sterling Park Residences',
        projectLocation: 'Kharadi, Pune',
        propertyUnit: 'Penthouse Unit P-02',
        visitDate: '2026-11-14',
        startTime: '2026-11-14T11:00:00.000Z',
        endTime: '2026-11-14T12:30:00.000Z',
        notes: 'Walkthrough of rooftop terrace and sample flat.',
      };

      const visit = controller.scheduleBuyerSiteVisit('buyer-re-003', visitDto, realWs);
      expect(visit.id).toBeDefined();
      expect(visit.projectName).toBe('Sterling Park Residences');

      const buyer = controller.getBuyerRecordById('buyer-re-003', realWs);
      expect(buyer.siteVisitIds.includes(visit.id)).toBe(true);
      expect(buyer.stage).toBe(RealEstateBuyerStage.SITE_VISIT_PLANNED);
    });

    it('shares a property recommendation and advances buyer stage to PROPERTY_SHARED', () => {
      const shareDto: ShareBuyerPropertyDto = {
        name: 'Sterling Park Tower 1 Penthouse 1801',
        location: 'Kharadi, Pune',
        propertyType: 'Penthouse',
        configuration: '4 BHK Duplex (2600 sqft)',
        priceEstimate: 42000000,
        feedback: 'Shared complete brochure and pricing schedule on WhatsApp.',
      };

      const prop = controller.shareBuyerProperty('buyer-re-007', shareDto, realWs);
      expect(prop.id).toBeDefined();
      expect(prop.name).toBe('Sterling Park Tower 1 Penthouse 1801');

      const buyer = controller.getBuyerRecordById('buyer-re-007', realWs);
      expect(buyer.sharedProperties.some((p) => p.name === 'Sterling Park Tower 1 Penthouse 1801')).toBe(true);
      expect(buyer.stage).toBe(RealEstateBuyerStage.PROPERTY_SHARED);
    });

    it('creates linked tasks for buyer follow-ups in shared task engine', () => {
      const taskResult = controller.createBuyerLinkedTask(
        'buyer-re-001',
        {
          title: 'Prepare final villa sales agreement and furniture catalog',
          priority: TaskPriority.HIGH,
        },
        realWs,
      );
      expect(taskResult.taskId).toBeDefined();

      const buyer = controller.getBuyerRecordById('buyer-re-001', realWs);
      expect(buyer.linkedTaskIds?.includes(taskResult.taskId)).toBe(true);
    });
  });
});




