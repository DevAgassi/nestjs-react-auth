import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class VerifyTokenDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export default VerifyTokenDto;
