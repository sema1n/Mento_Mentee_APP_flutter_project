import { Prop } from '@nestjs/mongoose';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CompleteTaskDto {
  @IsBoolean()
  @IsNotEmpty()
  isCompleted: boolean;
}
