import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Query,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  InAppNotificationItem,
  AuditEventItem,
  EmitEventDto,
  NotificationType,
  AuditEntityType,
  AuditAction,
} from '@corviin-hub/shared';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications & Audit')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get in-app notifications for acting profile' })
  @ApiQuery({ name: 'workspaceId', required: true })
  @ApiQuery({ name: 'profileId', required: false })
  @ApiQuery({ name: 'unreadOnly', required: false })
  @ApiQuery({ name: 'type', required: false })
  getNotifications(
    @Query('workspaceId') workspaceId: string,
    @Query('profileId') profileId?: string,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('type') type?: NotificationType,
    @Headers('x-profile-id') headerProfileId?: string,
  ): InAppNotificationItem[] {
    if (!workspaceId) {
      throw new BadRequestException('workspaceId is required.');
    }
    const targetProfileId = profileId || headerProfileId;
    return this.notificationsService.getNotifications({
      workspaceId,
      profileId: targetProfileId,
      unreadOnly: unreadOnly === 'true',
      type,
    });
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count badge' })
  @ApiQuery({ name: 'workspaceId', required: true })
  @ApiQuery({ name: 'profileId', required: false })
  getUnreadCount(
    @Query('workspaceId') workspaceId: string,
    @Query('profileId') profileId?: string,
    @Headers('x-profile-id') headerProfileId?: string,
  ): { count: number } {
    if (!workspaceId) {
      throw new BadRequestException('workspaceId is required.');
    }
    const targetProfileId = profileId || headerProfileId;
    return this.notificationsService.getUnreadCount(workspaceId, targetProfileId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read or unread' })
  markAsRead(
    @Param('id') id: string,
    @Body('isRead') isRead?: boolean,
  ): InAppNotificationItem {
    const flag = isRead !== undefined ? isRead : true;
    return this.notificationsService.markAsRead(id, flag);
  }

  @Post('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read for current profile' })
  markAllAsRead(
    @Body('workspaceId') workspaceId: string,
    @Body('recipientId') recipientId?: string,
    @Headers('x-profile-id') headerProfileId?: string,
  ): { updatedCount: number } {
    const targetRecipient = recipientId || headerProfileId;
    if (!workspaceId || !targetRecipient) {
      throw new BadRequestException('workspaceId and recipientId are required.');
    }
    return this.notificationsService.markAllAsRead(workspaceId, targetRecipient);
  }

  @Get('audit-events')
  @ApiOperation({ summary: 'Get chronological workspace audit activity timeline' })
  @ApiQuery({ name: 'workspaceId', required: true })
  @ApiQuery({ name: 'entityType', required: false })
  @ApiQuery({ name: 'entityId', required: false })
  @ApiQuery({ name: 'actorId', required: false })
  @ApiQuery({ name: 'action', required: false })
  getAuditEvents(
    @Query('workspaceId') workspaceId: string,
    @Query('entityType') entityType?: AuditEntityType,
    @Query('entityId') entityId?: string,
    @Query('actorId') actorId?: string,
    @Query('action') action?: AuditAction,
  ): AuditEventItem[] {
    if (!workspaceId) {
      throw new BadRequestException('workspaceId is required.');
    }
    return this.notificationsService.getAuditEvents({
      workspaceId,
      entityType,
      entityId,
      actorId,
      action,
    });
  }

  @Get('audit-events/:id')
  @ApiOperation({ summary: 'Get detailed audit event with before and after state diff' })
  getAuditEventById(@Param('id') id: string): AuditEventItem {
    return this.notificationsService.getAuditEventById(id);
  }

  @Post('emit-event')
  @ApiOperation({ summary: 'Emit domain audit event and evaluate notification delivery rules' })
  emitEvent(@Body() dto: EmitEventDto): { eventId: string; notificationId?: string } {
    return this.notificationsService.emitEvent(dto);
  }
}
