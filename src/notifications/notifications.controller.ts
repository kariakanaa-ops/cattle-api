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

import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {

  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateNotificationDto,
  ) {
    return this.notificationService.create(dto);
  }

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Get('unread')
  unread() {
    return this.notificationService.unread();
  }

  @Patch(':id/read')
  markRead(
    @Param('id') id: string,
  ) {
    return this.notificationService.markAsRead(id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.notificationService.remove(id);
  }
}