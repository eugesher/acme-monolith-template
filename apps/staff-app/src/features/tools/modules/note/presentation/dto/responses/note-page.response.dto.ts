import { PageResponseType } from '@acme-libs/http';

import { NoteResponseDto } from './note.response.dto';

export class NotePageResponseDto extends PageResponseType(NoteResponseDto) {}
