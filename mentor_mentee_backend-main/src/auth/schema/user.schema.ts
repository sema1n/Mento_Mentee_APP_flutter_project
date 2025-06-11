import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../roles/role.enum';
import { Skill } from '../skills/skills.enums';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({
    type: String,
    required: true,
    enum: Role,
  })
  role: Role;

  @Prop({
    type: String,
    required: true,
    enum: Skill,
  })
  skill: Skill;
}

export const UserSchema = SchemaFactory.createForClass(User);