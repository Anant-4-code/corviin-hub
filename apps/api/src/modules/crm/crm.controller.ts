import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiQuery } from '@nestjs/swagger';
import {
  CrmType,
  CrmFollowUpStatus,
  CrmSearchFilterDto,
  CreateFollowUpDto,
  CompleteFollowUpDto,
  LogInteractionDto,
  QuickCreateCrmRecordDto,
  TechRecordCategory,
  TechPipelineStage,
  TechCrmFilterDto,
  CreateTechRecordDto,
  UpdateTechRecordDto,
  ChangeTechStageDto,
  ConvertWonToClientDto,
  CheckDuplicatesDto,
  CreateTechLinkedTaskDto,
  AddTechProposalDto,
  RealEstatePartnerType,
  RealEstatePartnerStage,
  PartnerCrmFilterDto,
  CreatePartnerRecordDto,
  UpdatePartnerRecordDto,
  ChangePartnerStageDto,
  ConfirmOrActivatePartnerDto,
  AddPartnerProjectDto,
  CreatePartnerLinkedTaskDto,
  SchedulePartnerMeetingDto,
  CheckPartnerDuplicatesDto,
  RealEstateBuyerStage,
  BuyerPropertyConfiguration,
  BuyerPropertyType,
  BuyerBuyingTimeline,
  BuyerPurchasePurpose,
  BuyerCrmFilterDto,
  CreateBuyerRecordDto,
  UpdateBuyerRecordDto,
  ChangeBuyerStageDto,
  ScheduleBuyerSiteVisitDto,
  ShareBuyerPropertyDto,
  CreateBuyerLinkedTaskDto,
  CheckBuyerDuplicatesDto,
} from '@corviin-hub/shared';
import { CrmService } from './crm.service';

