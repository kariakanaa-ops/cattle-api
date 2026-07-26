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

import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateTaskDto,
  ) {
    return this.taskService.create(dto);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get('today')
  today() {
    return this.taskService.today();
  }

  @Get('upcoming')
  upcoming() {
    return this.taskService.upcoming();
  }

  @Get('overdue')
  overdue() {
    return this.taskService.overdue();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, dto);
  }

  @Patch(':id/complete')
  complete(
    @Param('id') id: string,
  ) {
    return this.taskService.complete(id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.taskService.remove(id);
  }
}