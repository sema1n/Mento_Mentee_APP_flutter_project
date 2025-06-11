// mentor.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schema/user.schema'; // Use shared User schema

@Injectable()
export class MentorService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAllMentors(): Promise<User[]> {
    return this.userModel.find({ role: { $regex: /^mentor$/i } }).exec(); // Case-insensitive match
  }
}
