import { ApiResponseProperty } from '@nestjs/swagger';
import type { Type } from '@nestjs/common';

import type { IPage } from '@acme-libs/toolkit';

export const PageResponseType = <TItem>(item: Type<TItem>): Type<IPage<TItem>> => {
  class PageResponseDto implements IPage<TItem> {
    @ApiResponseProperty({ example: 1 })
    public page: number;

    @ApiResponseProperty({ example: 20 })
    public limit: number;

    @ApiResponseProperty({ example: 20 })
    public count: number;

    @ApiResponseProperty({ example: 3 })
    public pageCount: number;

    @ApiResponseProperty({ example: 42 })
    public total: number;

    @ApiResponseProperty({ type: [item] })
    public data: TItem[];
  }

  return PageResponseDto;
};
