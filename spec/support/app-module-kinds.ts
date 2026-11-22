import { existsSync, readdirSync } from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '../..');
const APPS = 'apps';
const SUBMODULES = 'modules';
const SHELL = 'shell';
const INDEX = 'index.ts';
const LAYERS = ['domain', 'outbound', 'application', 'infrastructure', SHELL];
const AREAS = {
  features: {
    layers: [...LAYERS, 'presentation'],
    suffix: '.controller.ts',
    missing: 'a feature must have a controller in shell/',
  },
  processors: {
    layers: LAYERS,
    suffix: '.processor.ts',
    missing: 'a processor must have a .processor.ts in shell/',
  },
};

export type AreaType = keyof typeof AREAS;

export interface IModuleFolder {
  relPath: string;
  name: string;
  area: AreaType;
  nested: boolean;
  files: string[];
  folders: string[];
  shellFiles: string[];
}

const entriesOf = (root: string, relPath: string): Pick<IModuleFolder, 'files' | 'folders'> => {
  if (!existsSync(path.join(root, relPath))) {
    return { files: [], folders: [] };
  }

  const entries = readdirSync(path.join(root, relPath), { withFileTypes: true });

  return {
    files: entries.filter((e) => e.isFile()).map((e) => e.name),
    folders: entries.filter((e) => e.isDirectory()).map((e) => e.name),
  };
};

function* modulesIn(
  root: string,
  relPath: string,
  area: AreaType,
  nested: boolean,
): Generator<IModuleFolder> {
  for (const name of entriesOf(root, relPath).folders) {
    const module = { relPath: path.join(relPath, name), name, area, nested };
    const entries = entriesOf(root, module.relPath);
    const shellFiles = entriesOf(root, path.join(module.relPath, SHELL)).files;

    yield { ...module, ...entries, shellFiles };

    if (!nested && entries.folders.includes(SUBMODULES)) {
      yield* modulesIn(root, path.join(module.relPath, SUBMODULES), area, true);
    }
  }
}

export const appModules = (root = ROOT): IModuleFolder[] =>
  entriesOf(root, APPS).folders.flatMap((app) =>
    (Object.keys(AREAS) as AreaType[]).flatMap((area) => [
      ...modulesIn(root, path.join(APPS, app, 'src', area), area, false),
    ]),
  );

export const moduleKindViolationOf = ({
  name,
  area,
  nested,
  files,
  folders,
  shellFiles,
}: IModuleFolder): string | null => {
  const moduleFile = `${name}.module.ts`;
  const isAggregator = folders.includes(SUBMODULES);

  if (isAggregator && nested) {
    return 'a submodule may not aggregate modules of its own';
  }

  const rootFile = isAggregator ? moduleFile : INDEX;
  const allowedFolders = isAggregator ? [SUBMODULES] : AREAS[area].layers;
  const extras = [
    ...folders.filter((folder) => !allowedFolders.includes(folder)).map((folder) => `${folder}/`),
    ...files.filter((file) => file !== rootFile),
  ];

  if (extras.length > 0) {
    const kind = isAggregator
      ? `an aggregator holds only ${SUBMODULES}/`
      : 'a regular module holds only layer folders';

    return `${kind} and ${rootFile}, found: ${extras.join(', ')}`;
  }

  if (!files.includes(rootFile)) {
    return `has no ${rootFile}`;
  }

  if (isAggregator) {
    return null;
  }

  if (!shellFiles.includes(moduleFile)) {
    return `has no ${SHELL}/${moduleFile}`;
  }

  return shellFiles.some((file) => file.endsWith(AREAS[area].suffix)) ? null : AREAS[area].missing;
};

export const moduleKindViolations = (): { module: string; violation: string }[] =>
  appModules().flatMap((module) => {
    const violation = moduleKindViolationOf(module);

    return violation === null ? [] : [{ module: module.relPath, violation }];
  });
