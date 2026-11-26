import { PageResponseType } from '@acme-libs/http';

import { TagResponseDto } from './tag.response.dto';

export class TagPageResponseDto extends PageResponseType(TagResponseDto) {}
