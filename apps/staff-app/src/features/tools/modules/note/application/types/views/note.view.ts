export interface INoteView {
  id: string;
  subjectType: string;
  subjectId: string;
  title: string;
  body: string;
  authorId: string;
  resolved: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}
