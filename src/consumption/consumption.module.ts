import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConsumptionController } from './consumption.controller';
import { ConsumptionService } from './consumption.service';

@Module({
  imports: [PrismaModule],
  controllers: [ConsumptionController],
  providers: [ConsumptionService],
})
export class ConsumptionModule {}