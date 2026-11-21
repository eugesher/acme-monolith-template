import { existsSync, readdirSync, readFileSync } from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

const ROOT = path.resolve(__dirname, '../..');
const APPS = 'apps';
const SKIPPED = new Set(['spec']);
const AUTH_LIB = '@acme-libs/auth';
const DECORATOR = 'RequiresPermission';
const MODULE = 'AuthPermissionModule';

export interface IAppPermissionUse {
  app: string;
  requiring: string[];
  mounting: string[];
}

function* sourceFiles(root: string, relPath: string): Generator<string> {
  const entries = readdirSync(path.join(root, relPath), { withFileTypes: true });

  for (const entry of entries) {
    const child = path.join(relPath, entry.name);

    if (entry.isDirectory() && !SKIPPED.has(entry.name)) {
      yield* sourceFiles(root, child);
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      yield child;
    }
  }
}

const authNamesOf = (root: string, file: string): string[] => {
  const code = readFileSync(path.join(root, file), 'utf8');
  const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true);

  return source.statements.flatMap((statement) => {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier) ||
      statement.moduleSpecifier.text !== AUTH_LIB
    ) {
      return [];
    }

    const bindings = statement.importClause?.namedBindings;

    if (!bindings || !ts.isNamedImports(bindings)) {
      return [];
    }

    return bindings.elements.map((element) => (element.propertyName ?? element.name).text);
  });
};

export const appPermissionUses = (root = ROOT): IAppPermissionUse[] =>
  readdirSync(path.join(root, APPS), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(path.join(root, APPS, entry.name, 'src')))
    .map(({ name: app }) => {
      const files = [...sourceFiles(root, path.join(APPS, app, 'src'))].map((file) => ({
        file,
        names: authNamesOf(root, file),
      }));
      const requiring = files.filter(({ names }) => names.includes(DECORATOR));
      const mounting = files.filter(({ names }) => names.includes(MODULE));

      return {
        app,
        requiring: requiring.map(({ file }) => file),
        mounting: mounting.map(({ file }) => file),
      };
    });

export const permissionModuleViolations = (
  uses: IAppPermissionUse[],
): { app: string; violation: string }[] =>
  uses
    .filter(({ requiring, mounting }) => requiring.length > 0 && mounting.length === 0)
    .map(({ app, requiring }) => ({
      app,
      violation: `${DECORATOR} is ignored without ${MODULE}, which no file of the app imports: ${requiring.join(', ')}`,
    }));
