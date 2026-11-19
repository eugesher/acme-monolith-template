import { PageResponseType } from '@acme-libs/http';

import { ProductResponseDto } from './product.response.dto';

export class ProductPageResponseDto extends PageResponseType(ProductResponseDto) {}
