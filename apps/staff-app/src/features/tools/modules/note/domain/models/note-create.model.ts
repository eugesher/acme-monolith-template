import { NoteAggregate } from '../aggregates/note.aggregate';
import type {
  INoteCreateCandidate,
  INoteCreateCandidateInit,
  INoteCreateLoggerPayload,
  INoteReconstitute,
} from '../types';

export class NoteCreateModel extends NoteAggregate {
  public static initCandidate(proposal: INoteCreateCandidateInit): INoteCreateCandidate {
    const { subjectType, subjectId, body, authorId } = proposal;
    const validSubjectType = NoteCreateModel.validSubjectType(subjectType);
    const validSubjectId = NoteCreateModel.validSubjectId(subjectId);
    const validBody = NoteCreateModel.validBody(body);

    return {
      subjectType: validSubjectType,
      subjectId: validSubjectId,
      body: validBody,
      authorId,
      resolved: false,
      version: 1,
    };
  }

  public static reconstitute(this: void, record: INoteReconstitute): NoteCreateModel {
    return new NoteCreateModel(record);
  }

  public toLoggerPayload(): INoteCreateLoggerPayload {
    return {
      id: this.id,
      subjectType: this.subjectType,
      subjectId: this.subjectId,
      authorId: this.authorId,
    };
  }
}
