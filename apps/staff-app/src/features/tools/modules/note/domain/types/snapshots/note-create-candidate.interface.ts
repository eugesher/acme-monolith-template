export interface INoteCreateCandidate {
  subjectType: string;
  subjectId: string;
  title: string;
  body: string;
  authorId: string;
  resolved: boolean;
  version: number;
}
