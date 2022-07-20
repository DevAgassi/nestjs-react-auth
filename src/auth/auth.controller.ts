import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessAuthUserDto } from './dto/access-auth-user.dto';
import { CreadAuthUserDto } from './dto/cred-auth-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(
    @Body() credentials: CreadAuthUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessAuthUserDto> {
    return this.authService.signin(credentials, response);
  }
}
