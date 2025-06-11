import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  getToken(userEmail: string, userRole: string, userId : string): string {
    return this.jwtService.sign({
      email: userEmail,
      role: userRole,
      userId : userId
    });
  }

  async signup(dto: SignupDto): Promise<{ token: string }> {
    const { email, password, role, name, skill } = dto;
    var usedBefore = await this.userModel.findOne({ email });

    if (usedBefore) {
      throw new BadRequestException('Duplicate email.');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userModel.create({
        email,
        password: hashedPassword,
        role,
        name,
        skill
      });
      return { token: this.getToken(email, role, user._id.toString()) };
    } catch (error) {
      console.log(error);
    }
  }
  async login(dto: LoginDto): Promise<{ token: string }> {
    const { email, password, role } = dto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.role != role) {
      throw new UnauthorizedException(
        'Wrong Role. Role not matched correctly.',
      );
    }

    const token = this.getToken(email, role, user._id.toString());
    return { token: token };
  }
}
