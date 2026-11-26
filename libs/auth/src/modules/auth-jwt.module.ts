import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthJwtGuard } from '../guards/auth-jwt.guard';

@Module({
  providers: [{ provide: APP_GUARD, useClass: AuthJwtGuard }],
})
export class AuthJwtModule {}
