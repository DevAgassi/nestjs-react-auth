import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AccessAuthUserDto } from './dto/access-auth-user.dto';
import { CreadAuthUserDto } from './dto/cred-auth-user.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailOrTrow(email);

    if (!(await bcrypt.compare(user.password, pass))) {
      delete user.password;
      return user;
    }
    return null;
  }

  public async signin(
    credentials: CreadAuthUserDto,
    response: Response,
  ): Promise<AccessAuthUserDto> {
    const user = await this.usersService.findByEmailOrTrow(credentials.email);

    if (!(await bcrypt.compare(credentials.password, user.password))) {
      throw new BadRequestException('Wrong credentials provided');
    }

    const jwt = this.jwtService.sign({
      email: user.email,
      sub: user.uuid,
      roles: user.roles,
    });

    response.cookie('token', jwt, {
      httpOnly: true,
      domain: this.configService.get<string>('FRONTEND_DOMAIN'),
    });

    return {
      access_token: jwt,
      expiresIn: this.configService.get<string>('EXPIRES_IN'),
    };
  }
}
