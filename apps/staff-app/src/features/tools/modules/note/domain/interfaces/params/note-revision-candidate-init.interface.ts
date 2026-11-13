export interface INoteRevisionCandidateInit {
  noteId: string;
  noteVersion: number;
  bodyBefore: string;
  bodyAfter: string;
  editorId: string;
  correlationId: string;
}
