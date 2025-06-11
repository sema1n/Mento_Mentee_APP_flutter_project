import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Headers,
  Patch,
} from '@nestjs/common';
import { MentorshipRequestService } from './mentorship-request.service';
import { CreateMentorshipRequestDto } from './dto/mentorship-request.dto';
import { MentorshipRequest } from './schemas/mentorship-request.schema';
import { PublicRoute } from 'src/auth/decorators/public.decorators';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { Status } from './enums/status.enum';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('mentorship-requests')
export class MentorshipRequestController {
  constructor(
    private readonly mentorshipRequestService: MentorshipRequestService,
  ) {}

  @Post()
  @Roles(Role.MENTEE)
  async create(@Body() dto: CreateMentorshipRequestDto, @Headers('authorization') authHeader:string): Promise<MentorshipRequest> {
    const token = authHeader.replace('Bearer ', '');
    return this.mentorshipRequestService.createMentorshipRequest(dto, token);
  }

  @Get()
  @Roles(Role.MENTEE)
  async findAll(@Headers('authorization') authHeader:string): Promise<MentorshipRequest[]> {
    const token = authHeader.replace('Bearer ', '');
    return this.mentorshipRequestService.getAllRequests(token);
  }

  
  @Get('/mentors/sent')
  @Roles(Role.MENTOR)
  async findAllMentees(@Headers('authorization') authHeader:string): Promise<MentorshipRequest[]> {
    const token = authHeader.replace('Bearer ', '');
    return this.mentorshipRequestService.getAllRequestsSendByMentees(token);
  }
  

  @Get('/:id')
  @Roles(Role.MENTEE)
  async findOne(@Param('id') id: string): Promise<MentorshipRequest | null> {
    return this.mentorshipRequestService.getRequestById(id);
  }

  @Patch('/:id')
  @Roles(Role.MENTEE)
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateMentorshipRequestDto>,
  ): Promise<MentorshipRequest | null> {
    return this.mentorshipRequestService.updateRequest(id, dto);
  }

  @Delete('/:id')
  @Roles(Role.MENTEE)
  async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.mentorshipRequestService.deleteRequest(id);
  }

  @Patch('/status/change/:id')
  @Roles(Role.MENTOR)
  async setRequestStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    const { status } = updateStatusDto;
    return this.mentorshipRequestService.setRequestStatus(id, status);
  }

}
