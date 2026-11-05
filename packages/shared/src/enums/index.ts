// ============================================================
// CORVIIN HUB — Shared Enums
// ============================================================

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  BLOCKED = 'BLOCKED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  URGENT = 'URGENT',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum CampaignStage {
  INITIAL_IDEA = 'INITIAL_IDEA',
  SCRIPTING_PLANNING = 'SCRIPTING_PLANNING',
  RECORDING_UPLOAD = 'RECORDING_UPLOAD',
  EDITING_FINAL = 'EDITING_FINAL',
  POSTING_COMPLETION = 'POSTING_COMPLETION',
}

export enum CrmType {
  TECH_LEAD = 'TECH_LEAD',
  RE_PARTNER = 'RE_PARTNER',
  RE_BUYER = 'RE_BUYER',
}

export enum MeetingStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  RESCHEDULED = 'RESCHEDULED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum PlanStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export enum GoalStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  AT_RISK = 'AT_RISK',
  ACHIEVED = 'ACHIEVED',
  MISSED = 'MISSED',
  CANCELLED = 'CANCELLED',
}
