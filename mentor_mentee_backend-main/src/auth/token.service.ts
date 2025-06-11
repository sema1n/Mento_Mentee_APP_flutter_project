import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenExtractionService {
  constructor(private readonly jwtService: JwtService) {}

  extractEmail(token: string): string {
    try {
      const decoded = this.jwtService.decode(token) as { email: string };
      if (!decoded || !decoded.email) {
        throw new UnauthorizedException('Email not found in token');
      }
      return decoded.email;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  extractUserId(token: string): string {
    try {
      const decoded = this.jwtService.decode(token) as { userId: string };
      if (!decoded || !decoded.userId) {
        throw new UnauthorizedException('User ID not found in token');
      }
      return decoded.userId;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
