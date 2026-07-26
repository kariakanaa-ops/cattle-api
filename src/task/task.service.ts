import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';

import {
  AuditAction,
  NotificationStatus,
  NotificationType,
  TaskStatus,
} from '@prisma/client';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateTaskDto) {
    if (dto.cattleId) {
      const cattle = await this.prisma.cattle.findUnique({
        where: {
          id: dto.cattleId,
        },
      });

      if (!cattle) {
        throw new NotFoundException('Cattle not found');
      }
    }

    if (dto.groupId) {
      const group = await this.prisma.cattleGroup.findUnique({
        where: {
          id: dto.groupId,
        },
      });

      if (!group) {
        throw new NotFoundException('Cattle group not found');
      }
    }

    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        priority: dto.priority,
        status: dto.status ?? TaskStatus.Pending,
        dueDate: new Date(dto.dueDate),
        assignedTo: dto.assignedTo,
        createdBy: dto.createdBy,
        cattleId: dto.cattleId,
        groupId: dto.groupId,
        notes: dto.notes,
      },
      include: {
        cattle: true,
        group: true,
      },
    });

    await this.notificationsService.create({
      title: 'Task Assigned',
      message: `Task "${task.title}" has been created.`,
      type: NotificationType.Info,
      status: NotificationStatus.Unread,
      entityType: 'Task',
      entityId: task.id,
      userId: task.assignedTo ?? undefined,
    });

    await this.auditService.log({
      userId: task.createdBy ?? undefined,
      entity: 'Task',
      entityId: task.id,
      action: AuditAction.CREATE,
      oldValues: null,
      newValues: task,
      description: 'Task created',
    });

    return task;
  }

  async findAll() {
    return this.prisma.task.findMany({
      include: {
        cattle: true,
        group: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
      include: {
        cattle: true,
        group: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(
    id: string,
    dto: UpdateTaskDto,
  ) {
    await this.findOne(id);

    const updated = await this.prisma.task.update({
      where: {
        id,
      },
      data: {
        ...dto,
        ...(dto.dueDate && {
          dueDate: new Date(dto.dueDate),
        }),
      },
    });

    await this.auditService.log({
      entity: 'Task',
      entityId: id,
      action: AuditAction.UPDATE,
      newValues: dto,
      description: 'Task updated',
    });

    return updated;
  }

  async complete(id: string) {
    await this.findOne(id);

    const task = await this.prisma.task.update({
      where: {
        id,
      },
      data: {
        status: TaskStatus.Completed,
        completedAt: new Date(),
      },
    });

    await this.auditService.log({
      entity: 'Task',
      entityId: id,
      action: AuditAction.UPDATE,
      description: 'Task completed',
    });

    return task;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.auditService.log({
      entity: 'Task',
      entityId: id,
      action: AuditAction.DELETE,
      description: 'Task deleted',
    });

    return this.prisma.task.delete({
      where: {
        id,
      },
    });
  }

  async today() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return this.prisma.task.findMany({
      where: {
        dueDate: {
          gte: start,
          lt: end,
        },
      },
      orderBy: {
        priority: 'desc',
      },
    });
  }

  async upcoming() {
    return this.prisma.task.findMany({
      where: {
        dueDate: {
          gt: new Date(),
        },
        status: {
          not: TaskStatus.Completed,
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async overdue() {
    await this.prisma.task.updateMany({
      where: {
        dueDate: {
          lt: new Date(),
        },
        status: {
          not: TaskStatus.Completed,
        },
      },
      data: {
        status: TaskStatus.Overdue,
      },
    });

    return this.prisma.task.findMany({
      where: {
        status: TaskStatus.Overdue,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }
}