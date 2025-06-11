import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { TaskService } from './tasks.service';
import { TaskController } from './tasks.controller';
import { TokenExtractionService } from '../auth/token.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    AuthModule
  ],
  providers: [TaskService, TokenExtractionService],
  controllers: [TaskController],
})
export class TasksModule {}
