import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateNotificationDto,
  ) {
    return this.notificationsService.create(dto);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get('unread')
  unread() {
    return this.notificationsService.unread();
  }

  @Patch(':id/read')
  markAsRead(
    @Param('id') id: string,
  ) {
    return this.notificationsService.markAsRead(id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.notificationsService.remove(id);
  }
}