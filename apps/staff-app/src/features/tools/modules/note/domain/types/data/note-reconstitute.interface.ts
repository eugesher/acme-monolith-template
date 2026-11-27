export interface INoteReconstitute {
  id: string;
  subjectType: string;
  subjectId: string;
  title: string;
  body: string;
  authorId: string;
  resolved: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
