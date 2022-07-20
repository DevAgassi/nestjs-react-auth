import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Role } from 'src/types/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { ROLES_KEY } from './roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
