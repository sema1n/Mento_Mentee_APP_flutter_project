// mentor.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MentorDocument = Mentor & Document;

@Schema()
export class Mentor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default:'mentor'})
  role: string;
}

export const MentorSchema = SchemaFactory.createForClass(Mentor);
