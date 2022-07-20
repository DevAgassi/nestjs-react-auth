import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { Auth } from './decorators/auth.decorator';
import { Role } from './types/role.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Auth(Role.ADMIN)
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Get('login')
  getHelloByLogin(): string {
    return this.appService.getHello();
  }
}
