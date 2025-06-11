import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { PublicRoute } from './decorators/public.decorators';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @PublicRoute()
  @Post('/signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @PublicRoute()
  @Post('/login')
  login(@Body() dto: LoginDto){
    return this.authService.login(dto);
  }

  //TODO Password change
}