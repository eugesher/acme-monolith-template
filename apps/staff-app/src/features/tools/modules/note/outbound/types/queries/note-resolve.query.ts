import type { Note } from '@acme-staff/common/entities';

export interface INoteResolveUpdateQuery extends Pick<
  Note,
  'id' | 'title' | 'body' | 'resolved' | 'version'
> {
  versionAsRead: number;
}
