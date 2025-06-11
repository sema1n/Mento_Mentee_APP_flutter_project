import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TokenExtractionService } from '../auth/token.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    private tokenService: TokenExtractionService,
  ) {}

  async createTask(dto: CreateTaskDto, token: string): Promise<Task> {
    const mentorId = this.tokenService.extractUserId(token);

    const task = new this.taskModel({
      taskTitle: dto.taskTitle,
      description: dto.description,
      dueDate: dto.dueDate,
      priority: dto.priority,
      menteeId: new Types.ObjectId(dto.menteeId),
      mentorId: new Types.ObjectId(mentorId),
    });

    return await task.save();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async getAssignedTasks(token: string): Promise<Task[]> {
    const userId = this.tokenService.extractUserId(token);
    const mentorObjectId = new Types.ObjectId(userId);

    return await this.taskModel.find({ mentorId: mentorObjectId }).exec();
  }

  async update(id: string, dto: Partial<UpdateTaskDto>): Promise<Task> {
    const updated = await this.taskModel
      .findByIdAndUpdate(id, dto, {
        new: true,
      })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.taskModel.deleteOne({ _id: id }).exec();
    return { deleted: result.deletedCount > 0 };
  }

  async changeTaskCompletionStatus(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }

    task.isCompleted = !task.isCompleted;
    return task.save(); // Saves and returns the updated task
  }

  async fetchTasks(token: string) : Promise<Task[]> {
    const userId = this.tokenService.extractUserId(token);
    const menteeObjectId = new Types.ObjectId(userId);

    return await this.taskModel.find({ menteeId: menteeObjectId }).exec();
  }

  // async getAssignedTasks(token: string): Promise<Task[]> {
  //   const userId = this.tokenService.extractUserId(token);
  //   const mentorObjectId = new Types.ObjectId(userId);

  //   return await this.taskModel.find({ mentorId: mentorObjectId }).exec();
  // }
}
