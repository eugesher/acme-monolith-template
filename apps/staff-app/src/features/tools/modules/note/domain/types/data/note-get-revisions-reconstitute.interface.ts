export interface INoteGetRevisionsReconstitute {
  id: string;
  noteId: string;
  noteVersion: number;
  titleBefore: string;
  titleAfter: string;
  bodyBefore: string;
  bodyAfter: string;
  editorId: string;
  correlationId: string;
  recordedAt: Date;
}
