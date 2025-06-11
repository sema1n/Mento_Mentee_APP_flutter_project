// mentor.controller.ts
import { Controller, Get } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { Role } from 'src/auth/roles/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('mentors')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

 @Roles(Role.MENTEE)
  @Get()
  getAllMentors() {
    return this.mentorService.findAllMentors();
  }
}
