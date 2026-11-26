import { HttpStatus } from '@nestjs/common';

import { ErrorResponseDto } from '../../error.response.dto';
import { ApiErrorResponses } from '../api-error-responses.decorator';

describe('ApiErrorResponses', () => {
  it('documents one error response per status of the given codes', () => {
    class ItemController {
      @ApiErrorResponses({
        filterStatus: {
          ITEM_NOT_FOUND: HttpStatus.NOT_FOUND,
          ITEM_ARCHIVED: HttpStatus.CONFLICT,
          ITEM_NAME_TAKEN: HttpStatus.CONFLICT,
        },
        codes: ['ITEM_NAME_TAKEN', 'ITEM_NOT_FOUND', 'ITEM_ARCHIVED'],
      })
      public handleRename(this: void): string {
        return 'renamed';
      }
    }

    const responses: unknown = Reflect.getMetadata(
      'swagger/apiResponse',
      ItemController.prototype.handleRename,
    );

    expect(responses).toEqual({
      404: { type: ErrorResponseDto, isArray: false, description: 'ITEM_NOT_FOUND' },
      409: {
        type: ErrorResponseDto,
        isArray: false,
        description: 'ITEM_NAME_TAKEN, ITEM_ARCHIVED',
      },
    });
  });

  it('names VALIDATION_FAILED first among the codes of 400', () => {
    class ItemController {
      @ApiErrorResponses({
        filterStatus: { ITEM_NAME_INVALID: HttpStatus.BAD_REQUEST },
        codes: ['ITEM_NAME_INVALID'],
      })
      public handleCreate(this: void): string {
        return 'created';
      }
    }

    const responses: unknown = Reflect.getMetadata(
      'swagger/apiResponse',
      ItemController.prototype.handleCreate,
    );

    expect(responses).toEqual({
      400: {
        type: ErrorResponseDto,
        isArray: false,
        description: 'VALIDATION_FAILED, ITEM_NAME_INVALID',
      },
    });
  });
});
