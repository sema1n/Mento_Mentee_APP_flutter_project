// mentee/mentee.controller.ts
import { Controller, Get } from '@nestjs/common';
import { MenteeService } from './mentee.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('mentees')
export class MenteeController {
  constructor(private readonly menteeService: MenteeService) {}

  @Roles(Role.MENTOR) 
  @Get()
  getAllMentees() {
    return this.menteeService.findAllMentees();
  }
}
