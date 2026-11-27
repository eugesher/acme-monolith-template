import { Module, type INestApplicationContext } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { AuthAudienceEnum } from '@acme-libs/kernel';
import { CREDENTIALS_PORT, type ICredentialsPort } from '@acme-libs/contracts/credentials';

import { CredentialsModule } from '../credentials.module';

describe('CredentialsModule', () => {
  let app: INestApplicationContext;

  beforeEach(async () => {
    @Module({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [
            () => ({
              JWT_SECRET: 'access-secret-of-at-least-thirty-two-chars',
              JWT_EXPIRES_IN: '15m',
              AUTH_ARGON2_MEMORY_COST: 1024,
              AUTH_ARGON2_PARALLELISM: 1,
              AUTH_ARGON2_TIME_COST: 2,
              AUTH_ARGON2_MAX_CONCURRENCY: 1,
              AUTH_ARGON2_QUEUE_TIMEOUT_MS: 1000,
            }),
          ],
        }),
        CredentialsModule.forRoot(AuthAudienceEnum.STAFF),
      ],
    })
    class TestModule {}

    app = await NestFactory.createApplicationContext(TestModule, { logger: false });
  });

  afterEach(async () => {
    await app.close();
  });

  it('signs an HS256 access token for the audience with JWT_SECRET that expires after JWT_EXPIRES_IN', async () => {
    const credentials = app.get<ICredentialsPort>(CREDENTIALS_PORT);

    const token = await credentials.signAccessToken({ sub: 'user-1' });

    const claims = await new JwtService({
      secret: 'access-secret-of-at-least-thirty-two-chars',
    }).verifyAsync<{ sub: string; aud: string; iat: number; exp: number }>(token, {
      algorithms: ['HS256'],
    });

    expect({ sub: claims.sub, aud: claims.aud, lifetime: claims.exp - claims.iat }).toEqual({
      sub: 'user-1',
      aud: 'staff',
      lifetime: 900,
    });
  });

  it('verifies an access token it signed and answers its subject', async () => {
    const credentials = app.get<ICredentialsPort>(CREDENTIALS_PORT);
    const token = await credentials.signAccessToken({ sub: 'user-1' });

    const claims = await credentials.verifyAccessToken(token);

    expect(claims).toEqual({ sub: 'user-1' });
  });

  it.each([
    ['another secret', 'another-secret-of-at-least-thirty-two', { audience: 'staff' }],
    ['another audience', 'access-secret-of-at-least-thirty-two-chars', { audience: 'customer' }],
    ['no audience', 'access-secret-of-at-least-thirty-two-chars', {}],
    [
      'HS512',
      'access-secret-of-at-least-thirty-two-chars',
      { audience: 'staff', algorithm: 'HS512' as const },
    ],
  ])('answers no subject for a token signed with %s', async (_case, secret, options) => {
    const credentials = app.get<ICredentialsPort>(CREDENTIALS_PORT);
    const token = await new JwtService({ secret }).signAsync({ sub: 'user-1' }, options);

    const claims = await credentials.verifyAccessToken(token);

    expect(claims).toBeNull();
  });

  it('hashes passwords with the costs of AUTH_ARGON2_*', async () => {
    const credentials = app.get<ICredentialsPort>(CREDENTIALS_PORT);

    const passwordHash = await credentials.hashPassword('correct-horse-battery');

    expect(passwordHash).toMatch(/^\$argon2id\$v=19\$m=1024,t=2,p=1\$/);
  });

  it('verifies a password against the hash it produced', async () => {
    const credentials = app.get<ICredentialsPort>(CREDENTIALS_PORT);
    const passwordHash = await credentials.hashPassword('correct-horse-battery');

    const valid = await credentials.verifyPassword({
      passwordHash,
      password: 'correct-horse-battery',
    });

    expect(valid).toBe(true);
  });
});
