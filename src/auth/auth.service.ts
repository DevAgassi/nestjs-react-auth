import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AccessAuthUserDto } from './dto/access-auth-user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  getCookiesForLogOut(): readonly string[] {
    return [
      'token=; HttpOnly; Path=/; Max-Age=0',
      'refresh_token=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmailOrTrow(email);
    if (await this.comparePasswords(user.password, pass)) {
      delete user.password;
      return user;
    }

    return null;
  }

  private async comparePasswords(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(storedPasswordHash, password);
  }

  generateJwt(payload: object, options?: JwtSignOptions): string {
    return this.jwtService.sign(payload, options);
  }

  async refreshJwtToken(credentials: User): Promise<AccessAuthUserDto> {
    const user = await this.userService.findByEmailOrTrow(credentials.email);

    if (!(await this.comparePasswords(credentials.password, user.password))) {
      throw new BadRequestException('Wrong credentials provided');
    }

    return {
      access_token: 'token',
      refresh_token: '',
      expiresIn: this.configService.get<string>('EXPIRES_IN'),
    };
  }

  async getCookieWithJwtAccessToken(user: User): Promise<AccessAuthUserDto> {
    const token = this.getJwtAccessToken(user);

    const refresh_token = this.getCookieWithJwtRefreshToken(user.uuid);

    return {
      access_token: token,
      refresh_token,
      expiresIn: this.configService.get<string>('EXPIRES_IN'),
    };
  }

  public getJwtAccessToken(user: User): string {
    const jwt_token = this.generateJwt(
      {
        email: user.email,
        sub: user.uuid,
        roles: user.roles,
      },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get<string>('EXPIRES_IN'),
      },
    );

    return jwt_token;
  }

  getCookieWithJwtRefreshToken(uuid: string): string {
    const token = this.jwtService.sign(
      { uuid },
      {
        secret: this.configService.get('REFRESH_JWT_SECRET'),
        expiresIn: this.configService.get('REFRESH_EXPIRES_IN'),
      },
    );

    return token;
  }
}
