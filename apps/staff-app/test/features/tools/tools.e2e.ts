import { NoteE2E } from './modules/note.e2e';
import { TagE2E } from './modules/tag.e2e';
import type { AppE2EContext } from '../../context/app-e2e.context';

export class ToolsE2E {
  private constructor(
    private readonly noteE2E: NoteE2E,
    private readonly tagE2E: TagE2E,
  ) {}

  public static of(ctx: AppE2EContext): ToolsE2E {
    return new ToolsE2E(NoteE2E.of(ctx), TagE2E.of(ctx));
  }

  public execute(): void {
    describe('Note', () => {
      this.noteE2E.getList();
      this.noteE2E.getDetails();
      this.noteE2E.getRevisions();
      this.noteE2E.create();
      this.noteE2E.update();
      this.noteE2E.resolve();
      this.noteE2E.delete();
    });

    describe('Tag', () => {
      this.tagE2E.getMany();
      this.tagE2E.create();
      this.tagE2E.update();
      this.tagE2E.delete();
    });
  }
}
