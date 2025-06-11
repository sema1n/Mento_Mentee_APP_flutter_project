import { Prop } from '@nestjs/mongoose';
import { IsString, IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  taskTitle: string;

  @Prop({ default: 'pending' })
  status: string;

  @IsNotEmpty()
  description: string;

  @IsDateString()
  dueDate: string;

  @IsString()
  @IsNotEmpty()
  priority: string;

  @IsString()
  menteeId: string;
}
