// mentor.module.ts
import { Module } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { MentorController } from './mentor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../auth/schema/user.schema'; // Use shared schema

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Use User, not Mentor
  ],
  controllers: [MentorController],
  providers: [MentorService],
})
export class MentorModule {}
