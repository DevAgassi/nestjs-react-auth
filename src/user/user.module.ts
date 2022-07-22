import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module, forwardRef } from '@nestjs/common';
import { UniqueEmailConstraint } from './decorators/unique.email.decorator.validate';
import { VerifyEmailModule } from 'src/verifyEmail/verifyEmail.module';
@Module({
  imports: [forwardRef(() => VerifyEmailModule)],
  controllers: [UserController],
  providers: [UserService, UniqueEmailConstraint],
  exports: [UserService],
})
export class UserModule {}
