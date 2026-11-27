import boundariesPlugin from 'eslint-plugin-boundaries';
import { join } from 'path';

const root = join(import.meta.dirname, '../../..');

export const boundariesOf = (categories, policies) => [
  {
    files: ['**/*.ts'],
    plugins: { boundaries: boundariesPlugin },
    settings: {
      'import/resolver': { typescript: { project: join(root, 'tsconfig.json') } },
      'boundaries/root-path': root,
      'boundaries/dependency-nodes': ['import', 'export', 'dynamic-import'],
      'boundaries/legacy-templates': false,
      'boundaries/files': categories,
      'boundaries/files-single-match': true,
    },
    rules: {
      'boundaries/no-unknown-dependencies': 'error',
      'boundaries/dependencies': [
        'error',
        { default: 'disallow', checkAllOrigins: true, checkUnknownLocals: true, policies },
      ],
    },
  },
  {
    files: ['apps/**/*.ts', 'core/**/*.ts', 'libs/**/*.ts'],
    rules: { 'boundaries/no-unknown-files': 'error' },
  },
];
