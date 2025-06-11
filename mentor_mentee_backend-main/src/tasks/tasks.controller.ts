import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Headers,
  Put,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './tasks.service';
import { Role } from 'src/auth/roles/role.enum';
import { Task } from './schemas/task.schema';

@UseGuards(JwtAuthGuard, RolesGuard) // ✅ Apply globally to all routes
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Roles(Role.MENTOR)
  @Post()
  async createTask(
    @Headers('authorization') authHeader: string, // still extracting token here
    @Body() dto: CreateTaskDto,
  ) {
    const token = authHeader.replace('Bearer ', '');
    return await this.taskService.createTask(dto, token);
  }

  @Roles(Role.MENTOR)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.taskService.findOne(id);
  }

  @Roles(Role.MENTOR)
  @Get()
  async getAssignedTasks(@Headers('authorization') authHeader: string) {
    const token = authHeader.replace('Bearer ', '');
    return await this.taskService.getAssignedTasks(token);
  }

  @Roles(Role.MENTOR)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<UpdateTaskDto>) {
    return await this.taskService.update(id, dto);
  }

  @Roles(Role.MENTOR)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.taskService.remove(id);
  }

  @Roles(Role.MENTEE)
  @Patch('/:id/status')
  async changeTaskCompletionStatus(@Param('id') id: string): Promise<Task> {
    return await this.taskService.changeTaskCompletionStatus(id);
  }

  @Roles(Role.MENTEE)
  @Get('/mentee/assigned')
  async fetchTasks(
    @Headers('authorization') authHeader: string,
  ): Promise<Task[]> {
    console.log('here');
    const token = authHeader.replace('Bearer ', '');
    return await this.taskService.fetchTasks(token);
  }
}