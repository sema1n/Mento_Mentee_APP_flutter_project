// mentee/mentee.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schema/user.schema';

@Injectable()
export class MenteeService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAllMentees(): Promise<User[]> {
    return this.userModel.find({ role: 'mentee' }).exec();
  }
}
