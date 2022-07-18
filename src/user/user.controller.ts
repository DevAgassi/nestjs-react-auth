import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string): Promise<User> {
    return this.userService.findById(uuid);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.findByEmailOrTrow(email);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Put(':uuid')
  async Update(
    @Param('uuid') uuid: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(uuid, body);
  }

  @Delete(':uuid')
  async Delete(@Param('uuid') uuid: string): Promise<User> {
    return this.userService.delete(uuid);
  }
}
