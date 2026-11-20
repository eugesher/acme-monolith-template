export const e2e = {
  files: ['apps/*/test/**/*.ts', 'test/system/**/*.ts', 'libs/testing/src/**/*.e2e.ts'],
  rules: {
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    'jest/expect-expect': ['error', { assertFunctionNames: ['expect', 'request.**.expect'] }],
    'jest/no-export': 'off',
    'jest/no-standalone-expect': ['error', { additionalTestBlockFunctions: ['afterEach'] }],
  },
};
