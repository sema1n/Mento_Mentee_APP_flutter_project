// src/mentorship-request/dto/update-status.dto.ts
import { IsEnum } from 'class-validator';
import { Status } from '../enums/status.enum';

export class UpdateStatusDto {
  @IsEnum(Status, { message: 'Status must be Pending, Accepted, or Rejected' })
  status: Status;
}
