process.env.TZ = 'UTC';

const tsconfig = require('../tsconfig.json');

const moduleNameMapper = Object.fromEntries(
  Object.entries(tsconfig.compilerOptions.paths).map(([alias, [target]]) => [
    `^${alias.replace('/*', '/(.*)')}$`,
    `<rootDir>/${target.replace('/*', '/$1')}`,
  ]),
);

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/spec/support/global-setup.ts',
  setupFiles: ['reflect-metadata'],
  testRegex: '\\.spec.ts$',
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/.claude/'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      { tsconfig: { isolatedModules: false }, diagnostics: { ignoreCodes: [151002] } },
    ],
  },
  moduleNameMapper,
  coverageDirectory: 'coverage/unit',
  coverageReporters: ['text-summary', 'html'],
  collectCoverageFrom: [
    '{apps,core,libs}/**/*.ts',
    '!**/*.spec.ts',
    '!apps/*/test/**',
    '!libs/testing/**',
    '!**/index.ts',
    '!**/*.{port,token,enum,entity,dto,view,type,interface,const,command,query,record}.ts',
    '!**/*.module.ts',
    '!**/infrastructure/persistence/repositories/**',
    '!**/infrastructure/persistence/host/**',
    '!**/presentation/controllers/**',
    '!**/shell/*.facade.ts',
    '!apps/*/src/main.ts',
    '!libs/openapi/src/api-reference/api-reference.ts',
  ],
  coverageThreshold: {
    './{apps,core,libs}/**/*.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
  },
};
