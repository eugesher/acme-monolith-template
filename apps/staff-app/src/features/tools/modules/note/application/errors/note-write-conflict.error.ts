export class NoteWriteConflictError extends Error {
  constructor(
    noteId: string,
    public readonly currentVersion: number,
  ) {
    super(`Optimistic write conflict on note ${noteId} (current version ${currentVersion})`);
    this.name = 'NoteWriteConflictError';
  }
}
