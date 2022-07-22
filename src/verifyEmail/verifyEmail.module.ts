import { Module, forwardRef } from '@nestjs/common';
import { VerifyEmailService } from './verifyEmailService';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from '../email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { VerifyEmailController } from './verifyEmail.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ConfigModule,
    EmailModule,
    JwtModule.register({}),
    forwardRef(() => UserModule),
  ],
  controllers: [VerifyEmailController],
  providers: [VerifyEmailService],
  exports: [VerifyEmailService],
})
export class VerifyEmailModule {}
