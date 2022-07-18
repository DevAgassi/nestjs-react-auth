import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { UniqueConstraint } from './decorators/unique.email.decorator.validate';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UniqueConstraint],
  exports: [UserService],
})
export class UserModule {}
