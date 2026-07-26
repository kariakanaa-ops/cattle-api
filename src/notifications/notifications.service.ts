import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import {
  NotificationStatus,
} from '@prisma/client';

import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.notification.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const notification =
      await this.prisma.notification.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });

    if (!notification) {
      throw new NotFoundException(
        'Notification not found',
      );
    }

    return notification;
  }

  async unread() {
    return this.prisma.notification.findMany({
      where: {
        status: NotificationStatus.Unread,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead(id: string) {
    const notification =
      await this.prisma.notification.findUnique({
        where: { id },
      });

    if (!notification) {
      throw new NotFoundException(
        'Notification not found',
      );
    }

    return this.prisma.notification.update({
      where: {
        id,
      },
      data: {
        status: NotificationStatus.Read,
        readAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    const notification =
      await this.prisma.notification.findUnique({
        where: {
          id,
        },
      });

    if (!notification) {
      throw new NotFoundException(
        'Notification not found',
      );
    }

    return this.prisma.notification.delete({
      where: {
        id,
      },
    });
  }
}