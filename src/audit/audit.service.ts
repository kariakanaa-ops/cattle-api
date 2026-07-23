import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { AuditAction } from '@prisma/client';

import { CreateAuditDto } from './dto/create-audit.dto';

@Injectable()
export class AuditService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async log(dto: CreateAuditDto) {

    return this.prisma.auditTrail.create({

      data: {

        userId: dto.userId,

        entity: dto.entity,

        entityId: dto.entityId,

        action: dto.action as AuditAction,

        oldValues: dto.oldValues
          ? JSON.stringify(dto.oldValues)
          : null,

        newValues: dto.newValues
          ? JSON.stringify(dto.newValues)
          : null,

        ipAddress: dto.ipAddress,

        description: dto.description,

      },

    });

  }

  findAll() {

    return this.prisma.auditTrail.findMany({

      include: {

        user: true,

      },

      orderBy: {

        createdAt: 'desc',

      },

    });

  }

  findOne(id: string) {

    return this.prisma.auditTrail.findUnique({

      where: { id },

      include: {

        user: true,

      },

    });

  }

}