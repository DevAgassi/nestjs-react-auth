import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../types/role.enum';

export class PublicUser {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  uuid: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(Role)
  @ApiProperty({
    description: `A list of user's roles`,
    example: ['USER'],
    enum: Role,
    default: [],
    isArray: true,
  })
  roles: Role;
}
