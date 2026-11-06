import { MeetingStatus } from '../enums';
import { RescheduleEvent, TaskActivityEvent } from './task';

export interface SiteVisitItem {
  id: string;
  workspaceId: string;
  buyerId: string;
  buyerName: string;
  buyerPhone?: string;
  projectId: string;
  projectName: string;
  projectLocation: string;
  propertyUnit?: string;
  visitDate: string; // YYYY-MM-DD
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  responsibleMemberId: string;
  status: MeetingStatus;
  feedback?: string;
  nextFollowUpDate?: string;
  notes?: string;
  rescheduleHistory: RescheduleEvent[];
  activity: TaskActivityEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSiteVisitDto {
  workspaceId: string;
  buyerName: string;
  buyerPhone?: string;
  buyerId?: string;
  projectName: string;
  projectLocation: string;
  propertyUnit?: string;
  projectId?: string;
  visitDate: string;
  startTime: string;
  endTime: string;
  responsibleMemberId: string;
  notes?: string;
}

export interface UpdateSiteVisitDto {
  status?: MeetingStatus;
  feedback?: string;
  nextFollowUpDate?: string;
  notes?: string;
}

export interface RescheduleSiteVisitDto {
  newStartTime: string;
  newEndTime: string;
  reason: string;
  actorId?: string;
}

