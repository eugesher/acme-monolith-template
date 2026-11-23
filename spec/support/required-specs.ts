import { existsSync, readdirSync, readFileSync } from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

const ROOT: string = path.resolve(__dirname, '../..');
const TOPS = ['apps', 'core', 'libs'];
const SKIPPED = new Set(['node_modules', 'dist', 'spec', 'test']);
const INPUT_DTO = /\.(request|query|param)\.dto\.ts$/;

function* sourceFiles(relPath: string): Generator<string> {
  const entries = readdirSync(path.join(ROOT, relPath), { withFileTypes: true });

  for (const entry of entries) {
    const child = path.join(relPath, entry.name);

    if (entry.isDirectory() && !SKIPPED.has(entry.name)) {
      yield* sourceFiles(child);
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      yield child;
    }
  }
}

const declaresValidation = (file: string): boolean => {
  const code = readFileSync(path.join(ROOT, file), 'utf8');
  const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true);

  return source.statements.some(
    (node) =>
      ts.isClassDeclaration(node) &&
      node.members.some((member) => ts.canHaveDecorators(member) && ts.getDecorators(member)),
  );
};

const isRequired = (file: string): boolean =>
  file.endsWith('.controller.ts') || (INPUT_DTO.test(file) && declaresValidation(file));

export const requiredSpecSubjects = (): string[] =>
  TOPS.filter((top) => existsSync(path.join(ROOT, top))).flatMap((top) => {
    const files = [...sourceFiles(top)];

    return files.filter(isRequired);
  });

export const existsInRepository = (file: string): boolean => existsSync(path.join(ROOT, file));

export const specOf = (subject: string): string =>
  path.join(path.dirname(subject), 'spec', `${path.basename(subject, '.ts')}.spec.ts`);

export const missingSpecs = (subjects: string[], exists: (file: string) => boolean): string[] =>
  subjects
    .filter((subject) => !exists(specOf(subject)))
    .map((subject) => `${subject} has no ${specOf(subject)}`);
