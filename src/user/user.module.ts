import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { UniqueEmailConstraint } from './decorators/unique.email.decorator.validate';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UniqueEmailConstraint],
  exports: [UserService],
})
export class UserModule {}
