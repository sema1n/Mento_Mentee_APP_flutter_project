import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  MentorshipRequest,
  MentorshipRequestDocument,
} from './schemas/mentorship-request.schema';
import { CreateMentorshipRequestDto } from './dto/mentorship-request.dto';
import { Status } from './enums/status.enum';
import { TokenExtractionService } from '../auth/token.service';
import { request } from 'http';

@Injectable()
export class MentorshipRequestService {
  constructor(
    @InjectModel(MentorshipRequest.name)
    private readonly mentorshipRequestModel: Model<MentorshipRequestDocument>,
    private tokenService: TokenExtractionService,
  ) {}

  async setRequestStatus(
    id: string,
    status: Status,
  ): Promise<MentorshipRequest> {
    const updatedRequest = await this.mentorshipRequestModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }, // returns the updated document
    );

    if (!updatedRequest) {
      throw new NotFoundException(`Mentorship request with ID ${id} not found`);
    }

    return updatedRequest;
  }

  async createMentorshipRequest(
    dto: CreateMentorshipRequestDto,
    token: string,
  ): Promise<MentorshipRequest> {
    const menteeId = this.tokenService.extractUserId(token);
    const request = {
      ...dto,
      status: Status.PENDING,
      mentorId: new Types.ObjectId(dto.mentorId),
      menteeId: new Types.ObjectId(menteeId),
    };
    const newRequest = new this.mentorshipRequestModel(request);
    return await newRequest.save();
  }

  async getAllRequests(token: string): Promise<MentorshipRequest[]> {
    const userId = this.tokenService.extractUserId(token);
    const menteeObjectId = new Types.ObjectId(userId);
    return await this.mentorshipRequestModel
      .find({ menteeId: menteeObjectId })
      .exec();
  }

  async getAllRequestsSendByMentees(token: string): Promise<MentorshipRequest[]> {
    const userId = this.tokenService.extractUserId(token);
    const mentorObjectId = new Types.ObjectId(userId);
    const mentees = await this.mentorshipRequestModel
      .find({ mentorId: mentorObjectId })
      .exec();
    
    return mentees
}

  async getRequestById(id: string): Promise<MentorshipRequest | null> {
    return await this.mentorshipRequestModel.findById(id).exec();
  }

  async deleteRequest(id: string): Promise<{ deleted: boolean }> {
    const result = await this.mentorshipRequestModel
      .deleteOne({ _id: id })
      .exec();
    return { deleted: result.deletedCount > 0 };
  }

  async updateRequest(
    id: string,
    dto: Partial<CreateMentorshipRequestDto>,
  ): Promise<MentorshipRequest | null> {
    return await this.mentorshipRequestModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }

}
