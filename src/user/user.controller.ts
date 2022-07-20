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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PublicUser } from './models/public.user';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<PublicUser[]> {
    return this.userService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string): Promise<PublicUser> {
    return this.userService.findByUUID(uuid);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<PublicUser> {
    const user = await this.userService.findByEmailOrTrow(email);
    return this.userService.serialize(user);
  }

  @Auth(Role.ADMIN)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<PublicUser> {
    return await this.userService.create(createUserDto);
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
