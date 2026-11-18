import { Module } from '@nestjs/common';

import { NoteModule, TagModule } from './modules';

@Module({
  imports: [NoteModule, TagModule],
})
export class ToolsModule {}
