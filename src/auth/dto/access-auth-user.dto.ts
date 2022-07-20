import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccessAuthUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  access_token: string;

  @IsNotEmpty()
  @IsString()
  expiresIn: string;
}
