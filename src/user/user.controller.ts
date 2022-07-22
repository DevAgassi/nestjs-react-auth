import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { Role } from 'src/types/role.enum';
import { VerifyEmailService } from 'src/verifyEmail/verifyEmailService';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PublicUser } from './models/public.user';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly verifyEmailService: VerifyEmailService,
    private readonly userService: UserService,
  ) {}

  @Get()
  findAll(): Promise<PublicUser[]> {
    return this.userService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string): Promise<PublicUser> {
    return this.userService.findByUUIDPublic(uuid);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<PublicUser> {
    return await this.userService.findByEmailOrTrowPublic(email);
  }

  //@Auth(Role.ADMIN)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<PublicUser> {
    const user = await this.userService.create(createUserDto);
    await this.verifyEmailService.sendVerificationLink(user.email);

    return user;
  }

  @Auth(Role.ADMIN)
  @Put(':uuid')
  async Update(
    @Param('uuid') uuid: string,
    @Body() body: UpdateUserDto,
  ): Promise<PublicUser> {
    return this.userService.update(uuid, body);
  }

  @Auth(Role.ADMIN)
  @Delete(':uuid')
  async Delete(@Param('uuid') uuid: string): Promise<PublicUser> {
    return this.userService.delete(uuid);
  }
}
