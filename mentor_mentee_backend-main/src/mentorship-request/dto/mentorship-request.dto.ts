import { IsEnum } from "class-validator";
import { Status } from "../enums/status.enum";

export class CreateMentorshipRequestDto {
  startDate: Date;
  endDate: Date;
  mentorshipTopic: string; // corresponds to "what do you need to be mentored in"
  additionalNotes: string;
  mentorId: string;
}
