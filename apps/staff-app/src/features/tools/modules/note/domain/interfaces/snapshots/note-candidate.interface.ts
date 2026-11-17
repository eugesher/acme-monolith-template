export interface INoteCandidate {
  subjectType: string;
  subjectId: string;
  body: string;
  authorId: string;
  resolved: boolean;
  version: number;
}
