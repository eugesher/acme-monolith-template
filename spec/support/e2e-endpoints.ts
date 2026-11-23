import { existsSync, readdirSync, readFileSync } from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

const ROOT: string = path.resolve(__dirname, '../..');
const APPS = 'apps';
const SHARED_SECTIONS = 'libs/testing/src/e2e';
const CONTROLLER = /^apps\/([^/]+)\/src\/(.+)\/shell\/([^/]+)\.controller\.ts$/;
const SUBMODULE = /\/modules\/[^/]+$/;
const CASE = /\bit(\.each\([\s\S]*?\))?\(/;

export interface IEndpoint {
  controller: string;
  handler: string;
}

export interface IE2ESources {
  read: (file: string) => string | null;
  testFiles: (app: string) => string[];
}

function* filesUnder(relPath: string): Generator<string> {
  const entries = readdirSync(path.join(ROOT, relPath), { withFileTypes: true });

  for (const entry of entries) {
    const child = path.join(relPath, entry.name);

    if (entry.isDirectory() && entry.name !== 'node_modules') {
      yield* filesUnder(child);
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      yield child;
    }
  }
}

const classOf = (file: string, code: string): ts.ClassDeclaration | undefined => {
  const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true);

  return source.statements.find(ts.isClassDeclaration);
};

const methodsOf = (declaration: ts.ClassDeclaration): ts.MethodDeclaration[] =>
  declaration.members.filter(ts.isMethodDeclaration);

export const routeHandlersOf = (file: string, code: string): string[] => {
  const declaration = classOf(file, code);
  const methods = declaration ? methodsOf(declaration) : [];

  return methods
    .filter((method) => (ts.getDecorators(method) ?? []).length > 0)
    .map((method) => method.name.getText());
};

export const e2eFilesOf = (controller: string): string[] => {
  const match = CONTROLLER.exec(controller);

  if (!match) {
    return [];
  }

  const [, app, modulePath, name] = match;
  const folder = SUBMODULE.test(modulePath) ? path.dirname(modulePath) : modulePath;

  return [`${APPS}/${app}/test/${folder}/${name}.e2e.ts`, `${SHARED_SECTIONS}/${name}.e2e.ts`];
};

const camelOf = (className: string): string =>
  className.charAt(0).toLowerCase() + className.slice(1);

const violationOf = (endpoint: IEndpoint, sources: IE2ESources): string | null => {
  const { controller, handler } = endpoint;
  const candidates = e2eFilesOf(controller);
  const e2eFile = candidates.find((file) => sources.read(file) !== null);

  if (!e2eFile) {
    return `${controller} has no ${candidates.join(' or ')}`;
  }

  const code = sources.read(e2eFile) ?? '';
  const declaration = classOf(e2eFile, code);
  const className = declaration?.name?.getText() ?? e2eFile;
  const method = declaration
    ? methodsOf(declaration).find((member) => member.name.getText() === handler)
    : undefined;

  if (!method) {
    return `${className} of ${e2eFile} has no ${handler}, the endpoint of ${controller}`;
  }

  if (!CASE.test(method.getText())) {
    return `${className}.${handler} has no case`;
  }

  const [, app] = controller.split('/');
  const call = new RegExp(`\\b${camelOf(className)}\\.${handler}\\(\\)`);
  const runs = sources
    .testFiles(app)
    .map((file) => sources.read(file) ?? '')
    .some((text) => text.includes(`${className}.of(`) && call.test(text));

  return runs ? null : `${className}.${handler} is never run by the suite of ${app}`;
};

export const endpointViolations = (endpoints: IEndpoint[], sources: IE2ESources): string[] =>
  endpoints
    .map((endpoint) => violationOf(endpoint, sources))
    .filter((violation): violation is string => violation !== null);

export const repositoryEndpoints = (): IEndpoint[] =>
  [...filesUnder(APPS)]
    .filter((file) => CONTROLLER.test(file))
    .flatMap((controller) => {
      const code = readFileSync(path.join(ROOT, controller), 'utf8');

      return routeHandlersOf(controller, code).map((handler) => ({ controller, handler }));
    });

export const repositorySources: IE2ESources = {
  read: (file) =>
    existsSync(path.join(ROOT, file)) ? readFileSync(path.join(ROOT, file), 'utf8') : null,
  testFiles: (app) => [...filesUnder(`${APPS}/${app}/test`)],
};
