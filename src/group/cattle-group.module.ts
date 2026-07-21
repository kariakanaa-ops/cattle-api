import { Module } from '@nestjs/common';
import { CattleGroupController } from './cattle-group.controller';
import { CattleGroupService } from './cattle-group.service';

@Module({
  controllers: [CattleGroupController],
  providers: [CattleGroupService],
})
export class CattleGroupModule {}