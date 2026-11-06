import { MeetingCategory, MeetingStatus, TaskPriority } from '../enums';
import { RescheduleEvent, TaskActivityEvent } from './task';

export interface MeetingActionItem {
  id: string;
  description: string;
  assignedMemberId: string;
  dueDate?: string;
  priority?: TaskPriority;
  status: 'PENDING' | 'CONVERTED';
  convertedTaskId?: string;
}

export interface MeetingAgendaTopic {
  id: string;
  topic: string;
  ownerId?: string;
  timeMinutes?: number;
  completed?: boolean;
}

export interface MeetingPreparation {
  background?: string;
  links?: string[];
  documents?: string[];
  questions?: string[];
  requiredDecisions?: string[];
}

export interface MeetingDetailedNotes {
  summary?: string;
  topics?: Array<{ topic: string; notes: string }>;
  infoReceived?: string;
  questions?: string[];
  blockers?: string[];
  commitments?: string[];
}

export interface MeetingDecisionRecord {
  id: string;
  decisionText: string;
  responsiblePersonId?: string;
  dueDate?: string;
  supportingFiles?: string[];
  createdByName?: string;
  createdAt: string;
}

export interface MeetingAttachmentItem {
  id: string;
  name: string;
  url: string;
  size?: string;
  uploadedAt?: string;
}

export interface MeetingOutcome {
  outcomeSummary?: string;
  nextSteps?: string;
  nextFollowUpDate?: string;
  nextMeetingDate?: string;
  crmUpdateNote?: string;
}

export interface MeetingItem {
  id: string;
  workspaceId: string;
  title: string;
  category: MeetingCategory;
  status: MeetingStatus;
  date: string; // YYYY-MM-DD
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  organiserId: string;
  participantIds: string[];
  externalParticipants?: string[];
  location?: string;
  meetingUrl?: string;
  phoneNumber?: string;
  agenda?: string;
  notes?: string;
  decisions?: string[];
  actionItems?: MeetingActionItem[];
  linkedRecord?: {
    id: string;
    title: string;
    type: 'client' | 'lead' | 'buyer' | 'project' | 'campaign';
  };
  agendaTopics?: MeetingAgendaTopic[];
  preparation?: MeetingPreparation;
  detailedNotes?: MeetingDetailedNotes;
  formalDecisions?: MeetingDecisionRecord[];
  attachments?: MeetingAttachmentItem[];
  outcome?: MeetingOutcome;
  rescheduleHistory: RescheduleEvent[];
  activity: TaskActivityEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMeetingDto {
  workspaceId: string;
  title: string;
  category: MeetingCategory;
  date: string;
  startTime: string;
  endTime: string;
  organiserId: string;
  participantIds?: string[];
  externalParticipants?: string[];
  location?: string;
  meetingUrl?: string;
  phoneNumber?: string;
  agenda?: string;
  linkedRecord?: {
    id: string;
    title: string;
    type: 'client' | 'lead' | 'buyer' | 'project' | 'campaign';
  };
  agendaTopics?: MeetingAgendaTopic[];
  preparation?: MeetingPreparation;
  detailedNotes?: MeetingDetailedNotes;
  formalDecisions?: MeetingDecisionRecord[];
  actionItems?: MeetingActionItem[];
  attachments?: MeetingAttachmentItem[];
  outcome?: MeetingOutcome;
}

export interface UpdateMeetingDto {
  title?: string;
  category?: MeetingCategory;
  status?: MeetingStatus;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  meetingUrl?: string;
  phoneNumber?: string;
  agenda?: string;
  notes?: string;
  decisions?: string[];
  agendaTopics?: MeetingAgendaTopic[];
  preparation?: MeetingPreparation;
  detailedNotes?: MeetingDetailedNotes;
  formalDecisions?: MeetingDecisionRecord[];
  actionItems?: MeetingActionItem[];
  attachments?: MeetingAttachmentItem[];
  outcome?: MeetingOutcome;
  participantIds?: string[];
  externalParticipants?: string[];
  linkedRecord?: {
    id: string;
    title: string;
    type: 'client' | 'lead' | 'buyer' | 'project' | 'campaign';
  };
}

export interface RescheduleMeetingDto {
  newStartTime: string;
  newEndTime: string;
  reason: string;
  actorId?: string;
}

export interface ConvertActionItemToTaskDto {
  actionItemId: string;
  taskTitle?: string;
  priority?: TaskPriority;
  deadline?: string;
  assigneeId?: string;
}

