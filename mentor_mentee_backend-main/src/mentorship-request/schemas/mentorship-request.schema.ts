import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Status } from '../enums/status.enum';

export type MentorshipRequestDocument = MentorshipRequest & Document;

@Schema()
export class MentorshipRequest {
  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  mentorshipTopic: string;

  @Prop()
  additionalNotes: string;

  @Prop({ required: true })
  menteeId: Types.ObjectId;

  @Prop({ required: true })
  mentorId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: Status,
  })
  status: Status;
}

export const MentorshipRequestSchema =
  SchemaFactory.createForClass(MentorshipRequest);
