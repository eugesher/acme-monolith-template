import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import * as path from 'path';

const ROOT: string = path.resolve(__dirname, '../..');
const JEST: string = path.join(ROOT, 'node_modules/jest/bin/jest.js');
const UNIT_CONFIG = 'jest/jest-unit.config.js';

const outputOf = (command: string, args: string[], separator: string): string[] => {
  const result = spawnSync(command, args, { cwd: ROOT, encoding: 'utf8' });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} exited with ${result.status}: ${result.stderr}`);
  }

  return result.stdout.split(separator).filter((line) => line.length > 0);
};

export const repositorySpecs = (): string[] =>
  outputOf(
    'git',
    ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', '*.spec.ts'],
    '\0',
  ).filter((file) => existsSync(path.join(ROOT, file)));

export const discoveredSpecs = (): string[] =>
  outputOf(process.execPath, [JEST, '--listTests', '--config', UNIT_CONFIG], '\n').map((file) =>
    path.relative(ROOT, file),
  );

export const discoveryViolations = (repository: string[], discovered: string[]): string[] => {
  const found = new Set(discovered);
  const held = new Set(repository);

  return [
    ...repository.filter((file) => !found.has(file)).map((file) => `jest does not find ${file}`),
    ...discovered
      .filter((file) => !held.has(file))
      .map((file) => `jest finds ${file}, which git does not hold`),
  ];
};
