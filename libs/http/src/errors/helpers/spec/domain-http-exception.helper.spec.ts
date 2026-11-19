import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@acme-libs/domain';

import { DomainHttpExceptionHelper } from '../domain-http-exception.helper';

describe('DomainHttpExceptionHelper', () => {
  describe('toHttpException', () => {
    it('answers the status with the code, the message and the details of the refusal', () => {
      class ItemVersionMismatchException extends DomainException {
        public readonly code = 'VERSION_MISMATCH';

        constructor() {
          super('Item 7 changed', { currentVersion: 4 });
        }
      }

      const error = DomainHttpExceptionHelper.toHttpException(
        new ItemVersionMismatchException(),
        HttpStatus.CONFLICT,
      );

      expect(error.getStatus()).toBe(409);
      expect(error.getResponse()).toEqual({
        statusCode: 409,
        code: 'VERSION_MISMATCH',
        message: 'Item 7 changed',
        details: { currentVersion: 4 },
      });
    });
  });
});
