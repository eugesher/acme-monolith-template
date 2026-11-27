import type { IPage } from '@acme-libs/toolkit';

export type INoteGetListView = IPage<{
  id: string;
  subjectType: string;
  subjectId: string;
  title: string;
  authorId: string;
  resolved: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}>;
