import {
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessAuthUserDto } from './dto/access-auth-user.dto';
import { CreadAuthUserDto } from './dto/cred-auth-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import RequestWithUser from 'src/types/requestWithUser.interface';
import { ApiBody } from '@nestjs/swagger';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { VerifyEmailGuard } from 'src/verifyEmail/guards/verifyEmail.guard';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard, VerifyEmailGuard)
  @Post('signin')
  @ApiBody({ type: CreadAuthUserDto })
  async signin(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessAuthUserDto> {
    const { user } = request;

    const payload = await this.authService.getCookieWithJwtAccessToken(user);

    response.cookie('token', payload.access_token, {
      maxAge: +ms(this.configService.get('EXPIRES_IN')),
      httpOnly: true,
      domain: this.configService.get<string>('FRONTEND_DOMAIN'),
    });

    await this.userService.setCurrentRefreshToken(
      payload.refresh_token,
      user.uuid,
    );

    response.cookie('refresh_token', payload.refresh_token, {
      maxAge: +ms(this.configService.get('REFRESH_EXPIRES_IN')),
      httpOnly: true,
      domain: this.configService.get<string>('FRONTEND_DOMAIN'),
    });

    return payload;
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.userService.removeRefreshToken(request.user);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Pick<AccessAuthUserDto, 'access_token' | 'expiresIn'>> {
    const { access_token, expiresIn } =
      await this.authService.getCookieWithJwtAccessToken(request.user);

    response.cookie('token', access_token, {
      maxAge: +ms(this.configService.get('EXPIRES_IN')),
      httpOnly: true,
      domain: this.configService.get<string>('FRONTEND_DOMAIN'),
    });

    return { access_token, expiresIn };
  }
}
