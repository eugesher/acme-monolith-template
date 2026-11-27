import { Controller, Get, Global, Module, type INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AUTH_USER_VALIDATOR_PORT, type IAuthCurrentUserView } from '@acme-libs/contracts/auth';
import type { Maybe } from '@acme-libs/toolkit';

import { CurrentUser } from '../../decorators/auth-current-user.decorator';
import { Public } from '../../decorators/auth-public.decorator';
import { AuthJwtModule } from '../auth-jwt.module';

describe('AuthJwtModule', () => {
  let app: INestApplication;
  let url: string;

  beforeEach(async () => {
    @Controller()
    class ProbeController {
      @Public()
      @Get('open')
      public open(): string {
        return 'open';
      }

      @Get('me')
      public me(@CurrentUser() user: Maybe<IAuthCurrentUserView>): Maybe<IAuthCurrentUserView> {
        return user;
      }
    }

    @Global()
    @Module({
      exports: [AUTH_USER_VALIDATOR_PORT],
      providers: [
        {
          provide: AUTH_USER_VALIDATOR_PORT,
          useValue: {
            validateSubject: (command: { token: string }) => {
              const users: Record<string, IAuthCurrentUserView> = {
                'ann-token': { id: 'ann', email: 'ann@example.com' },
              };

              return Promise.resolve(users[command.token] ?? null);
            },
          },
        },
      ],
    })
    class ValidatorModule {}

    @Module({
      imports: [ValidatorModule, AuthJwtModule],
      controllers: [ProbeController],
    })
    class TestModule {}

    app = await NestFactory.create(TestModule, { logger: false });
    await app.listen(0, '127.0.0.1');
    url = await app.getUrl();
  });

  afterEach(async () => {
    await app.close();
  });

  it('opens a public route without a token', async () => {
    const response = await fetch(`${url}/open`);

    expect(response.status).toBe(200);
  });

  it('closes every other route without a token with 401', async () => {
    const response = await fetch(`${url}/me`);

    expect(response.status).toBe(401);
  });

  it('answers 401 for a token the validator answers no user for', async () => {
    const response = await fetch(`${url}/me`, { headers: { authorization: 'Bearer eve-token' } });

    expect(response.status).toBe(401);
  });

  it('hands the user the validator answers for the token to @CurrentUser()', async () => {
    const response = await fetch(`${url}/me`, { headers: { authorization: 'Bearer ann-token' } });
    const body: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ id: 'ann', email: 'ann@example.com' });
  });
});
