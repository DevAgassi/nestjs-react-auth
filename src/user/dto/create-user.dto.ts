import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../types/role.enum';
import { Match } from 'src/decorators/match.decorator.validate';
import { UniqueEmail } from '../decorators/unique.email.decorator.validate';
import { Exclude } from 'class-transformer';

export class CreateUserDto {
  // Gets only validated if it's part of the request's body
  @IsNotEmpty()
  @IsEmail()
  @UniqueEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  @Match('password')
  passwordConfirm: string;

  @IsEnum(Role)
  @ApiProperty({
    description: `A list of user's roles`,
    example: ['USER'],
    enum: Role,
    default: [],
    isArray: true,
  })
  roles: Role;
  /*
  @Exclude()
  @IsString()
  refreshToken?: string;

  @Exclude()
  @IsBoolean()
  isRegisteredWithGoogle?: boolean;

  @IsBoolean()
  @Exclude()
  isEmailConfirmed: boolean;*/
}