@ApiTags('CRM')
@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  private resolveWorkspaceId(headerWs?: string, queryWs?: string): string {
    const ws = headerWs || queryWs;
    if (!ws) {
      throw new BadRequestException('Workspace context is required via x-workspace-id header or workspaceId query parameter.');
    }
    return ws;
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get workspace-specific CRM overview metrics, recent records, follow-ups, and timeline' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  getOverview(
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.getOverview(workspaceId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Global CRM search across permitted workspace records with normalized phone matching' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'recordType', required: false, enum: CrmType })
  @ApiQuery({ name: 'stage', required: false })
  @ApiQuery({ name: 'assignedMemberId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  search(
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
    @Query('query') query?: string,
    @Query('recordType') recordType?: CrmType,
    @Query('stage') stage?: string,
    @Query('assignedMemberId') assignedMemberId?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    const filterDto: CrmSearchFilterDto = {
      query,
      recordType,
      stage,
      assignedMemberId,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    };
    return this.crmService.search(workspaceId, filterDto);
  }

  @Post('records')
  @ApiOperation({ summary: 'Quick-create a new CRM record with workspace validation and default stage' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  createRecord(
    @Body() dto: QuickCreateCrmRecordDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.createQuickRecord(workspaceId, dto);
  }

  @Get('follow-ups')
  @ApiOperation({ summary: 'List structured follow-ups for active workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: CrmFollowUpStatus })
  getFollowUps(
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
    @Query('status') status?: CrmFollowUpStatus,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.getFollowUps(workspaceId, status);
  }

  @Post('follow-ups')
  @ApiOperation({ summary: 'Schedule a new structured follow-up for a CRM record' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  createFollowUp(
    @Body() dto: CreateFollowUpDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.createFollowUp(workspaceId, dto);
  }

  @Patch('follow-ups/:id/complete')
  @ApiOperation({ summary: 'Mark follow-up as completed and log interaction event' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  completeFollowUp(
    @Param('id') id: string,
    @Body() dto: CompleteFollowUpDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.completeFollowUp(workspaceId, id, dto);
  }

  @Post('interactions')
  @ApiOperation({ summary: 'Log phone call, message, email, meeting, site visit or note on CRM record' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  logInteraction(
    @Body() dto: LogInteractionDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.logInteraction(workspaceId, dto);
  }

  // ==========================================
  // CORVIIN TECH CRM CONTROLLER (Feature 11)
  // ==========================================

  @Get('tech/summary')
  @ApiOperation({ summary: 'Get summary metrics and workload distribution for Tech CRM' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  getTechSummary(
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.getTechSummary(workspaceId);
  }

  @Get('tech/records')
  @ApiOperation({ summary: 'List and filter Tech CRM enquiries, clients, and partners' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  @ApiQuery({ name: 'category', required: false, enum: TechRecordCategory })
  @ApiQuery({ name: 'stage', required: false, enum: TechPipelineStage })
  @ApiQuery({ name: 'assignedMemberId', required: false })
  @ApiQuery({ name: 'source', required: false })
  @ApiQuery({ name: 'serviceType', required: false })
  @ApiQuery({ name: 'followUpFilter', required: false, enum: ['ALL', 'TODAY', 'OVERDUE', 'THIS_WEEK'] })
  @ApiQuery({ name: 'minBudget', required: false })
  @ApiQuery({ name: 'maxBudget', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  getTechRecords(
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
    @Query('category') category?: TechRecordCategory,
    @Query('stage') stage?: TechPipelineStage,
    @Query('assignedMemberId') assignedMemberId?: string,
    @Query('source') source?: string,
    @Query('serviceType') serviceType?: string,
    @Query('followUpFilter') followUpFilter?: 'ALL' | 'TODAY' | 'OVERDUE' | 'THIS_WEEK',
    @Query('minBudget') minBudget?: string,
    @Query('maxBudget') maxBudget?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    const filterDto: TechCrmFilterDto = {
      category,
      stage,
      assignedMemberId,
      source,
      serviceType,
      followUpFilter,
      minBudget: minBudget ? parseFloat(minBudget) : undefined,
      maxBudget: maxBudget ? parseFloat(maxBudget) : undefined,
      search,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    };
    return this.crmService.getTechRecords(workspaceId, filterDto);
  }

  @Post('tech/records')
  @ApiOperation({ summary: 'Create a new Tech CRM enquiry or prospective project record' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  createTechRecord(
    @Body() dto: CreateTechRecordDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.createTechRecord(workspaceId, dto);
  }

  @Post('tech/check-duplicates')
  @ApiOperation({ summary: 'Check for possible duplicates by phone, email, or company name before creating' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  checkDuplicates(
    @Body() dto: CheckDuplicatesDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.checkDuplicates(workspaceId, dto);
  }

  @Get('tech/records/:id')
  @ApiOperation({ summary: 'Get full Tech CRM record detail including timeline, tasks, meetings, and proposals' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  getTechRecordById(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.getTechRecordById(workspaceId, id);
  }

  @Patch('tech/records/:id')
  @ApiOperation({ summary: 'Update Tech CRM record fields and requirements' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  updateTechRecord(
    @Param('id') id: string,
    @Body() dto: UpdateTechRecordDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.updateTechRecord(workspaceId, id, dto);
  }

  @Post('tech/records/:id/stage')
  @ApiOperation({ summary: 'Change pipeline stage and record stage transition audit entry' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  changeTechStage(
    @Param('id') id: string,
    @Body() dto: ChangeTechStageDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.changeTechStage(workspaceId, id, dto);
  }

  @Post('tech/records/:id/convert-to-client')
  @ApiOperation({ summary: 'Convert Won opportunity to Client Account while preserving history' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  convertWonToClient(
    @Param('id') id: string,
    @Body() dto: ConvertWonToClientDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.convertWonToClient(workspaceId, id, dto);
  }

  @Post('tech/records/:id/tasks')
  @ApiOperation({ summary: 'Create an idempotent linked task for a Tech CRM record' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  createTechLinkedTask(
    @Param('id') id: string,
    @Body() dto: CreateTechLinkedTaskDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.createTechLinkedTask(workspaceId, id, dto);
  }

  @Post('tech/records/:id/proposals')
  @ApiOperation({ summary: 'Attach a proposal or quotation reference to Tech CRM record' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  addTechProposal(
    @Param('id') id: string,
    @Body() dto: AddTechProposalDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.addTechProposal(workspaceId, id, dto);
  }

  @Post('tech/records/:id/notes')
  @ApiOperation({ summary: 'Add a requirement or technical note to Tech CRM record' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  addTechRequirementNote(
    @Param('id') id: string,
    @Body() body: { note: string; actorId?: string; actorName?: string },
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.addTechRequirementNote(
      workspaceId,
      id,
      body.note,
      body.actorId,
      body.actorName,
    );
  }

  // ============================================================
  // REAL ESTATE DEVELOPERS & PARTNERS CRM ENDPOINTS (FEATURE 12)
  // ============================================================

  @Get('partners/summary')
  @ApiOperation({ summary: 'Get Real Estate Partners summary metrics, project counts, stage distribution' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  getPartnerSummary(
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.getPartnerSummary(workspaceId);
  }

  @Get('partners/records')
  @ApiOperation({ summary: 'Get paginated Real Estate Partner records with multi-filters, project and location search' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  getPartnerRecords(
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
    @Query('search') search?: string,
    @Query('partnerType') partnerType?: RealEstatePartnerType,
    @Query('stage') stage?: RealEstatePartnerStage,
    @Query('assignedMemberId') assignedMemberId?: string,
    @Query('location') location?: string,
    @Query('projectName') projectName?: string,
    @Query('source') source?: string,
    @Query('followUpDue') followUpDue?: 'ALL' | 'TODAY' | 'OVERDUE' | 'THIS_WEEK',
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('sortBy') sortBy?: 'companyName' | 'createdAt' | 'nextFollowUpDate' | 'stage',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    const filterDto: PartnerCrmFilterDto = {
      search,
      partnerType,
      stage,
      assignedMemberId,
      location,
      projectName,
      source,
      followUpDue,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      sortBy,
      sortOrder,
    };
    return this.crmService.getPartnerRecords(workspaceId, filterDto);
  }

  @Post('partners/records')
  @ApiOperation({ summary: 'Create a new Real Estate Developer or Partner record' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  createPartnerRecord(
    @Body() dto: CreatePartnerRecordDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.createPartnerRecord(workspaceId, dto);
  }

  @Post('partners/check-duplicates')
  @ApiOperation({ summary: 'Check for potential duplicate partners by phone, email, or company name' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  checkPartnerDuplicates(
    @Body() dto: CheckPartnerDuplicatesDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.checkPartnerDuplicates(workspaceId, dto);
  }

  @Get('partners/records/:id')
  @ApiOperation({ summary: 'Get full Real Estate Partner record details with projects, history, and linked entities' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  getPartnerRecordById(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.getPartnerRecordById(workspaceId, id);
  }

  @Patch('partners/records/:id')
  @ApiOperation({ summary: 'Update Real Estate Partner record details' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  updatePartnerRecord(
    @Param('id') id: string,
    @Body() dto: UpdatePartnerRecordDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.updatePartnerRecord(workspaceId, id, dto);
  }

  @Post('partners/records/:id/stage')
  @ApiOperation({ summary: 'Change partner pipeline stage and append to immutable audit history' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  changePartnerStage(
    @Param('id') id: string,
    @Body() dto: ChangePartnerStageDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.changePartnerStage(workspaceId, id, dto);
  }

  @Post('partners/records/:id/confirm-or-activate')
  @ApiOperation({ summary: 'Confirm partnership mandate or activate ongoing partner relationship' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  confirmOrActivatePartner(
    @Param('id') id: string,
    @Body() dto: ConfirmOrActivatePartnerDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.confirmOrActivatePartner(workspaceId, id, dto);
  }

  @Post('partners/records/:id/projects')
  @ApiOperation({ summary: 'Add a new project or development reference to partner record' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  addPartnerProject(
    @Param('id') id: string,
    @Body() dto: AddPartnerProjectDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.addPartnerProject(workspaceId, id, dto);
  }

  @Post('partners/records/:id/tasks')
  @ApiOperation({ summary: 'Create a linked task in shared task engine for this partner' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  createPartnerLinkedTask(
    @Param('id') id: string,
    @Body() dto: CreatePartnerLinkedTaskDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.createPartnerLinkedTask(workspaceId, id, dto);
  }

  @Post('partners/records/:id/meetings')
  @ApiOperation({ summary: 'Schedule a meeting prelinked to this partner and project' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  schedulePartnerMeeting(
    @Param('id') id: string,
    @Body() dto: SchedulePartnerMeetingDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.schedulePartnerMeeting(workspaceId, id, dto);
  }

  @Post('partners/records/:id/interactions')
  @ApiOperation({ summary: 'Log a call, WhatsApp message, meeting note, or update for this partner' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  addPartnerInteraction(
    @Param('id') id: string,
    @Body() body: { type: any; title: string; description?: string; actorId?: string; actorName?: string },
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.addPartnerInteraction(workspaceId, id, body);
  }

  // ============================================================
  // REAL ESTATE BUYERS & PROPERTY CUSTOMERS ENDPOINTS (FEATURE 13)
  // ============================================================

  @Get('buyers/summary')
  @ApiOperation({ summary: 'Get Real Estate Buyer summary metrics, site visit counts, pipeline distribution' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  getBuyerSummary(
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.getBuyerSummary(workspaceId);
  }

  @Get('buyers/records')
  @ApiOperation({ summary: 'Get paginated Real Estate Buyer records with search, filters, and sorting' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  @ApiQuery({ name: 'workspaceId', required: false })
  getBuyerRecords(
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
    @Query('search') search?: string,
    @Query('stage') stage?: RealEstateBuyerStage,
    @Query('assignedMemberId') assignedMemberId?: string,
    @Query('locality') locality?: string,
    @Query('configuration') configuration?: BuyerPropertyConfiguration,
    @Query('propertyType') propertyType?: BuyerPropertyType,
    @Query('minBudget') minBudget?: string,
    @Query('maxBudget') maxBudget?: string,
    @Query('buyingTimeline') buyingTimeline?: BuyerBuyingTimeline,
    @Query('preferredProject') preferredProject?: string,
    @Query('sourceCampaign') sourceCampaign?: string,
    @Query('followUpDue') followUpDue?: 'ALL' | 'TODAY' | 'OVERDUE' | 'THIS_WEEK',
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('sortBy') sortBy?: 'customerName' | 'createdAt' | 'nextFollowUpDate' | 'stage',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    const filterDto: BuyerCrmFilterDto = {
      search,
      stage,
      assignedMemberId,
      locality,
      configuration,
      propertyType,
      minBudget: minBudget ? parseInt(minBudget, 10) : undefined,
      maxBudget: maxBudget ? parseInt(maxBudget, 10) : undefined,
      buyingTimeline,
      preferredProject,
      sourceCampaign,
      followUpDue,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      sortBy,
      sortOrder,
    };
    return this.crmService.getBuyerRecords(workspaceId, filterDto);
  }

  @Post('buyers/records')
  @ApiOperation({ summary: 'Create a new Real Estate Buyer / property enquiry record' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  createBuyerRecord(
    @Body() dto: CreateBuyerRecordDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.createBuyerRecord(workspaceId, dto);
  }

  @Post('buyers/check-duplicates')
  @ApiOperation({ summary: 'Check for potential duplicate buyers by phone, email, or customer name' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  checkBuyerDuplicates(
    @Body() dto: CheckBuyerDuplicatesDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.checkBuyerDuplicates(workspaceId, dto);
  }

  @Get('buyers/records/:id')
  @ApiOperation({ summary: 'Get full Real Estate Buyer record details with site visits, properties, and timeline' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  getBuyerRecordById(
    @Param('id') id: string,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.getBuyerRecordById(workspaceId, id);
  }

  @Patch('buyers/records/:id')
  @ApiOperation({ summary: 'Update Real Estate Buyer preferences and details' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  updateBuyerRecord(
    @Param('id') id: string,
    @Body() dto: UpdateBuyerRecordDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.updateBuyerRecord(workspaceId, id, dto);
  }

  @Post('buyers/records/:id/stage')
  @ApiOperation({ summary: 'Change buyer pipeline stage and append to immutable stage history' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  changeBuyerStage(
    @Param('id') id: string,
    @Body() dto: ChangeBuyerStageDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.changeBuyerStage(workspaceId, id, dto);
  }

  @Post('buyers/records/:id/site-visits')
  @ApiOperation({ summary: 'Schedule a new site visit for this buyer, synced with Meetings & Visits calendar' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  scheduleBuyerSiteVisit(
    @Param('id') id: string,
    @Body() dto: ScheduleBuyerSiteVisitDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.scheduleBuyerSiteVisit(workspaceId, id, dto);
  }

  @Post('buyers/records/:id/shared-properties')
  @ApiOperation({ summary: 'Record a shared property or project recommendation for this buyer' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  shareBuyerProperty(
    @Param('id') id: string,
    @Body() dto: ShareBuyerPropertyDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.shareBuyerProperty(workspaceId, id, dto);
  }

  @Post('buyers/records/:id/tasks')
  @ApiOperation({ summary: 'Create a linked follow-up task in shared task engine for this buyer' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  createBuyerLinkedTask(
    @Param('id') id: string,
    @Body() dto: CreateBuyerLinkedTaskDto,
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.createBuyerLinkedTask(workspaceId, id, dto);
  }

  @Post('buyers/records/:id/interactions')
  @ApiOperation({ summary: 'Log a call, WhatsApp message, requirement note, or update for this buyer' })
  @ApiHeader({ name: 'x-workspace-id', required: false })
  addBuyerInteraction(
    @Param('id') id: string,
    @Body() body: { type: any; title: string; description?: string; actorId?: string; actorName?: string },
    @Headers('x-workspace-id') headerWs?: string,
    @Query('workspaceId') queryWs?: string,
  ) {
    const workspaceId = this.resolveWorkspaceId(headerWs, queryWs);
    return this.crmService.addBuyerInteraction(workspaceId, id, body);
  }
}
