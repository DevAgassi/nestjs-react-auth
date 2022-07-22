import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import VerifyEmailDto from './dto/verify-email.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import RequestWithUser from 'src/types/requestWithUser.interface';
import { VerifyEmailService } from './verifyEmailService';

@Controller('verify-email')
export class VerifyEmailController {
  constructor(private readonly verifyEmailService: VerifyEmailService) {}

  @Post('confirm')
  async confirm(@Body() verifyData: VerifyEmailDto) {
    const email = await this.verifyEmailService.decodeConfirmationToken(
      verifyData.token,
    );
    await this.verifyEmailService.confirmEmail(email);
  }

  @Post('resend-confirmation')
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(@Req() request: RequestWithUser) {
    await this.verifyEmailService.resendConfirmationLink(request.user.uuid);
  }
}
