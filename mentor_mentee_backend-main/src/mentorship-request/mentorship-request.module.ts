import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MentorshipRequest,
  MentorshipRequestSchema,
} from './schemas/mentorship-request.schema';
import { MentorshipRequestService } from './mentorship-request.service';
import { MentorshipRequestController } from './mentorship-request.controller';
import { TokenExtractionService } from 'src/auth/token.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MentorshipRequest.name, schema: MentorshipRequestSchema },
    ]),
    AuthModule,
  ],
  controllers: [MentorshipRequestController],
  providers: [MentorshipRequestService, TokenExtractionService],
})
export class MentorshipRequestModule {}
