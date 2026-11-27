export const repoSpec = {
  category: 'repo:spec',
  pattern: 'spec/**',
  capture: [],
  allow: [
    'child_process',
    'eslint',
    'eslint-import-resolver-typescript',
    'fs',
    'os',
    'path',
    'typescript',
    'typescript-eslint',

    'spec/**',
  ],
};
