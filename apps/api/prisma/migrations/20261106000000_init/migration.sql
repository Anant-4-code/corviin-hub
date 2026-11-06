-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "role" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_memberships" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspace_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "assigneeId" TEXT NOT NULL,
    "assigneeName" TEXT,
    "creatorId" TEXT NOT NULL,
    "creatorName" TEXT,
    "plannedStart" TIMESTAMP(3),
    "deadline" TIMESTAMP(3) NOT NULL,
    "actualStart" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "completedBy" TEXT,
    "completionNote" TEXT,
    "blockerReason" TEXT,
    "expectedResolutionDate" TIMESTAMP(3),
    "linkedRecordId" TEXT,
    "linkedRecordTitle" TEXT,
    "linkedRecordType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_checklist_items" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "task_checklist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_work_sessions" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,

    CONSTRAINT "task_work_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_reschedule_history" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "oldDeadline" TIMESTAMP(3) NOT NULL,
    "newDeadline" TIMESTAMP(3) NOT NULL,
    "oldPlannedStart" TIMESTAMP(3),
    "newPlannedStart" TIMESTAMP(3),
    "reason" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_reschedule_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_comments" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_attachments" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "uploadedAt" TEXT NOT NULL,
    "uploaderName" TEXT NOT NULL,

    CONSTRAINT "task_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_activity_events" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "details" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_activity_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'INITIAL_IDEA',
    "ownerId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "targetPublishDate" TIMESTAMP(3) NOT NULL,
    "actualPublishDate" TIMESTAMP(3),
    "platform" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "objective" TEXT,
    "targetAudience" TEXT,
    "conceptNotes" TEXT,
    "referenceLinks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "finalTopic" TEXT,
    "scriptApproved" BOOLEAN NOT NULL DEFAULT false,
    "scriptReviewerId" TEXT,
    "recordingDate" TIMESTAMP(3),
    "recordingLocation" TEXT,
    "retakeNotes" TEXT,
    "editorId" TEXT,
    "editingInstructions" TEXT,
    "aspectRatio" TEXT,
    "finalAssetApproved" BOOLEAN NOT NULL DEFAULT false,
    "finalAssetUrl" TEXT,
    "revisionRequests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "scheduledDate" TIMESTAMP(3),
    "publicUrl" TEXT,
    "publishingOwnerId" TEXT,
    "publishedProofUrl" TEXT,
    "completionDate" TIMESTAMP(3),
    "performanceNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_scripts" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "hook" TEXT,
    "shotBreakdown" TEXT,
    "cta" TEXT,
    "caption" TEXT,
    "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "feedback" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_scripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_footage_items" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DONE',
    "notes" TEXT,

    CONSTRAINT "campaign_footage_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_stage_history" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "fromStage" TEXT NOT NULL,
    "toStage" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "notes" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_stage_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_asset_links" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "uploadedByName" TEXT NOT NULL,
    "isFinalApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_asset_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_tech_records" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "category" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'NEW_ENQUIRY',
    "source" TEXT NOT NULL,
    "assignedMemberId" TEXT NOT NULL,
    "assignedMemberName" TEXT NOT NULL,
    "serviceType" TEXT,
    "requirementSummary" TEXT NOT NULL,
    "detailedRequirements" TEXT,
    "estimatedBudget" DOUBLE PRECISION,
    "businessType" TEXT,
    "website" TEXT,
    "location" TEXT,
    "notes" TEXT,
    "lostReason" TEXT,
    "followUpLaterDate" TIMESTAMP(3),
    "convertedToClientId" TEXT,
    "originalEnquiryId" TEXT,
    "nextFollowUpDate" TIMESTAMP(3),
    "nextFollowUpTitle" TEXT,
    "lastActivityDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_tech_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_tech_proposals" (
    "id" TEXT NOT NULL,
    "techRecordId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "sentAt" TIMESTAMP(3),
    "referenceUrl" TEXT,

    CONSTRAINT "crm_tech_proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_tech_project_refs" (
    "id" TEXT NOT NULL,
    "techRecordId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),

    CONSTRAINT "crm_tech_project_refs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_tech_stage_history" (
    "id" TEXT NOT NULL,
    "techRecordId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "notes" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_tech_stage_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_partner_records" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "partnerType" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'NEW_PARTNER_LEAD',
    "assignedMemberId" TEXT NOT NULL,
    "assignedMemberName" TEXT NOT NULL,
    "location" TEXT,
    "website" TEXT,
    "marketingRequirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "serviceRequirementsText" TEXT,
    "partnershipInterest" TEXT,
    "mandateSignedAt" TIMESTAMP(3),
    "activeSince" TIMESTAMP(3),
    "source" TEXT,
    "notes" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "estimatedPortfolioValue" DOUBLE PRECISION,
    "nextFollowUpDate" TIMESTAMP(3),
    "nextFollowUpTitle" TEXT,
    "lastActivityDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_partner_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_partner_projects" (
    "id" TEXT NOT NULL,
    "partnerRecordId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectType" TEXT,
    "location" TEXT NOT NULL,
    "reraNumber" TEXT,
    "totalUnitsOrAcres" TEXT,
    "status" TEXT NOT NULL DEFAULT 'UPCOMING',
    "linkedCampaignIds" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "crm_partner_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_partner_stage_history" (
    "id" TEXT NOT NULL,
    "partnerRecordId" TEXT NOT NULL,
    "fromStage" TEXT,
    "toStage" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "notes" TEXT,
    "lostReason" TEXT,
    "followUpLaterDate" TIMESTAMP(3),
    "mandateType" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_partner_stage_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_buyer_records" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "preferredContactMethod" TEXT,
    "stage" TEXT NOT NULL DEFAULT 'NEW_ENQUIRY',
    "assignedMemberId" TEXT NOT NULL,
    "assignedMemberName" TEXT NOT NULL,
    "locality" TEXT,
    "propertyType" TEXT,
    "configuration" TEXT,
    "minBudget" DOUBLE PRECISION,
    "maxBudget" DOUBLE PRECISION,
    "buyingTimeline" TEXT,
    "purpose" TEXT,
    "preferredProject" TEXT,
    "sourceCampaign" TEXT,
    "enquirySource" TEXT NOT NULL,
    "notes" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "nextFollowUpDate" TIMESTAMP(3),
    "nextFollowUpTitle" TEXT,
    "lastActivityDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_buyer_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_buyer_shared_properties" (
    "id" TEXT NOT NULL,
    "buyerRecordId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "propertyType" TEXT,
    "configuration" TEXT,
    "priceEstimate" DOUBLE PRECISION,
    "sharedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feedback" TEXT,

    CONSTRAINT "crm_buyer_shared_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_buyer_stage_history" (
    "id" TEXT NOT NULL,
    "buyerRecordId" TEXT NOT NULL,
    "fromStage" TEXT,
    "toStage" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "notes" TEXT,
    "lostReason" TEXT,
    "followUpLaterDate" TIMESTAMP(3),
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_buyer_stage_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_visits" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "buyerRecordId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectLocation" TEXT NOT NULL,
    "propertyUnit" TEXT,
    "visitDate" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "responsibleMemberId" TEXT NOT NULL,
    "responsibleMemberName" TEXT NOT NULL,
    "notes" TEXT,
    "feedback" TEXT,
    "objections" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_follow_ups" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "recordTitle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "assignedMemberId" TEXT NOT NULL,
    "assignedMemberName" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT,
    "completedAt" TIMESTAMP(3),
    "completedBy" TEXT,
    "completionNotes" TEXT,
    "linkedTaskId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_follow_ups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_interactions" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "crm_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meetings" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "date" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "organiserId" TEXT NOT NULL,
    "participantIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "externalParticipants" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "location" TEXT,
    "meetingUrl" TEXT,
    "phoneNumber" TEXT,
    "agenda" TEXT,
    "notes" TEXT,
    "decisions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "linkedRecordId" TEXT,
    "linkedRecordTitle" TEXT,
    "linkedRecordType" TEXT,
    "preparation" JSONB,
    "detailedNotes" JSONB,
    "outcome" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_action_items" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "assignedMemberId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "priority" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "convertedTaskId" TEXT,

    CONSTRAINT "meeting_action_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_agenda_topics" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "ownerId" TEXT,
    "timeMinutes" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "meeting_agenda_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_decisions" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "decisionText" TEXT NOT NULL,
    "responsiblePersonId" TEXT,
    "dueDate" TIMESTAMP(3),
    "supportingFiles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meeting_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "expectedOutcome" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3),
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "progressMode" TEXT NOT NULL DEFAULT 'MANUAL',
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "isAtRisk" BOOLEAN NOT NULL DEFAULT false,
    "riskReason" TEXT,
    "metricName" TEXT,
    "metricTargetValue" DOUBLE PRECISION,
    "metricCurrentValue" DOUBLE PRECISION,
    "metricUnit" TEXT,
    "participantIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "linkedPlanIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "linkedCampaignIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "goalId" TEXT,
    "goalTitle" TEXT,
    "title" TEXT NOT NULL,
    "strategySummary" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "progressMode" TEXT NOT NULL DEFAULT 'MANUAL',
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "isAtRisk" BOOLEAN NOT NULL DEFAULT false,
    "riskReason" TEXT,
    "participantIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "resources" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "risks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "linkedCampaignIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_milestones" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT,
    "ownerName" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "completedAt" TIMESTAMP(3),
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "plan_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "storageProvider" TEXT NOT NULL DEFAULT 'r2',
    "mimeType" TEXT NOT NULL,
    "sizeBytes" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "typeGroup" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "uploaderName" TEXT NOT NULL,
    "currentVersionNumber" INTEGER NOT NULL DEFAULT 1,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "previewUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_versions" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "sizeBytes" DOUBLE PRECISION NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "uploaderName" TEXT NOT NULL,
    "changeNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asset_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_relationships" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "relatedType" TEXT NOT NULL,
    "relatedId" TEXT NOT NULL,
    "relatedTitle" TEXT NOT NULL,
    "stage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asset_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "in_app_notifications" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "actionDestination" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "in_app_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "actingRole" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "correlationId" TEXT,
    "previousValues" JSONB,
    "newValues" JSONB,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_settings" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "initials" TEXT NOT NULL,
    "bio" TEXT,
    "role" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "dateFormat" TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
    "timeFormat" TEXT NOT NULL DEFAULT '12h',
    "weekStartDay" TEXT NOT NULL DEFAULT 'MONDAY',
    "defaultCalendarView" TEXT NOT NULL DEFAULT 'WEEK',
    "theme" TEXT NOT NULL DEFAULT 'light',
    "notifications" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_settings" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "workspaceName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "primaryCurrency" TEXT NOT NULL DEFAULT 'INR',
    "timeZone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "defaultTaskPriority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "defaultTaskDueDays" INTEGER NOT NULL DEFAULT 1,
    "autoAssignCreator" BOOLEAN NOT NULL DEFAULT true,
    "allowedCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "allowedStages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "storageQuotaBytes" DOUBLE PRECISION NOT NULL DEFAULT 10737418240,
    "maxUploadSizeBytes" DOUBLE PRECISION NOT NULL DEFAULT 52428800,
    "allowedMimeTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "alertChannelInApp" BOOLEAN NOT NULL DEFAULT true,
    "alertChannelEmail" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_slug_key" ON "workspaces"("slug");

-- CreateIndex
CREATE INDEX "workspace_memberships_workspaceId_idx" ON "workspace_memberships"("workspaceId");

-- CreateIndex
CREATE INDEX "workspace_memberships_profileId_idx" ON "workspace_memberships"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_memberships_workspaceId_profileId_key" ON "workspace_memberships"("workspaceId", "profileId");

-- CreateIndex
CREATE INDEX "tasks_workspaceId_status_idx" ON "tasks"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "tasks_assigneeId_idx" ON "tasks"("assigneeId");

-- CreateIndex
CREATE INDEX "tasks_deadline_idx" ON "tasks"("deadline");

-- CreateIndex
CREATE INDEX "task_checklist_items_taskId_idx" ON "task_checklist_items"("taskId");

-- CreateIndex
CREATE INDEX "task_work_sessions_taskId_idx" ON "task_work_sessions"("taskId");

-- CreateIndex
CREATE INDEX "task_reschedule_history_taskId_idx" ON "task_reschedule_history"("taskId");

-- CreateIndex
CREATE INDEX "task_comments_taskId_idx" ON "task_comments"("taskId");

-- CreateIndex
CREATE INDEX "task_attachments_taskId_idx" ON "task_attachments"("taskId");

-- CreateIndex
CREATE INDEX "task_activity_events_taskId_idx" ON "task_activity_events"("taskId");

-- CreateIndex
CREATE INDEX "campaigns_workspaceId_stage_idx" ON "campaigns"("workspaceId", "stage");

-- CreateIndex
CREATE INDEX "campaigns_ownerId_idx" ON "campaigns"("ownerId");

-- CreateIndex
CREATE INDEX "campaign_scripts_campaignId_idx" ON "campaign_scripts"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_footage_items_campaignId_idx" ON "campaign_footage_items"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_stage_history_campaignId_idx" ON "campaign_stage_history"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_asset_links_campaignId_idx" ON "campaign_asset_links"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_asset_links_assetId_idx" ON "campaign_asset_links"("assetId");

-- CreateIndex
CREATE INDEX "crm_tech_records_workspaceId_stage_idx" ON "crm_tech_records"("workspaceId", "stage");

-- CreateIndex
CREATE INDEX "crm_tech_records_phone_idx" ON "crm_tech_records"("phone");

-- CreateIndex
CREATE INDEX "crm_tech_records_email_idx" ON "crm_tech_records"("email");

-- CreateIndex
CREATE INDEX "crm_tech_proposals_techRecordId_idx" ON "crm_tech_proposals"("techRecordId");

-- CreateIndex
CREATE INDEX "crm_tech_project_refs_techRecordId_idx" ON "crm_tech_project_refs"("techRecordId");

-- CreateIndex
CREATE INDEX "crm_tech_stage_history_techRecordId_idx" ON "crm_tech_stage_history"("techRecordId");

-- CreateIndex
CREATE INDEX "crm_partner_records_workspaceId_stage_idx" ON "crm_partner_records"("workspaceId", "stage");

-- CreateIndex
CREATE INDEX "crm_partner_records_phone_idx" ON "crm_partner_records"("phone");

-- CreateIndex
CREATE INDEX "crm_partner_projects_partnerRecordId_idx" ON "crm_partner_projects"("partnerRecordId");

-- CreateIndex
CREATE INDEX "crm_partner_stage_history_partnerRecordId_idx" ON "crm_partner_stage_history"("partnerRecordId");

-- CreateIndex
CREATE INDEX "crm_buyer_records_workspaceId_stage_idx" ON "crm_buyer_records"("workspaceId", "stage");

-- CreateIndex
CREATE INDEX "crm_buyer_records_phone_idx" ON "crm_buyer_records"("phone");

-- CreateIndex
CREATE INDEX "crm_buyer_shared_properties_buyerRecordId_idx" ON "crm_buyer_shared_properties"("buyerRecordId");

-- CreateIndex
CREATE INDEX "crm_buyer_stage_history_buyerRecordId_idx" ON "crm_buyer_stage_history"("buyerRecordId");

-- CreateIndex
CREATE INDEX "site_visits_workspaceId_visitDate_idx" ON "site_visits"("workspaceId", "visitDate");

-- CreateIndex
CREATE INDEX "site_visits_buyerRecordId_idx" ON "site_visits"("buyerRecordId");

-- CreateIndex
CREATE INDEX "crm_follow_ups_workspaceId_status_idx" ON "crm_follow_ups"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "crm_follow_ups_dueDate_idx" ON "crm_follow_ups"("dueDate");

-- CreateIndex
CREATE INDEX "crm_interactions_workspaceId_recordId_idx" ON "crm_interactions"("workspaceId", "recordId");

-- CreateIndex
CREATE INDEX "meetings_workspaceId_date_idx" ON "meetings"("workspaceId", "date");

-- CreateIndex
CREATE INDEX "meetings_organiserId_idx" ON "meetings"("organiserId");

-- CreateIndex
CREATE INDEX "meeting_action_items_meetingId_idx" ON "meeting_action_items"("meetingId");

-- CreateIndex
CREATE INDEX "meeting_agenda_topics_meetingId_idx" ON "meeting_agenda_topics"("meetingId");

-- CreateIndex
CREATE INDEX "meeting_decisions_meetingId_idx" ON "meeting_decisions"("meetingId");

-- CreateIndex
CREATE INDEX "goals_workspaceId_status_idx" ON "goals"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "plans_workspaceId_status_idx" ON "plans"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "plan_milestones_planId_idx" ON "plan_milestones"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "assets_storageKey_key" ON "assets"("storageKey");

-- CreateIndex
CREATE INDEX "assets_workspaceId_category_idx" ON "assets"("workspaceId", "category");

-- CreateIndex
CREATE INDEX "assets_workspaceId_typeGroup_idx" ON "assets"("workspaceId", "typeGroup");

-- CreateIndex
CREATE INDEX "asset_versions_assetId_idx" ON "asset_versions"("assetId");

-- CreateIndex
CREATE INDEX "asset_relationships_assetId_idx" ON "asset_relationships"("assetId");

-- CreateIndex
CREATE INDEX "asset_relationships_relatedType_relatedId_idx" ON "asset_relationships"("relatedType", "relatedId");

-- CreateIndex
CREATE INDEX "in_app_notifications_workspaceId_recipientId_isRead_idx" ON "in_app_notifications"("workspaceId", "recipientId", "isRead");

-- CreateIndex
CREATE INDEX "in_app_notifications_createdAt_idx" ON "in_app_notifications"("createdAt");

-- CreateIndex
CREATE INDEX "audit_events_workspaceId_entityType_entityId_idx" ON "audit_events"("workspaceId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_events_timestamp_idx" ON "audit_events"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "personal_settings_profileId_key" ON "personal_settings"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_settings_workspaceId_key" ON "workspace_settings"("workspaceId");

-- AddForeignKey
ALTER TABLE "workspace_memberships" ADD CONSTRAINT "workspace_memberships_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_memberships" ADD CONSTRAINT "workspace_memberships_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_checklist_items" ADD CONSTRAINT "task_checklist_items_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_work_sessions" ADD CONSTRAINT "task_work_sessions_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_reschedule_history" ADD CONSTRAINT "task_reschedule_history_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_comments" ADD CONSTRAINT "task_comments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_attachments" ADD CONSTRAINT "task_attachments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_activity_events" ADD CONSTRAINT "task_activity_events_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_scripts" ADD CONSTRAINT "campaign_scripts_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_footage_items" ADD CONSTRAINT "campaign_footage_items_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_stage_history" ADD CONSTRAINT "campaign_stage_history_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_asset_links" ADD CONSTRAINT "campaign_asset_links_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_tech_records" ADD CONSTRAINT "crm_tech_records_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_tech_proposals" ADD CONSTRAINT "crm_tech_proposals_techRecordId_fkey" FOREIGN KEY ("techRecordId") REFERENCES "crm_tech_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_tech_project_refs" ADD CONSTRAINT "crm_tech_project_refs_techRecordId_fkey" FOREIGN KEY ("techRecordId") REFERENCES "crm_tech_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_tech_stage_history" ADD CONSTRAINT "crm_tech_stage_history_techRecordId_fkey" FOREIGN KEY ("techRecordId") REFERENCES "crm_tech_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_partner_records" ADD CONSTRAINT "crm_partner_records_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_partner_projects" ADD CONSTRAINT "crm_partner_projects_partnerRecordId_fkey" FOREIGN KEY ("partnerRecordId") REFERENCES "crm_partner_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_partner_stage_history" ADD CONSTRAINT "crm_partner_stage_history_partnerRecordId_fkey" FOREIGN KEY ("partnerRecordId") REFERENCES "crm_partner_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_buyer_records" ADD CONSTRAINT "crm_buyer_records_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_buyer_shared_properties" ADD CONSTRAINT "crm_buyer_shared_properties_buyerRecordId_fkey" FOREIGN KEY ("buyerRecordId") REFERENCES "crm_buyer_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_buyer_stage_history" ADD CONSTRAINT "crm_buyer_stage_history_buyerRecordId_fkey" FOREIGN KEY ("buyerRecordId") REFERENCES "crm_buyer_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_visits" ADD CONSTRAINT "site_visits_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_visits" ADD CONSTRAINT "site_visits_buyerRecordId_fkey" FOREIGN KEY ("buyerRecordId") REFERENCES "crm_buyer_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_follow_ups" ADD CONSTRAINT "crm_follow_ups_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_interactions" ADD CONSTRAINT "crm_interactions_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_action_items" ADD CONSTRAINT "meeting_action_items_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_agenda_topics" ADD CONSTRAINT "meeting_agenda_topics_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_decisions" ADD CONSTRAINT "meeting_decisions_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plans" ADD CONSTRAINT "plans_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_milestones" ADD CONSTRAINT "plan_milestones_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_versions" ADD CONSTRAINT "asset_versions_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_relationships" ADD CONSTRAINT "asset_relationships_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "in_app_notifications" ADD CONSTRAINT "in_app_notifications_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_settings" ADD CONSTRAINT "personal_settings_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_settings" ADD CONSTRAINT "workspace_settings_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
