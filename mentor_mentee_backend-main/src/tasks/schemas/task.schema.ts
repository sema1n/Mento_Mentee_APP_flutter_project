import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  taskTitle: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ required: true })
  priority: string;

  @Prop({ required: true })
  mentorId: Types.ObjectId;

  @Prop({ required: true })
  menteeId: Types.ObjectId;

  @Prop({ default: false })
  isCompleted : boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
