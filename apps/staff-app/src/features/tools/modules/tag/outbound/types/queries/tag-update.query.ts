import type { Tag } from '@acme-staff/common/entities';

export type ITagUpdateQuery = Pick<Tag, 'id' | 'name'>;
