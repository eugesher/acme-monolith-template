export interface INoteDeleteRepositoryPort {
  softDelete(noteId: string): Promise<void>;
}

export const NOTE_DELETE_REPOSITORY_PORT = Symbol('NOTE_DELETE_REPOSITORY_PORT');
