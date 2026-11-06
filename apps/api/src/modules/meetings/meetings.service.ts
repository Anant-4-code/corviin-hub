import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  MeetingItem,
  MeetingActionItem,
  CreateMeetingDto,
  UpdateMeetingDto,
  RescheduleMeetingDto,
  ConvertActionItemToTaskDto,
  SiteVisitItem,
  CreateSiteVisitDto,
  UpdateSiteVisitDto,
  RescheduleSiteVisitDto,
  MeetingCategory,
  MeetingStatus,
  TaskPriority,
  RescheduleEvent,
} from '@corviin-hub/shared';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class MeetingsService {
  constructor(private readonly tasksService: TasksService) {}

  private meetings: MeetingItem[] = [
    // Corviin Tech Meetings
    {
      id: 'mtg-tech-001',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      title: 'Weekly Tech Architecture & Zero-Animation Review',
      category: MeetingCategory.INTERNAL,
      status: MeetingStatus.SCHEDULED,
      date: '2026-11-05',
      startTime: '2026-11-05T10:00:00.000Z',
      endTime: '2026-11-05T11:00:00.000Z',
      organiserId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Anant
      participantIds: [
        'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        'c3d4e5f6-a7b8-9012-cdef-123456789012',
      ],
      meetingUrl: 'https://meet.google.com/crv-tech-arch',
      agenda: 'Review CSS zero-animation enforcement, token contrast across Light/Dark themes, and API latency benchmarks.',
      notes: 'Monorepo builds verified under 6s. No CSS keyframes detected in bundle.',
      decisions: ['All modal dialogs must use static non-spring overlays.'],
      agendaTopics: [
        { id: 'top-1', topic: 'Verify zero CSS transitions in index.css', ownerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', timeMinutes: 15, completed: true },
        { id: 'top-2', topic: 'Audit Light/Dark contrast ratios for badges', ownerId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', timeMinutes: 20, completed: true },
        { id: 'top-3', topic: 'TasksService action-item integration latency', ownerId: 'c3d4e5f6-a7b8-9012-cdef-123456789012', timeMinutes: 25, completed: false },
      ],
      preparation: {
        background: 'System-wide compliance audit for CORVIIN HUB technical specifications v1.0.',
        links: ['https://github.com/corviin/hub/pull/14'],
        documents: ['CORVIIN_HUB_Design_Tokens_v1.pdf'],
        questions: ['Do we need custom focus-visible rings for high contrast mode?'],
        requiredDecisions: ['Approve final modal static overlay specification'],
      },
      detailedNotes: {
        summary: 'All core architecture guidelines verified. Zero-animation rule strictly enforced across Tailwind configurations.',
        topics: [
          { topic: 'Design tokens', notes: 'Tailwind configuration verified with semantic bg-surface and text-primary tokens.' },
          { topic: 'Action item to task conversion', notes: 'Guaranteed idempotent behavior across TasksService integration.' },
        ],
        infoReceived: 'All developer workbenches running Node v20 LTS without issue.',
        questions: ['How frequently should audit reports be generated?'],
        blockers: ['None at this milestone.'],
        commitments: ['Rohit will document design tokens in architecture TRD by Friday.'],
      },
      formalDecisions: [
        {
          id: 'dec-1',
          decisionText: 'All modal dialogs and drawers must use static non-spring overlays and zero CSS transition timings.',
          responsiblePersonId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          dueDate: '2026-11-06T17:00:00.000Z',
          createdByName: 'Anant',
          createdAt: '2026-11-05T10:30:00.000Z',
        },
      ],
      actionItems: [
        {
          id: 'act-item-1',
          description: 'Document design tokens in architecture TRD',
          assignedMemberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', // Rohit
          dueDate: '2026-11-06T17:00:00.000Z',
          priority: TaskPriority.HIGH,
          status: 'PENDING',
        },
      ],
      attachments: [
        {
          id: 'att-1',
          name: 'Architecture_Review_Nov2026.pdf',
          url: '/api/v1/assets/att-1/download',
          size: '1.4 MB',
          uploadedAt: '2026-11-05T09:45:00.000Z',
        },
      ],
      outcome: {
        outcomeSummary: 'Architecture approved for Feature 14 Meetings rollout.',
        nextSteps: 'Complete frontend responsive table, mobile cards, and 8-section detail workspace.',
        nextFollowUpDate: '2026-11-12T10:00:00.000Z',
        nextMeetingDate: '2026-11-12T10:00:00.000Z',
        crmUpdateNote: 'Tech architecture team milestone marked as complete.',
      },
      linkedRecord: {
        id: 'gol-tch-1',
        title: 'CORVIIN HUB Core Architecture',
        type: 'project',
      },
      rescheduleHistory: [],
      activity: [
        {
          id: 'act-init-1',
          action: 'Meeting created',
          actorName: 'Anant',
          timestamp: '2026-11-01T09:00:00.000Z',
          details: 'Initial scheduling of weekly architecture review',
        },
      ],
      createdAt: '2026-11-01T09:00:00.000Z',
      updatedAt: '2026-11-04T12:00:00.000Z',
    },
    {
      id: 'mtg-tech-002',
      workspaceId: 'ws-tech-0001-0000-000000000001',
      title: 'Enterprise Client Tech Discovery Call — NexaCorp Solutions',
      category: MeetingCategory.CLIENT,
      status: MeetingStatus.SCHEDULED,
      date: '2026-11-05',
      startTime: '2026-11-05T15:30:00.000Z',
      endTime: '2026-11-05T16:30:00.000Z',
      organiserId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Anant
      participantIds: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
      externalParticipants: ['david.chen@nexacorp.io (VP Engineering)'],
      meetingUrl: 'https://zoom.us/j/9876543210',
      phoneNumber: '+1-555-0199',
      agenda: 'Walkthrough multi-workspace architecture, custom role boundaries, and REST API integration capabilities.',
      notes: 'Client requested API documentation preview and Swagger specs.',
      agendaTopics: [
        { id: 'top-201', topic: 'Corviin API security & isolation overview', ownerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', timeMinutes: 30, completed: false },
        { id: 'top-202', topic: 'Commercial contract & SLA boundaries', ownerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', timeMinutes: 30, completed: false },
      ],
      preparation: {
        background: 'NexaCorp is looking for custom enterprise workflows in logistics software.',
        links: ['https://nexacorp.io/enterprise-specs'],
        documents: ['NexaCorp_Requirements_Brief.pdf'],
        questions: ['What is their expected peak request rate?'],
      },
      detailedNotes: {
        summary: 'Discovery call agenda prepped. Demo tenant configured with dummy CRM records.',
      },
      formalDecisions: [],
      actionItems: [
        {
          id: 'act-item-2',
          description: 'Share Swagger OpenAPI 3.0 specification with David Chen',
          assignedMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          dueDate: '2026-11-06T12:00:00.000Z',
          priority: TaskPriority.URGENT,
          status: 'PENDING',
        },
      ],
      attachments: [],
      outcome: {
        nextSteps: 'Send proposal document following technical review.',
      },
      linkedRecord: {
        id: 'crm-tech-101',
        title: 'NexaCorp Solutions Enterprise Expansion',
        type: 'client',
      },
      rescheduleHistory: [],
      activity: [
        {
          id: 'act-init-2',
          action: 'Meeting created',
          actorName: 'Anant',
          timestamp: '2026-11-02T10:00:00.000Z',
          details: 'Discovery meeting with VP Engineering',
        },
      ],
      createdAt: '2026-11-02T10:00:00.000Z',
      updatedAt: '2026-11-02T10:00:00.000Z',
    },

    // Corviin Real Estate Meetings
    {
      id: 'mtg-re-001',
      workspaceId: 'ws-real-0002-0000-000000000002',
      title: 'Sobha Developers Commercial Partner Alignment',
      category: MeetingCategory.PARTNER,
      status: MeetingStatus.CONFIRMED,
      date: '2026-11-05',
      startTime: '2026-11-05T11:00:00.000Z',
      endTime: '2026-11-05T12:00:00.000Z',
      organiserId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', // Rohit
      participantIds: [
        'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        'c3d4e5f6-a7b8-9012-cdef-123456789012',
      ],
      externalParticipants: ['Mr. Vikramaditya Rao (VP Commercials, Sobha)'],
      location: 'Sobha Corporate Office, Outer Ring Road, Bangalore',
      phoneNumber: '+91-98765-43210',
      agenda: 'Review Q4 exclusive sales inventory commission structure and buyer allotment quotas.',
      notes: 'Draft agreement prepared for 12 exclusive 4BHK units.',
      agendaTopics: [
        { id: 'top-301', topic: 'Inventory allotment terms for Sobha Dream Acres', ownerId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', timeMinutes: 25, completed: false },
        { id: 'top-302', topic: 'Brokerage and marketing subsidy model', ownerId: 'c3d4e5f6-a7b8-9012-cdef-123456789012', timeMinutes: 35, completed: false },
      ],
      preparation: {
        background: 'Sobha wishes to allocate exclusive brokerage rights for high-ticket Bangalore tech corridor buyers.',
        links: ['https://sobha.com/dream-acres'],
        documents: ['Sobha_Partnership_MOU_Draft.pdf'],
        questions: ['Can we negotiate a 2.5% fixed fee for penthouse units?'],
        requiredDecisions: ['Agree on exclusive closing period (60 days vs 90 days)'],
      },
      detailedNotes: {
        summary: 'Partner alignment meeting scheduled at corporate office with lead negotiators.',
      },
      formalDecisions: [],
      actionItems: [
        {
          id: 'act-re-item-1',
          description: 'Print finalized MOU copies for signature',
          assignedMemberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          dueDate: '2026-11-05T10:00:00.000Z',
          priority: TaskPriority.URGENT,
          status: 'PENDING',
        },
      ],
      attachments: [],
      outcome: {},
      linkedRecord: {
        id: 'prj-sobha-01',
        title: 'Sobha Dream Acres Project Partnership',
        type: 'project',
      },
      rescheduleHistory: [],
      activity: [
        {
          id: 'act-init-3',
          action: 'Meeting created',
          actorName: 'Rohit',
          timestamp: '2026-11-03T11:00:00.000Z',
          details: 'Partner meeting confirmed at Sobha headquarters',
        },
      ],
      createdAt: '2026-11-03T11:00:00.000Z',
      updatedAt: '2026-11-03T11:00:00.000Z',
    },
    {
      id: 'mtg-re-002',
      workspaceId: 'ws-real-0002-0000-000000000002',
      title: 'High-Net-Worth Buyer Consultation — Rajiv Malhotra',
      category: MeetingCategory.BUYER,
      status: MeetingStatus.SCHEDULED,
      date: '2026-11-06',
      startTime: '2026-11-06T16:00:00.000Z',
      endTime: '2026-11-06T17:00:00.000Z',
      organiserId: 'c3d4e5f6-a7b8-9012-cdef-123456789012', // Utkarsh
      participantIds: ['c3d4e5f6-a7b8-9012-cdef-123456789012'],
      externalParticipants: ['rajiv.malhotra@zenithvc.com'],
      meetingUrl: 'https://meet.google.com/re-buyer-consult',
      phoneNumber: '+91-98801-23456',
      agenda: 'Discuss luxury villa portfolio in Sarjapur and Whitefield. Review floor plans and payment plans.',
      notes: 'Buyer has 5Cr budget, looking for immediate possession villa.',
      agendaTopics: [],
      preparation: {
        background: 'Buyer referred by Anant. Interested in gated community with private pool.',
      },
      detailedNotes: {},
      formalDecisions: [],
      actionItems: [],
      attachments: [],
      outcome: {},
      linkedRecord: {
        id: 'byr-003',
        title: 'Rajiv Malhotra Luxury Villa Requirement',
        type: 'buyer',
      },
      rescheduleHistory: [],
      activity: [],
      createdAt: '2026-11-04T15:00:00.000Z',
      updatedAt: '2026-11-04T15:00:00.000Z',
    },
  ];

  private siteVisits: SiteVisitItem[] = [
    // Real Estate Site Visits
    {
      id: 'vis-re-001',
      workspaceId: 'ws-real-0002-0000-000000000002',
      buyerId: 'byr-001',
      buyerName: 'Vikram & Sunita Sharma',
      buyerPhone: '+91-98450-12345',
      projectId: 'prj-sobha-01',
      projectName: 'Sobha Dream Acres',
      projectLocation: 'Panathur Main Road, Balagere, Bangalore',
      propertyUnit: 'Villa #14 (4BHK East-facing)',
      visitDate: '2026-11-05',
      startTime: '2026-11-05T14:00:00.000Z',
      endTime: '2026-11-05T15:30:00.000Z',
      responsibleMemberId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', // Rohit
      status: MeetingStatus.CONFIRMED,
      notes: 'Buyer requested on-site inspection of poolside deck and clubhouse amenities. Prepare printed floor plans.',
      rescheduleHistory: [],
      activity: [],
      createdAt: '2026-11-03T14:00:00.000Z',
      updatedAt: '2026-11-04T10:00:00.000Z',
    },
    {
      id: 'vis-re-002',
      workspaceId: 'ws-real-0002-0000-000000000002',
      buyerId: 'byr-002',
      buyerName: 'Rajesh Nair',
      buyerPhone: '+91-99887-65432',
      projectId: 'prj-prestige-02',
      projectName: 'Prestige Lakeside Habitat',
      projectLocation: 'Varthur, Whitefield, Bangalore',
      propertyUnit: 'Tower 4, Penthouse 2402',
      visitDate: '2026-11-06',
      startTime: '2026-11-06T11:00:00.000Z',
      endTime: '2026-11-06T12:30:00.000Z',
      responsibleMemberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Anant
      status: MeetingStatus.SCHEDULED,
      notes: 'Client interested in lakeview orientation and immediate registration procedure.',
      rescheduleHistory: [],
      activity: [],
      createdAt: '2026-11-04T09:00:00.000Z',
      updatedAt: '2026-11-04T09:00:00.000Z',
    },
  ];

  // ==========================================
  // MEETINGS CRUD
  // ==========================================

  findAllMeetings(
    workspaceId: string,
    filter?: { category?: string; status?: string; memberId?: string; date?: string },
  ): MeetingItem[] {
    let result = this.meetings.filter((m) => m.workspaceId === workspaceId);
    if (filter?.category) result = result.filter((m) => m.category === filter.category);
    if (filter?.status) result = result.filter((m) => m.status === filter.status);
    if (filter?.date) result = result.filter((m) => m.date === filter.date);
    if (filter?.memberId) {
      const targetMemberId = filter.memberId;
      result = result.filter(
        (m) => m.organiserId === targetMemberId || m.participantIds.includes(targetMemberId),
      );
    }
    return result;
  }

  findMeetingById(workspaceId: string, id: string): MeetingItem {
    const meeting = this.meetings.find((m) => m.workspaceId === workspaceId && m.id === id);
    if (!meeting) {
      throw new NotFoundException(`Meeting ${id} not found in workspace ${workspaceId}`);
    }
    return meeting;
  }

  createMeeting(dto: CreateMeetingDto): MeetingItem {
    if (new Date(dto.endTime) <= new Date(dto.startTime)) {
      throw new BadRequestException('Meeting end time must be after start time.');
    }

    const now = new Date().toISOString();
    const newId = `mtg-${Date.now().toString(36)}`;

    const meeting: MeetingItem = {
      id: newId,
      workspaceId: dto.workspaceId,
      title: dto.title,
      category: dto.category,
      status: MeetingStatus.SCHEDULED,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      organiserId: dto.organiserId,
      participantIds: dto.participantIds || [dto.organiserId],
      externalParticipants: dto.externalParticipants,
      location: dto.location,
      meetingUrl: dto.meetingUrl,
      phoneNumber: dto.phoneNumber,
      agenda: dto.agenda,
      agendaTopics: dto.agendaTopics || [],
      preparation: dto.preparation || {},
      detailedNotes: dto.detailedNotes || {},
      formalDecisions: dto.formalDecisions || [],
      actionItems: dto.actionItems || [],
      attachments: dto.attachments || [],
      outcome: dto.outcome || {},
      linkedRecord: dto.linkedRecord,
      rescheduleHistory: [],
      activity: [
        {
          id: `act-${Date.now()}`,
          action: 'Meeting scheduled',
          actorName: 'Acting Profile',
          timestamp: now,
          details: `Scheduled ${dto.title}`,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    this.meetings.unshift(meeting);
    return meeting;
  }

  updateMeeting(workspaceId: string, id: string, dto: UpdateMeetingDto): MeetingItem {
    const meeting = this.findMeetingById(workspaceId, id);
    if (dto.startTime && dto.endTime && new Date(dto.endTime) <= new Date(dto.startTime)) {
      throw new BadRequestException('Meeting end time must be after start time.');
    }

    const oldStatus = meeting.status;
    Object.assign(meeting, dto);
    const now = new Date().toISOString();
    meeting.updatedAt = now;

    if (dto.status && dto.status !== oldStatus) {
      meeting.activity.push({
        id: `act-${Date.now()}`,
        action: 'Meeting status updated',
        actorName: 'Acting Profile',
        timestamp: now,
        details: `Status updated from ${oldStatus} to ${dto.status}`,
      });
    }

    return meeting;
  }

  rescheduleMeeting(
    workspaceId: string,
    id: string,
    dto: RescheduleMeetingDto,
  ): MeetingItem {
    const meeting = this.findMeetingById(workspaceId, id);
    if (new Date(dto.newEndTime) <= new Date(dto.newStartTime)) {
      throw new BadRequestException('New end time must be after new start time.');
    }

    const now = new Date().toISOString();
    const historyItem: RescheduleEvent = {
      id: `resch-${Date.now()}`,
      oldPlannedStart: meeting.startTime,
      oldDeadline: meeting.endTime,
      newPlannedStart: dto.newStartTime,
      newDeadline: dto.newEndTime,
      reason: dto.reason,
      actorId: dto.actorId || 'acting-profile',
      actorName: 'Acting Profile',
      timestamp: now,
    };

    meeting.rescheduleHistory.push(historyItem);
    meeting.startTime = dto.newStartTime;
    meeting.endTime = dto.newEndTime;
    meeting.date = dto.newStartTime.slice(0, 10);
    meeting.status = MeetingStatus.RESCHEDULED;
    meeting.updatedAt = now;

    meeting.activity.push({
      id: `act-${Date.now()}`,
      action: 'Meeting rescheduled',
      actorName: 'Acting Profile',
      timestamp: now,
      details: `Shifted to ${dto.newStartTime}. Reason: ${dto.reason}`,
    });

    return meeting;
  }

  convertActionItemToTask(
    workspaceId: string,
    meetingId: string,
    dto: ConvertActionItemToTaskDto,
  ) {
    const meeting = this.findMeetingById(workspaceId, meetingId);
    if (!meeting.actionItems) {
      throw new NotFoundException(`No action items found in meeting ${meetingId}`);
    }

    const item = meeting.actionItems.find((a) => a.id === dto.actionItemId);
    if (!item) {
      throw new NotFoundException(`Action item ${dto.actionItemId} not found in meeting`);
    }

    // Prevent duplicate task creation on repeated clicks
    if (item.status === 'CONVERTED' && item.convertedTaskId) {
      const existingTask = this.tasksService.findById(item.convertedTaskId, workspaceId);
      return {
        actionItem: item,
        task: existingTask,
        alreadyConverted: true,
      };
    }

    // Call shared TasksService to create real actionable task
    const createdTask = this.tasksService.create(
      {
        workspaceId,
        title: dto.taskTitle || item.description,
        assigneeId: dto.assigneeId || item.assignedMemberId,
        priority: dto.priority || item.priority || TaskPriority.HIGH,
        deadline: dto.deadline || item.dueDate || new Date(Date.now() + 86400000 * 2).toISOString(),
        linkedRecord: {
          id: meeting.id,
          title: meeting.title,
          type: 'meeting',
        },
      },
      dto.assigneeId || 'acting-profile',
      'Meeting Coordinator',
    );

    item.status = 'CONVERTED';
    item.convertedTaskId = createdTask.id;
    meeting.updatedAt = new Date().toISOString();

    meeting.activity.push({
      id: `act-${Date.now()}`,
      action: 'Action item converted to task',
      actorName: 'Acting Profile',
      timestamp: meeting.updatedAt,
      details: `Action item "${item.description}" converted to task "${createdTask.title}" (${createdTask.id})`,
    });

    return {
      actionItem: item,
      task: createdTask,
      alreadyConverted: false,
    };
  }

  // ==========================================
  // SITE VISITS CRUD
  // ==========================================

  findAllSiteVisits(
    workspaceId: string,
    filter?: { status?: string; memberId?: string; date?: string },
  ): SiteVisitItem[] {
    let result = this.siteVisits.filter((v) => v.workspaceId === workspaceId);
    if (filter?.status) result = result.filter((v) => v.status === filter.status);
    if (filter?.date) result = result.filter((v) => v.visitDate === filter.date);
    if (filter?.memberId) result = result.filter((v) => v.responsibleMemberId === filter.memberId);
    return result;
  }

  findSiteVisitById(workspaceId: string, id: string): SiteVisitItem {
    const visit = this.siteVisits.find((v) => v.workspaceId === workspaceId && v.id === id);
    if (!visit) {
      throw new NotFoundException(`Site visit ${id} not found in workspace ${workspaceId}`);
    }
    return visit;
  }

  createSiteVisit(dto: CreateSiteVisitDto): SiteVisitItem {
    if (new Date(dto.endTime) <= new Date(dto.startTime)) {
      throw new BadRequestException('Site visit end time must be after start time.');
    }

    const now = new Date().toISOString();
    const newId = `vis-${Date.now().toString(36)}`;

    const visit: SiteVisitItem = {
      id: newId,
      workspaceId: dto.workspaceId,
      buyerId: dto.buyerId || `byr-${Date.now()}`,
      buyerName: dto.buyerName,
      buyerPhone: dto.buyerPhone,
      projectId: dto.projectId || `prj-${Date.now()}`,
      projectName: dto.projectName,
      projectLocation: dto.projectLocation,
      propertyUnit: dto.propertyUnit,
      visitDate: dto.visitDate,
      startTime: dto.startTime,
      endTime: dto.endTime,
      responsibleMemberId: dto.responsibleMemberId,
      status: MeetingStatus.SCHEDULED,
      notes: dto.notes,
      rescheduleHistory: [],
      activity: [
        {
          id: `act-${Date.now()}`,
          action: 'Site visit scheduled',
          actorName: 'Acting Profile',
          timestamp: now,
          details: `Scheduled property walkthrough for ${dto.buyerName} at ${dto.projectName}`,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    this.siteVisits.unshift(visit);
    return visit;
  }

  updateSiteVisit(workspaceId: string, id: string, dto: UpdateSiteVisitDto): SiteVisitItem {
    const visit = this.findSiteVisitById(workspaceId, id);
    Object.assign(visit, dto);
    visit.updatedAt = new Date().toISOString();
    return visit;
  }

  rescheduleSiteVisit(
    workspaceId: string,
    id: string,
    dto: RescheduleSiteVisitDto,
  ): SiteVisitItem {
    const visit = this.findSiteVisitById(workspaceId, id);
    if (new Date(dto.newEndTime) <= new Date(dto.newStartTime)) {
      throw new BadRequestException('New end time must be after new start time.');
    }

    const now = new Date().toISOString();
    const historyItem: RescheduleEvent = {
      id: `resch-${Date.now()}`,
      oldPlannedStart: visit.startTime,
      oldDeadline: visit.endTime,
      newPlannedStart: dto.newStartTime,
      newDeadline: dto.newEndTime,
      reason: dto.reason,
      actorId: dto.actorId || 'acting-profile',
      actorName: 'Acting Profile',
      timestamp: now,
    };

    visit.rescheduleHistory.push(historyItem);
    visit.startTime = dto.newStartTime;
    visit.endTime = dto.newEndTime;
    visit.visitDate = dto.newStartTime.slice(0, 10);
    visit.status = MeetingStatus.RESCHEDULED;
    visit.updatedAt = now;

    return visit;
  }
}
