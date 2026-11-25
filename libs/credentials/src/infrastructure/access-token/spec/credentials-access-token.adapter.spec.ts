import { JwtService } from '@nestjs/jwt';

import { CredentialsAccessTokenAdapter } from '../credentials-access-token.adapter';

describe('CredentialsAccessTokenAdapter', () => {
  describe('sign', () => {
    it('signs the subject alone, even when the caller passes more', async () => {
      const jwtService = new JwtService({ secret: 'access-secret-of-at-least-thirty-two-chars' });
      const adapter = new CredentialsAccessTokenAdapter(jwtService);
      const payload = { sub: 'user-1', roles: ['admin'] };

      const token = await adapter.sign(payload);

      const claims = await jwtService.verifyAsync<Record<string, unknown>>(token);

      expect(claims).toEqual({ sub: 'user-1', iat: expect.any(Number) as number });
    });
  });

  describe('verify', () => {
    it('answers the subject alone of a token it verifies, even when the token carries more', async () => {
      const jwtService = new JwtService({ secret: 'access-secret-of-at-least-thirty-two-chars' });
      const adapter = new CredentialsAccessTokenAdapter(jwtService);
      const token = await jwtService.signAsync({ sub: 'user-1', email: 'forged@example.com' });

      const claims = await adapter.verify(token);

      expect(claims).toEqual({ sub: 'user-1' });
    });

    it('answers no subject for a token that does not verify', async () => {
      const adapter = new CredentialsAccessTokenAdapter(
        new JwtService({ secret: 'access-secret-of-at-least-thirty-two-chars' }),
      );
      const token = await new JwtService({
        secret: 'another-secret-of-at-least-thirty-two',
      }).signAsync({ sub: 'user-1' });

      const claims = await adapter.verify(token);

      expect(claims).toBeNull();
    });
  });
});
