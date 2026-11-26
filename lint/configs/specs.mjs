import jestPlugin from 'eslint-plugin-jest';

import { barrelBypassSelectors } from '../syntax/barrel-bypass.selectors.mjs';
import { moduleConstTypeSelectors } from '../syntax/module-const-type.selectors.mjs';

export const specs = {
  files: [
    '**/*.spec.ts',
    '**/*.e2e-spec.ts',
    'apps/*/test/**/*.ts',
    'test/system/**/*.ts',
    'libs/testing/src/**/*.e2e.ts',
  ],
  extends: [jestPlugin.configs['flat/recommended']],
  rules: {
    '@typescript-eslint/no-extraneous-class': [
      'error',
      { allowEmpty: true, allowStaticOnly: true, allowWithDecorator: true },
    ],
    '@typescript-eslint/unbound-method': 'off',
    'jest/expect-expect': 'error',
    'jest/no-commented-out-tests': 'error',
    'jest/no-disabled-tests': 'error',
    'jest/unbound-method': 'error',
    'jest/valid-expect': ['error', { asyncMatchers: ['toBreakRule', 'toPassArchitectureLint'] }],
    'no-restricted-syntax': ['error', ...barrelBypassSelectors, ...moduleConstTypeSelectors],
  },
};
