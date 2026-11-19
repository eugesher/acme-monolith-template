import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { IsEntityId } from '../is-entity-id.decorator';

describe('IsEntityId', () => {
  describe('a required id', () => {
    class ItemIdParamDto {
      @IsEntityId({ example: '12' })
      public itemId: string;
    }

    it.each([
      ['a one-digit id', '7'],
      ['an id of 20 digits', '18446744073709551615'],
    ])('accepts %s', (_case, itemId) => {
      const errors = validateSync(plainToInstance(ItemIdParamDto, { itemId }));

      expect(errors).toEqual([]);
    });

    it.each([
      ['zero', '0'],
      ['a leading zero', '012'],
      ['a number with a suffix', '1abc'],
      ['an id of 21 digits', '1'.repeat(21)],
      ['a missing id', undefined],
    ])('refuses %s', (_case, itemId) => {
      const errors = validateSync(plainToInstance(ItemIdParamDto, { itemId }));

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toEqual({ matches: 'itemId must be a positive integer' });
    });

    it('documents the id with its pattern and the default description', () => {
      const property: unknown = Reflect.getMetadata(
        'swagger/apiModelProperties',
        ItemIdParamDto.prototype,
        'itemId',
      );

      expect(property).toEqual({
        example: '12',
        description: 'A positive integer of up to 20 digits',
        type: String,
        isArray: false,
        pattern: '^[1-9]\\d{0,19}$',
      });
    });
  });

  describe('a list of ids', () => {
    class ItemTagsReplaceRequestDto {
      @IsEntityId({ example: ['300'], description: 'The ids of the tags', each: true })
      public tagIds: string[];
    }

    it('refuses a list with an id that is not a positive integer', () => {
      const errors = validateSync(
        plainToInstance(ItemTagsReplaceRequestDto, { tagIds: ['300', 'fragile'] }),
      );

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toEqual({
        matches: 'each value in tagIds must be a positive integer',
      });
    });

    it('documents the list with its description', () => {
      const property: unknown = Reflect.getMetadata(
        'swagger/apiModelProperties',
        ItemTagsReplaceRequestDto.prototype,
        'tagIds',
      );

      expect(property).toMatchObject({ description: 'The ids of the tags', isArray: true });
    });
  });

  describe('an optional id', () => {
    class ItemGetManyQueryDto {
      @IsEntityId({ example: '300', description: 'Only the items with this tag', optional: true })
      public tagId?: string;
    }

    it('accepts a missing id', () => {
      const errors = validateSync(plainToInstance(ItemGetManyQueryDto, {}));

      expect(errors).toEqual([]);
    });

    it('refuses an id that is not a positive integer', () => {
      const errors = validateSync(plainToInstance(ItemGetManyQueryDto, { tagId: 'fragile' }));

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toEqual({ matches: 'tagId must be a positive integer' });
    });

    it('documents the id as not required', () => {
      const property: unknown = Reflect.getMetadata(
        'swagger/apiModelProperties',
        ItemGetManyQueryDto.prototype,
        'tagId',
      );

      expect(property).toMatchObject({ required: false });
    });
  });
});
